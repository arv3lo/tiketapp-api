import { Router } from "express";
import jwt from "jsonwebtoken"

import { loginUser } from "@auth/ports/use-cases/login-user";
import { registerUser } from "@auth/ports/use-cases/register-user";
import { validateLoginInput, validateRegisterInput } from "@auth/ports/auth.port";
import { getUser } from "@user/ports/use-cases/get-users";
import { ERROR_MESSAGE } from "@/common/enums";
import { authentication } from '@/middlewares'
import { generateAccessToken, generateRefreshToken, hashToken } from "@/config/tokens";
import { RefreshToken } from "./adapters/mongodb/token-schema";

const router = Router()

router.get('/me', authentication, async (req, res) => {
    try {
        const userID = req.user?.id;
        if (!userID) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND });
        else {
            const user = await getUser(userID);
            res.status(200).json({ user })
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.post('/login', async (req, res) => {
    try {
        const loginInput = validateLoginInput(req.body);
        const { accessToken, refreshToken } = await loginUser(loginInput);

        res.status(200).json({ refreshToken, accessToken });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.post('/register', async (req, res) => {
    try {
        const registerInput = validateRegisterInput(req.body);
        const user = await registerUser(registerInput);

        res.status(200).json({ user });
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : ERROR_MESSAGE.UNKNOWN_ERROR

        res.status(400).json({ message: errorMessage });
    }
})

router.post('/refresh', async (req, res) => {
    try {
        // TODO: validate this
        const { refreshToken, deviceId } = req.body;
        if (!refreshToken) return res.status(401).json({ message: ERROR_MESSAGE.LOGIN_ERROR });

        // TODO: move all this logic into a separate service | use case
        const decoded = jwt.verify(refreshToken, Bun.env.REFRESH_TOKEN_SECRET || "");
        const userID = decoded.userId || ""

        const tokenHash = hashToken(refreshToken);

        const tokenExists = await RefreshToken.findOne({ user: userID })
        if (!tokenExists) {
            await RefreshToken.deleteMany({ user: userID });
            return res.status(403).json({ message: "Possible refresh token reuse detected. All sessions revoked" })
        }

        await tokenExists.deleteOne();

        const newAccessToken = generateAccessToken(userID);
        const newRefreshToken = generateRefreshToken(userID);

        await RefreshToken.create({
            user: userID,
            tokenHash: hashToken(newRefreshToken),
            expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
            userAgent: req.headers['user-agent'],
            ip: req.ip,
            deviceId
        })

        res.status(200).json({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken
        })

    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : ERROR_MESSAGE.UNKNOWN_ERROR

        res.status(403).json({ message: errorMessage });
    }
})

router.get('/sessions', async (req, res) => {
    // ...
})

router.post('/logout', async (req, res) => {
    // ...
})

router.post('/logout-all', (req, res) => {
    res.json({ msg: 'Logout' })
})

export default router;