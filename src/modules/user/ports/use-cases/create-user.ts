import _ from "lodash"

import { UserService } from "@user/ports/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import User, { type TUser } from "@user/adapters/mongodb/user.schema";
import type { TUserInput } from "@user/ports/user.port";
import { ERROR_MESSAGE } from "@/common/enums";

const filters = ["fullname", "email", "role"];
const inputFields = [...filters, "createdAt", "updatedAt", "_id", "isDeleted"];

const userService = new UserService(new MongooseUserRepo(User));

export const createUser = async (user: TUserInput): Promise<Partial<TUser>> => {
    const createdUser = await userService.createUser(user);
    if (!createdUser) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return _.pick(createdUser, inputFields);
}