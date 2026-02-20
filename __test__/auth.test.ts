import { test, expect, describe, beforeEach, afterEach, jest } from "bun:test";
import { faker } from "@faker-js/faker";

import type { TUser } from "../src/modules/user/adapters/mongodb/user.schema";
import { USER_ROLE } from "../src/common/enums"
import { generateAuthToken } from "../src/modules/auth/ports/auth.port";
import { authentication } from "../src/middlewares";

describe('Testing authN/authZ middlewares', () => {
  let user: Partial<TUser>;
  let token: string;
  describe('Testing authentication middleware', () => {
    beforeEach(() => {
      user = {
        _id: faker.database.mongodbObjectId(),
        role: USER_ROLE.ADMIN,
      }
      token = generateAuthToken(user);
    })

    afterEach(() => {
      user = {};
      token = "";
    })

    test('should throw error if no token is provided', () => {
      const req = new Request({
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      const res = new Response();
      const next = jest.fn();

      authentication(req, res, next);
      expect(req.user).toMatchObject(user);
    })
  })
})
