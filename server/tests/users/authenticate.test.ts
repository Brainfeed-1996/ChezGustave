import bcrypt from "bcrypt";

import database from "../../src/database";
import User from "../../src/entities/User";
import supertest from "supertest";
import app from "../../src/app";
import { initAndClearDatabase } from "../utils";

describe('Authenticate', () => {
  beforeEach(async () => {
    await initAndClearDatabase();

    database.getRepository(User).insert({
      first_name: "first name",
      last_name: "last name",
      password_hash: await bcrypt.hash("$£°a+ù%è`²47G\"(@", 12),
      email: "mail@example.xyz",
      phone_number: "0000000000",
      admin: false,
    });
  });

  test("Authentificate success", async () => {
    const response = await supertest(app).post("/authentificate").send({
      email: "mail@example.xyz",
      password: "$£°a+ù%è`²47G\"(@",
    });

    const users = database.getRepository(User);

    const user = await users.findOne({
      where: { email: "mail@example.xyz" },
    });

    expect(user).not.toBeNull();
    if (user == null) {
      return;
    }

    const {
      session_token,
      session_token_expiration,
    } = user;

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ token: session_token + ":mail@example.xyz" });
    expect(session_token_expiration > new Date()).toBe(true);
  });

  test("Authenticate bad email", async () => {
    const response = await supertest(app).post("/authentificate").send({
      email: "wrong_email@example.xyz",
      password: "$£°a+ù%è`²47G\"(@",
    });

    const users = database.getRepository(User);

    const user = await users.findOne({
      where: { email: "mail@example.xyz" },
    });

    expect(user).not.toBeNull();
    if (user == null) {
      return;
    }

    const {
      session_token,
      session_token_expiration,
    } = user;

    expect(response.status).toBe(401);
    expect(response.text).toBe("Unauthorized");
    expect(session_token).toBeNull();
    expect(session_token_expiration).toBeNull();
  });


  test("Authenticate bad password", async () => {
    const response = await supertest(app).post("/authentificate").send({
      email: "mail@example.xyz",
      password: "$£°a+ù%èbad_password`²47G\"(@",
    });

    const users = database.getRepository(User);

    const user = await users.findOne({
      where: { email: "mail@example.xyz" },
    });

    expect(user).not.toBeNull();
    if (user == null) {
      return;
    }

    const {
      session_token,
      session_token_expiration,
    } = user;

    expect(response.status).toBe(401);
    expect(response.text).toBe("Unauthorized");
    expect(session_token).toBeNull();
    expect(session_token_expiration).toBeNull();
  });
});