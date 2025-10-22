import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

import { isMongooseValidID } from "@/middlewares/mongoID";
import { AUTH_ERROR_MESSAGE } from "@/common/enums";

export function authentication(req: Request, res: Response, next: NextFunction) {
    const token = req.header(Bun.env.AUTH_TOKEN_KEY || "");
    if (!token) return res.status(401).send(AUTH_ERROR_MESSAGE.NO_TOKEN);
    try {
        const decoded = jwt.verify(token, Bun.env.AUTH_TOKEN_SECRET || "");
        if (decoded && decoded._id && isMongooseValidID(decoded._id as string)) {
            req.user = {
                id: decoded._id,
                role: decoded.role
            }
        } else throw new Error(AUTH_ERROR_MESSAGE.INVALID_TOKEN);
        next();
    } catch (ex) {
        res.status(400).send(AUTH_ERROR_MESSAGE.INVALID_TOKEN);
    }
}
