import type { TUser, TUserInput } from "./ports/user.schema";
import type { UserRepository } from "./ports/user-repository.interface";

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async findUsers(): Promise<TUser[]> {
        return this.userRepository.findUsers();
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
        return this.userRepository.deleteUser(id);
    }
}