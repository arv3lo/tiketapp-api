import type { IPaginationFields } from '@/common/interfaces';
import type { TUser, TUserInput } from '@user/ports/user.schema';

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

