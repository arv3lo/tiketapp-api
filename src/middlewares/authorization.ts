import type { NextFunction, Request, Response } from "express";
import { AUTH_ERROR_MESSAGE } from "@/common/enums";


export const authorize = (userRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.user && req.user.role === userRole) {
                next();
            } else throw new Error(AUTH_ERROR_MESSAGE.UNAUTHORIZED);
        } catch (ex) {
            const errorMessage = ex instanceof Error ? ex.message : AUTH_ERROR_MESSAGE.UNAUTHORIZED
            res.status(401).send(errorMessage);
        }
    }
}
