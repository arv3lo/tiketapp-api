import type { TUser, TUserInput } from "@user/ports/user.schema";
import type { IUserFilter, IUserRepository } from "@user/ports/user-repository.interface";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) { }

    async findUsers(filters?: IUserFilter): Promise<TUser[]> {
        return this.userRepository.findUsers(filters);
    }

    async findUserById(id: string): Promise<TUser | null> {
        return this.userRepository.findUserById(id);
    }

    async bulkCreateUsers(users: TUserInput[]): Promise<TUser[] | null> {
        return this.userRepository.bulkCreateUsers(users);
    }

    async createUser(user: TUserInput): Promise<TUser | null> {
        return this.userRepository.createUser(user);
    }

    async updateUser(id: string, user: TUserInput): Promise<TUser | null> {
        return this.userRepository.updateUser(id, user);
    }

    async deleteUser(id: string): Promise<TUser | null> {
        return this.userRepository.updateUser(id, { isDeleted: true });
    }
}