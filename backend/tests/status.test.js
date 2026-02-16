const request = require("supertest");
const app = require("../app");

jest.mock("../services/llm/gemini.service", () => ({
  generateActionItemsWithGemini: jest.fn(),
  checkGeminiHealth: jest.fn().mockResolvedValue(true)
}));


describe("Health Check API", () => {

  test("should return 200 and service status", async () => {

    const res = await request(app).get("/api/status"); 

    expect(res.statusCode).toBe(200);
expect(res.body).toHaveProperty("backend");
expect(res.body).toHaveProperty("database");
expect(res.body).toHaveProperty("llm");

  });

});