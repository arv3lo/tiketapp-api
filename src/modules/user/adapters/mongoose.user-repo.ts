import type { IUserFilter, IUserRepository } from "../ports/user-repository.interface";
import User, { type TUser, type TUserInput } from "../ports/user.schema";

export class MongooseUserRepo implements IUserRepository {
    constructor(private readonly user: typeof User) { }

    findUsers(filters?: IUserFilter): Promise<TUser[]> {
        return this.user.find(formatFilter(filters || {}));
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

// this filter depends of what orm/odm is used 
// that's why it's here and not in the controller
// (it adapts the filter to the orm/odm, hence the adapter)
const formatFilter = (filters: IUserFilter) => {
    const fullnameFilter = filters.fullname ? { fullname: { $regex: filters.fullname, $options: "i" } } : {};
    return { ...filters, ...fullnameFilter }
}

