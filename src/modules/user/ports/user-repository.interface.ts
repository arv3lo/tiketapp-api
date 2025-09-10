import type { TUser, TUserInput } from './user.schema';

export interface UserRepository {
  findUsers(): Promise<TUser[]>;
  findUserById(id: string): Promise<TUser | null>;
  bulkCreateUsers(users: TUserInput[]): Promise<TUser[] | null>;
  createUser(user: TUserInput): Promise<TUser | null>;
  updateUser(id: string, user: TUserInput): Promise<TUser | null>;
  deleteUser(id: string): Promise<TUser | null>;
}
