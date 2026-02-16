const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const ActionItem = require("../models/ActionItem");

const app = require("../app");

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
    await ActionItem.deleteMany();
});

describe("Action Item API", () => {

    test("should create action item", async () => {
        const validTranscriptId = new mongoose.Types.ObjectId().toString();


        const res = await request(app)
            .post("/api/actions")
            .send(
                {
                    transcriptId: validTranscriptId,
                    task: "Test task",
                    owner: "Khushi"
                }
            );

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
       expect(res.body.data.task).toBe("Test task");
    });

    test("should return 400 for empty task", async () => {
        const validTranscriptId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .post("/api/actions")
            .send([
                {
                    transcriptId: validTranscriptId,
                    task: ""
                }
            ]);

        expect(res.statusCode).toBe(400);
    });


    test("should update action item", async () => {
        const item = await ActionItem.create({
            transcriptId: new mongoose.Types.ObjectId(),
            task: "Old Task"
        });

        const res = await request(app)
            .patch(`/api/actions/${item._id}`)
            .send({ task: "Updated Task" });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.task).toBe("Updated Task");
    });


    test("should toggle status", async () => {
        const item = await ActionItem.create({
            transcriptId: new mongoose.Types.ObjectId(),
            task: "Toggle Task",
            status: "open"
        });

        const res = await request(app)
            .patch(`/api/actions/${item._id}/status`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe("done");
    });


    test("should delete action item", async () => {
        const item = await ActionItem.create({
            transcriptId: new mongoose.Types.ObjectId(),
            task: "Delete Task"
        });

        const res = await request(app)
            .delete(`/api/actions/${item._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        const deleted = await ActionItem.findById(item._id);
        expect(deleted).toBeNull();
    });


    test("should return 400 for invalid ID", async () => {
        const res = await request(app)
            .delete("/api/actions/invalid-id");

        expect(res.statusCode).toBe(400);
    });


});