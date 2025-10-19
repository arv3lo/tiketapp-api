import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest"

import { generateUsers } from "../src/config/seeder";
import User from "../src/modules/user/adapters/mongodb/user.schema";
import server from "../src/index";
import { USER_ROLE } from "../src/common/enums";

const URL = "/users"
let nbUsers = 2, userID

describe('USER CONTROLLER', () => {
    // TODO: we should create mock functions for user.services functions 
    beforeEach(async () => {
        const list = generateUsers(nbUsers);
        const users = await User.insertMany(list);
        userID = users[0]._id
    })

    afterEach(async () => {
        await User.deleteMany({});
        server.close();
    })

    describe('GET /', () => {
        test('should return all users', async () => {
            const res = await request(server).get(URL);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(nbUsers);// ...
        })

        test('should return 404 if no users found', async () => {
            await User.deleteMany({});
            const res = await request(server).get(URL);
            expect(res.status).toBe(404);
        })
    })

    describe('GET /:id', () => {
        test('should return 400 if invalid userID is sent', async () => {
            const res = await request(server).get(`${URL}/${userID}123`);
            expect(res.status).toBe(400);
        })

        test('should return 404 if user not found', async () => {
            const res = await request(server).get(`${URL}/${faker.database.mongodbObjectId()}`);
            expect(res.status).toBe(404);
        })

        test('should return one user', async () => {
            const res = await request(server).get(`${URL}/${userID}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
        })
    })

    describe('POST /', () => {
        const validUser = {
            fullname: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            role: USER_ROLE.ADMIN,
            password: faker.internet.password({ length: 20, memorable: true }),
        }
        test('should return 400 if invalid request is sent', async () => {
            const res = await request(server).post(URL).send({ ...validUser, role: 10 });
            expect(res.status).toBe(400);
        })

        test('should return the newly created user', async () => {
            const res = await request(server).post(URL).send(validUser);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
        })

    })

    describe('PUT /:id', async () => {
        test('should return 400 if invalid request is sent', async () => {
            const res = await request(server).put(`${URL}/${userID}`).send({ role: 10 });
            expect(res.status).toBe(400);
        })

        test('should return the updated user', async () => {
            const res = await request(server).put(`${URL}/${userID}`).send({ role: USER_ROLE.ORGANIZER });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
        })
    })

    describe('DELETE /:id', async () => {
        test('should return 400 if invalid request is sent', async () => {
            const res = await request(server).delete(`${URL}/${userID}123`);
            expect(res.status).toBe(400);
        })

        test('should return the deleted user', async () => {
            const res = await request(server).delete(`${URL}/${userID}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.isDeleted).toBe(true);
        })
    })


})

