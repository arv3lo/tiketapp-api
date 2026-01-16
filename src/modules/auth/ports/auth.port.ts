import jwt from "jsonwebtoken"
import z from "zod";

import type { TUser } from '@user/adapters/mongodb/user.schema';
import { USER_ROLE } from "@/common/enums";

export const generateAuthToken = (user: TUser) => {
    const token = jwt.sign({
        _id: user._id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: Math.floor(Date.now() / 1000) + (60 * 360)
    }, Bun.env.AUTH_TOKEN_SECRET || "");

    return token;
}

// login payload validation
export const loginInput = z.object({
    email: z.email(),
    password: z.string().min(6).max(100),
});

export type TLoginInput = z.infer<typeof loginInput>;
export const validateLoginInput = (loginPayload: TLoginInput) => loginInput.parse(loginPayload);

// register payload validation
export const registerInput = z.object({
    fullname: z.string().min(3).max(100),
    email: z.email(),
    password: z.string().min(6).max(100),
    role: z.enum(USER_ROLE),
});

export type TRegisterInput = z.infer<typeof registerInput>;
export const validateRegisterInput = (registerPayload: TRegisterInput) => registerInput.parse(registerPayload);