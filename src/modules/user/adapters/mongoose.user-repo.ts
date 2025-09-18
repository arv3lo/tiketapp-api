import type { IUserFilter, IUserRepository } from "../ports/user-repository.interface";
import User, { type TUser, type TUserInput } from "../ports/user.schema";

export class MongooseUserRepo implements IUserRepository {
    constructor(private readonly user: typeof User) { }

    findUsers(filters?: IUserFilter): Promise<TUser[]> {
        return this.user.find(filters || {});
    }
    findUserById(id: string): Promise<TUser | null> {
        return this.user.findById(id);
    }
    createUser(user: TUserInput): Promise<TUser | null> {
        return this.user.create(user);
    }
    bulkCreateUsers(users: TUserInput[]): Promise<TUser[] | null> {
        return this.user.insertMany(users);
    }
    updateUser(id: string, user: TUserInput): Promise<TUser | null> {
        return this.user.findByIdAndUpdate(id, user);
    }
    deleteUser(id: string): Promise<TUser | null> {
        return this.user.findByIdAndDelete(id);
    }
}
