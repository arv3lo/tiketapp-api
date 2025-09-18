import type { TUser, TUserInput } from './user.schema';

export interface IUserRepository {
  findUsers(filters?: IUserFilter): Promise<TUser[]>;
  findUserById(id: string): Promise<TUser | null>;
  // for dev purposes only
  bulkCreateUsers(users: TUserInput[]): Promise<TUser[] | null>;
  createUser(user: TUserInput): Promise<TUser | null>;
  updateUser(id: string, user: TUserInput): Promise<TUser | null>;
  deleteUser(id: string): Promise<TUser | null>;
}

export interface IUserFilter {
    fullname?: string;
    email?: string;
    role?: string;
}

