const request = require("supertest");
const app = require("./server");

describe("Node.js Application Tests", () => {

    test("Home page should return status 200", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    });

    test("Health endpoint should return status 200", async () => {
        const response = await request(app).get("/health");
        expect(response.statusCode).toBe(200);
    });

});