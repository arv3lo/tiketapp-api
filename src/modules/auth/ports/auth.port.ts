import z from "zod";

import { type TRefreshToken } from "@auth/adapters/mongodb/token-schema";
import { USER_ROLE } from "@/common/enums";

export interface AuthRepository {
    loginUser(payload: RefreshTokenInput): Promise<TRefreshToken>
    logoutUser(payload: RefreshTokenInput): Promise<boolean>
    // for dev purposes only
    // registerUser(events: TEventInput[]): Promise<TEvent[] | null>
    // getAllSessions(event: TEventInput): Promise<TEvent | null>
    // logoutAllDevices(id: string, event: TEventInput): Promise<TEvent | null>
}

export type RefreshTokenInput = {
    userId: string;
    refreshToken: string;
    deviceId: string;
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