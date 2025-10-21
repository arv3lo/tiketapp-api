import _ from "lodash"

import { UserService } from "@user/ports/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import User, { type TUser } from "@user/adapters/mongodb/user.schema";
import type { IUserFilter } from "@user/ports/user.port";
import { ERROR_MESSAGE } from "@/common/enums";

const filters = ["fullname", "email", "role"];
const inputFields = [...filters, "createdAt", "updatedAt", "_id", "isDeleted"];

const userService = new UserService(new MongooseUserRepo(User));

// TODO: dynamic error messages
// we used pick to remove password here because omit is a bit slower 
// and we met some issues using it
export const getUsers = async (filters?: IUserFilter): Promise<Partial<TUser>[]> => {
    const users = await userService.findUsers(filters);
    if (!users || users.length === 0) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return users.map(user => _.pick(user, inputFields));
}

export const getUser = async (id: string): Promise<Partial<TUser>> => {
    const user = await userService.findUserById(id);
    if (!user) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return _.pick(user, inputFields);
}
    