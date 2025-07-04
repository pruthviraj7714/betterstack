import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { BASE_URL } from "./config";
import request from "supertest";
import { prisma } from "@repo/store"


describe("user signup", () => {
    it("should fail if username is not passed", async () => {
    const res = await request(BASE_URL).post("/user/signup").send({});
    expect(res.status).toBe(400);
  });

  it("should fail if password is not passed", async () => {
    const res = await request(BASE_URL).post("/user/signup").send({ username: "test" });
    expect(res.status).toBe(400);
  });

  it("should succeed if username and password are passed", async () => {
    const res = await request(BASE_URL)
      .post("/user/signup")
      .send({ username: Math.random().toString(), password: Math.random().toString() });

    expect(res.statusCode).toBe(201);
  });

  it("should fail if username is already taken", async () => {
    await request(BASE_URL)
    .post("/user/signup")
    .send({ username: "test", password: "test1234" });

    const res = await request(BASE_URL)
      .post("/user/signup")
      .send({ username: "test", password: "test" });

    expect(res.status).toBe(400);
  });
});

describe("user signin", () => {
    beforeAll(async () => {
        await prisma.user.create({
            data : {
                username : Math.random().toString(),
                password : Math.random().toString()
            }
        })
    })

  it("should fail if username doesn't exist", async () => {
    const res = await request(BASE_URL)
      .post("/user/signin")
      .send({ username: "test2", password: "anything" });

    expect(res.status).toBe(400);
  });

  it("should fail if password is incorrect", async () => {
    const res = await request(BASE_URL)
      .post("/user/signin")
      .send({ username: "test", password: "wrongpass" });

    expect(res.status).toBe(403);
  });

  it("should succeed if username and password are correct", async () => {
    const res = await request(BASE_URL)
      .post("/user/signin")
      .send({ username: "test", password: "test1234" });

    expect(res.status).toBe(200);
    expect(res.body.jwt).toBeDefined();
  });
});
