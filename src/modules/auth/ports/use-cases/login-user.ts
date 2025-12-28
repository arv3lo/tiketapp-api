import _ from "lodash"
import { Types } from "mongoose";

import { UserService } from "@user/ports/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import User, { type TUser } from "@user/adapters/mongodb/user.schema";
import { generateAuthToken } from "@user/ports/user.port";
import { HISTORY_TYPE, HISTORY_OBJECT, ERROR_MESSAGE } from "@/common/enums";
import { createHistory } from "@history/ports/use-cases/create-history";

const userService = new UserService(new MongooseUserRepo(User));

export const loginUser = async (user: TUser) => {
    const userFound = await userService.findOneUser({ email: user.email });
    if (!userFound) throw new Error(ERROR_MESSAGE.NOT_FOUND);
    
    const validPassword = await Bun.password.verify(user.password, userFound.password || "");
    if (!validPassword) throw new Error(ERROR_MESSAGE.LOGIN_ERROR);

    const token = generateAuthToken(userFound);

    await createHistory({
        user: userFound._id as unknown as Types.ObjectId,
        obj: userFound._id as unknown as Types.ObjectId,
        type: HISTORY_TYPE.AUTH_LOGIN,
        model: HISTORY_OBJECT.USER,
        description: 'Connexion',
    })
    
    return { token }
}