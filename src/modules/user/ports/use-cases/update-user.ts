import _ from "lodash"

import { UserService } from "@user/ports/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import User, { type TUser } from "@user/adapters/mongodb/user.schema";
import type { TUserInput } from "@user/ports/user.port";
import { ERROR_MESSAGE } from "@/common/enums";

const filters = ["fullname", "email", "role"];
const inputFields = [...filters, "createdAt", "updatedAt", "_id", "isDeleted"];

const userService = new UserService(new MongooseUserRepo(User));

export const updateUser = async (id: string, user: TUserInput): Promise<Partial<TUser>> => {
    const updatedUser = await userService.updateUser(id, user);
    if (!updatedUser) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return _.pick(updatedUser, inputFields);
}

export const deleteUser = async (id: string): Promise<Partial<TUser>> => {
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return _.pick(deletedUser, inputFields);
}