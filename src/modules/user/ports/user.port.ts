import z from "zod";

import { USER_ROLE } from "@/common/enums";
import type { IPaginationFields } from '@/common/interfaces';
import type { TUser } from '@user/adapters/mongodb/user.schema';

export interface IUserRepository {
  findUsers(filters?: IUserFilter): Promise<TUser[]>;
  findUserById(id: string): Promise<TUser | null>;
  // for dev purposes only
  bulkCreateUsers(users: TUserInput[]): Promise<TUser[] | null>;
  createUser(user: TUserInput): Promise<TUser | null>;
  updateUser(id: string, user: Partial<TUserInput>): Promise<TUser | null>;
}

export interface IUserFilter extends IPaginationFields {
  fullname?: string;
  email?: string;
  role?: string;
}

export const userInput = z.object({
    fullname: z.string().min(3).max(100),
    email: z.email(),
    role: z.enum(USER_ROLE, { error: "Must be a string" }),
    password: z.string("Must be between 6 and 100 alphanumeric characters").min(6).max(100),
    isDeleted: z.boolean().default(false).optional(),
});

export type TUserInput = z.infer<typeof userInput>

export const validateUser = (user: TUserInput) => userInput.parse(user);


