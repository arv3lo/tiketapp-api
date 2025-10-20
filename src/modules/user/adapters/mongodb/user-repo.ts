import type { IUserFilter, IUserRepository, TUserInput } from "@/modules/user/ports/user.port";
import User, { type TUser } from "@user/adapters/mongodb/user.schema";

export class MongooseUserRepo implements IUserRepository {
    constructor(private readonly user: typeof User) { }

    async findUsers(filters?: IUserFilter): Promise<TUser[]> {
        return this.user.find(formatFilter(filters || {}))
            .skip(((filters?.page || 1) - 1) * (filters?.limit || 10))
            .limit(filters?.limit || 10)
            .sort({ [filters?.sort || 'createdAt']: filters?.order === "asc" ? 1 : -1 })
            .lean()
    }
    async findUserById(id: string): Promise<TUser | null> {
        return this.user.findById(id).lean()
    }
    
    async createUser(user: TUserInput): Promise<TUser | null> {
        return this.user.create(user);
    }
    
    async bulkCreateUsers(users: TUserInput[]): Promise<TUser[] | null> {
        const createdUsers = await this.user.insertMany(users);
        return createdUsers.map(doc => doc.toObject() as unknown as TUser);
    }

    async updateUser(id: string, user: Partial<TUserInput>): Promise<TUser | null> {
        return this.user.findByIdAndUpdate(id, user, { new: true });
    }
}

// this filter depends of what orm/odm is used 
// that's why it's here and not in the controller
// (it adapts the filter to the orm/odm, hence the adapter)
const formatFilter = (filters: IUserFilter) => {
    const fullnameFilter = filters.fullname ? { fullname: { $regex: filters.fullname, $options: "i" } } : {};
    const { limit, page, sort, order, ...rest } = filters

    return { ...rest, ...fullnameFilter, }
}

