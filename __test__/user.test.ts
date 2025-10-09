import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest"

import { generateUsers } from "../src/config/seeder";
import User from "../src/modules/user/ports/user.schema";
import server from "../src/index";

const URL = "/users"
let nbUsers = 2, userID

describe('User controller', () => {
    // TODO: we should create mock functions for user.services functions 
    beforeEach(async () => {
        const users = generateUsers(nbUsers);
        const res = await User.insertMany(users);
        userID = res[0]._id
    })

    afterEach(async () => {
        await User.deleteMany({});
        server.close();
    })

    describe('GET /', () => {
        test('should return all users', async() => {
            const res = await request(server).get(URL);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(nbUsers);// ...
        })
        
        test('should return 404 if no users found', async() => {
            await User.deleteMany({});
            const res = await request(server).get(URL);
            expect(res.status).toBe(404);
        })
    })

    describe('GET /:id', () => {
        test('should return 400 if invalid userID is sent', async() => {
            const res = await request(server).get(`${URL}/${userID}123`);
            expect(res.status).toBe(400);
        })
        
        test('should return 404 if user not found', async() => {
            const res = await request(server).get(`${URL}/${faker.database.mongodbObjectId()}`);
            expect(res.status).toBe(404);
        })
        
        test('should return one user', async() => {
            const res = await request(server).get(`${URL}/${userID}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
        })
    })

    // describe('POST /', () => {
    //     test('should return 400 if invalid request is sent', () => {
    //         // ...
    //     })
    // })

    // describe('PUT /:id', () => {
    //     test('should return 400 if invalid request is sent', () => {
    //         // ...
    //     })
    // })

    // describe('DELETE /:id', () => {
    //     test('should return 400 if invalid request is sent', () => {
    //         // ...
    //     })
    // })
})

