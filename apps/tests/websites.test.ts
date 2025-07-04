import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { prisma } from "@repo/store";
import { sign } from "jsonwebtoken";
import request from "supertest";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

async function createUser(): Promise<{
  userId: string;
  jwt: string;
}> {
  const user = await prisma.user.create({
    data: {
      username: Math.random().toString(),
      password: Math.random().toString(),
    },
  });

  const jwt = sign({ sub: user.id }, process.env.JWT_SECRET!);

  return {
    userId: user.id,
    jwt,
  };
}

beforeAll(async () => {
  await prisma.website.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.website.deleteMany();
  await prisma.user.deleteMany();
});

describe("adding website in db", () => {
  it("it should failed if url & auth header is not passed", async () => {
    const res = await request(BASE_URL).post("/website").send({});
    expect(res.status).toBe(401);
  });

  it("it should failed if auth header is not passed", async () => {
    const res = await request(BASE_URL)
      .post("/website")
      .set("authorization", "")
      .send({});
    expect(res.status).toBe(401);
  });

  it("it should succeed if url & valid jwt token is passed", async () => {
    const userMeta = await createUser();

    const res = await request(BASE_URL)
      .post("/website")
      .set("Authorization", `Bearer ${userMeta.jwt}`)
      .send({
        url: "https://google.com",
      });

    expect(res.status).toBe(201);
  });

  it("it should fail if invalid jwt token passed", async () => {
    const res = await request(BASE_URL)
      .post("/website")
      .set("Authorization", `Bearer invalidjwte3w423`)
      .send({
        url: "https://google.com",
      });

    expect(res.status).toBe(403);
  });

  it("it should fail if valid jwt token passed but url is missing", async () => {
    const user = await createUser();
    const res = await request(BASE_URL)
      .post("/website")
      .set("Authorization", `Bearer ${user.jwt}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("deleting website", () => {
  it("it should fail if invalid AUTH token not passed", async () => {
    const res = await request(BASE_URL)
      .delete("/website/:testId")
      .set("authorization", "Bearer testes")
      .send({});

    expect(res.status).toBe(403);
  });

  it("it should fail if websiteId is not given in params", async () => {
    const user = await createUser();

    const res = await request(BASE_URL)
      .delete("/website")
      .set("authorization", `Bearer ${user.jwt}`)
      .send({});

    expect(res.status).toBe(404);
  });

  it("it should fail if wrong website Id is given in params", async () => {
    const user = await createUser();

    const res = await request(BASE_URL)
      .delete("/website/aweawsfawe")
      .set("authorization", `Bearer ${user.jwt}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("it should fail if other user try do delete other's website", async () => {
    const user1 = await createUser();
    const user2 = await createUser();

    const res1 = await axios.post(
      `${BASE_URL}/website`,
      {
        url: "https://user1.xyz",
      },
      {
        headers: {
          Authorization: `Bearer ${user1.jwt}`,
        },
      }
    );

    const websiteId = res1.data.website.id;

    const res2 = await request(BASE_URL)
      .delete(`/website/${websiteId}`)
      .set("authorization", `Bearer ${user2.jwt}`);
    expect(res2.status).toBe(403);
  });

  it("it should successed if user fill right creds & data", async () => {
    const user = await createUser();

    const res = await axios.post(
      `${BASE_URL}/website`,
      {
        url: "https://user.xyz",
      },
      {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      }
    );

    const websiteId = res.data.website.id;

    const res2 = await request(BASE_URL)
      .delete(`/website/${websiteId}`)
      .set("authorization", `Bearer ${user.jwt}`);
    expect(res2.status).toBe(200);
  });
});
