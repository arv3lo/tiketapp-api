import type { TUser, TUserInput } from './user.schema';

export interface IUserRepository {
  findUsers(filters?: IUserFilter): Promise<TUser[]>;
  findUserById(id: string): Promise<TUser | null>;
  // for dev purposes only
  bulkCreateUsers(users: TUserInput[]): Promise<TUser[] | null>;
  createUser(user: TUserInput): Promise<TUser | null>;
  updateUser(id: string, user: Partial<TUserInput>): Promise<TUser | null>;
}

export interface IUserFilter {
    fullname?: string;
    email?: string;
    role?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: number; // 1 | -1
}

