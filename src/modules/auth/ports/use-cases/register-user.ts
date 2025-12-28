import _ from "lodash"
import { Types } from "mongoose";

import { UserService } from "@user/ports/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import User, { type TUser } from "@user/adapters/mongodb/user.schema";
import { HISTORY_TYPE, HISTORY_OBJECT, ERROR_MESSAGE } from "@/common/enums";
import { createHistory } from "@history/ports/use-cases/create-history";

const userService = new UserService(new MongooseUserRepo(User));

export const registerUser = async (user: TUser) => {
    const userFound = await userService.findUsers({ email: user.email });
    if (userFound) throw new Error(ERROR_MESSAGE.ALREADY_EXISTS);

    const newUser = await userService.createUser(user);
    if (!newUser) throw new Error(ERROR_MESSAGE.NOT_CREATED);

    await createHistory({
        user: newUser._id as unknown as Types.ObjectId,
        obj: newUser._id as unknown as Types.ObjectId,
        type: HISTORY_TYPE.AUTH_REGISTER,
        model: HISTORY_OBJECT.USER,
        description: 'Inscription',
    })

    // await newUser.generateHistory({
    //     type: HISTORY_TYPE.AUTH_REGISTER,
    //     description: 'Inscription',
    //     obj: newUser._id as unknown as Types.ObjectId,
    //     model: HISTORY_OBJECT.USER
    // })

    return newUser
}

