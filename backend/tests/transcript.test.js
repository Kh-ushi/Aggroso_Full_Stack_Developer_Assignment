const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");
const Transcript = require("../models/Transcript");
const ActionItem = require("../models/ActionItem");

jest.mock("../services/llm/gemini.service", () => ({
    generateActionItemsWithGemini: jest.fn(),
}));

const { generateActionItemsWithGemini } = require("../services/llm/gemini.service");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

afterEach(async () => {
    await Transcript.deleteMany();
    await ActionItem.deleteMany();
    jest.clearAllMocks();
});



describe("Transcript API", () => {

    test("should create transcript and action items", async () => {
        generateActionItemsWithGemini.mockResolvedValue([
            { task: "Task 1", owner: "John", status: "open" },
            { task: "Task 2", owner: "Jane", status: "open" },
        ]);

        const res = await request(app)
            .post("/api/transcripts")
            .send({
                text: "This is a valid transcript text longer than ten characters.",
            });


        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("transcriptId");
        expect(res.body.data.actionItems.length).toBe(2);
    });

    test("should return 400 for empty transcript text", async () => {
        const res = await request(app)
            .post("/api/transcripts")
            .send({ text: "" });

        expect(res.statusCode).toBe(400);
    });

    test("should return 400 if transcript too short", async () => {
        const res = await request(app)
            .post("/api/transcripts")
            .send({ text: "short" });

        expect(res.statusCode).toBe(400);
    });

    test("should fetch transcripts with limit", async () => {
        await Transcript.create({ text: "Transcript 1" });
        await Transcript.create({ text: "Transcript 2" });

        const res = await request(app)
            .get("/api/transcripts?limit=1");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(1);
    });

    test("should return 400 for invalid limit", async () => {
        const res = await request(app)
            .get("/api/transcripts?limit=0");

        expect(res.statusCode).toBe(400);
    });

    test("should fetch transcript by ID with action items", async () => {
        const transcript = await Transcript.create({ text: "Valid transcript text" });

        await ActionItem.create({
            transcriptId: transcript._id,
            task: "Task A",
            status: "open",
        });

        const res = await request(app)
            .get(`/api/transcripts/${transcript._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.transcriptId).toBe(transcript._id.toString());
        expect(res.body.data.actionItems.length).toBe(1);
    });

    test("should return 400 for invalid transcript ID", async () => {
        const res = await request(app)
            .get("/api/transcripts/invalid-id");

        expect(res.statusCode).toBe(400);
    });

    test("should return 404 if transcript not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/transcripts/${fakeId}`);

        expect(res.statusCode).toBe(404);
    });


});