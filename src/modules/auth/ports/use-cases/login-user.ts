import _ from "lodash"
import { Types } from "mongoose";

import { UserService } from "@user/ports/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import User from "@user/adapters/mongodb/user.schema";
import { HISTORY_TYPE, HISTORY_OBJECT, ERROR_MESSAGE } from "@/common/enums";
import { createHistory } from "@history/ports/use-cases/create-history";
import { type TLoginInput } from "@auth/ports/auth.port";
import { RefreshToken } from "@auth/adapters/mongodb/token-schema";
import { generateAccessToken, hashToken } from "@/config/tokens";

const userService = new UserService(new MongooseUserRepo(User));

export const loginUser = async (user: TLoginInput) => {
    const userFound = await userService.findOneUser({ email: user.email });
    if (!userFound) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    const validPassword = await Bun.password.verify(user.password, userFound.password || "");
    if (!validPassword) throw new Error(ERROR_MESSAGE.LOGIN_ERROR);

    const accessToken = generateAccessToken(`${userFound._id}`)
    const refreshToken = generateAccessToken(`${userFound._id}`)

    // const token = generateAuthToken(userFound);

    // TODO: create a service and a separate repo for this
    await RefreshToken.create({
        user: `${userFound._id}`,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
        // deviceId: "",
        // tokenHash: "",
    })

    await createHistory({
        user: userFound._id as unknown as Types.ObjectId,
        obj: userFound._id as unknown as Types.ObjectId,
        type: HISTORY_TYPE.AUTH_LOGIN,
        model: HISTORY_OBJECT.USER,
        description: 'Connexion',
    })

    return {
        accessToken,
        refreshToken
    }
}