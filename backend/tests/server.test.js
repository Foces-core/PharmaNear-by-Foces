import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import { mongoServerInstance } from "../config/db.js";

describe("Server basic endpoints", () => {

  beforeAll(async () => {
    if(mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => mongoose.connection.once("open",resolve));
    }
  });

  afterAll(async () => {
    // Close mongoose connection to prevent jest from hanging
    await mongoose.connection.close();
    if (mongoServerInstance) {
      await mongoServerInstance.stop();
    }
  });

  it("should respond to the root route", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("server check");
  });
});
