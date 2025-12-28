import _ from "lodash"
import { Types } from "mongoose";

import { UserService } from "@user/ports/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import User, { type TUser } from "@user/adapters/mongodb/user.schema";
import { HISTORY_TYPE, HISTORY_OBJECT, ERROR_MESSAGE } from "@/common/enums";

const userService = new UserService(new MongooseUserRepo(User));

export const loginUser = async (user: TUser) => {
    const userFound = await userService.findUsers({ email: user.email });
    if (!userFound) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    const validPassword = await Bun.password.verify(user.password, userFound[0].password || "");
    if (!validPassword) throw new Error(ERROR_MESSAGE.LOGIN_ERROR);

    const token = userFound[0].generateAuthToken();
    
    await userFound[0].generateHistory({
        type: HISTORY_TYPE.AUTH_LOGIN,
        description: 'Connexion',
        obj: userFound[0]._id as unknown as Types.ObjectId,
        model: HISTORY_OBJECT.USER
    })

    return { token }
}