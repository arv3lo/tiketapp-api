import z from "zod";

import { USER_ROLE } from "@/common/enums";

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