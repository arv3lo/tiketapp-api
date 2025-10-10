import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { faker } from "@faker-js/faker";
import jwt from 'jsonwebtoken';

import User from "../src/modules/user/ports/user.schema";
import { USER_ROLE } from "../src/common/enums"
import { authentication } from '../src/middlewares/auth';

// Store original environment variables
const OLD_ENV = { ...process.env };

// Mock Response class
class MockResponse {
  statusCode: number = 200;
  headers: Record<string, string> = {};
  body: any = null;

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(data: any) {
    this.body = data;
    return this;
  }

  send(data: any) {
    this.body = data;
    return this;
  }
}

// Helper function to create a mock function
function createMockFn(impl?: (...args: any[]) => any) {
  const calls: any[] = [];
  
  const fn = ((...args: any[]) => {
    calls.push(args);
    return impl?.(...args);
  }) as any;
  
  fn.mock = { calls };
  fn.mockImplementation = (newImpl: (...args: any[]) => any) => {
    impl = newImpl;
    return fn;
  };
  
  return fn;
}

describe("Authentication Middleware", () => {
  let user: any;
  let validToken: string;
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    // Setup test user and token
    user = {
      _id: faker.database.mongodbObjectId(),
      fullname: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      role: USER_ROLE.ADMIN,
      generateAuthToken: function() {
        return jwt.sign({ _id: this._id, role: this.role }, 'test_secret');
      }
    };

    validToken = user.generateAuthToken();
    
    // Mock request object
    const headerFn = createMockFn((headerName: string) => {
      if (headerName === 'x-auth-token') return validToken;
      return undefined;
    });
    
    req = { header: headerFn };

    // Mock response object
    res = new MockResponse();
    
    // Mock next function
    next = createMockFn();

    // Set environment variables
    process.env.AUTH_TOKEN_KEY = 'x-auth-token';
    process.env.AUTH_TOKEN_SECRET = 'test_secret';
  });

  afterEach(() => {
    // Restore environment variables
    process.env = { ...OLD_ENV };
  });

  test("should set userId and role in request object when valid token is provided", () => {
    // Act
    authentication(req, res, next);

    // Assert
    expect(req.userId).toBe(user._id);
    expect(req.role).toBe(user.role);
    expect(next.mock.calls.length).toBe(1);
  });

  test("should return 401 when no token is provided", () => {
    // Arrange
    req.header.mockImplementation(() => undefined);

    // Act
    const response = authentication(req, res, next);

    // Assert

    expect(response?.statusCode).toBe(401);
    expect(response?.body).toBe('Access denied. No token provided');
    expect(next.mock.calls.length).toBe(0);
  });

  // test("should return 400 when invalid token is provided", () => {
  //   // Arrange
  //   req.header.mockImplementation(() => 'invalid.token.here');

  //   // Act
  //   const response = authentication(req, res, next);

  //   // Assert
  //   console.log('!!req', req)
  //   console.log('!!res', response)
  //   expect(response?.statusCode).toBe(400);
  //   expect(response?.body).toBe('Invalid token');
  //   expect(next.mock.calls.length).toBe(0);
  // });

//   test("should use custom token key from environment variables", () => {
//     // Arrange
//     process.env.AUTH_TOKEN_KEY = 'custom-token-header';
//     const customHeaderFn = createMockFn((headerName: string) => {
//       if (headerName === 'custom-token-header') return validToken;
//       return undefined;
//     });
    
//     const customReq = { header: customHeaderFn };

//     // Act
//     authentication(customReq, res, next);

//     // Assert
//     expect(customReq.userId).toBe(user._id);
//     expect(next.mock.calls.length).toBe(1);
//   });

//   test("should handle missing token secret gracefully", () => {
//     // Arrange
//     delete process.env.AUTH_TOKEN_SECRET;
    
//     // Act
//     const response = authentication(req, res, next);

//     // Assert
//     expect(response?.status).toBe(400);
//     const body = JSON.parse(response?.body);
//     expect(body.message).toBe('Invalid token');
//     expect(next.mock.calls.length).toBe(0);
//   });
});
