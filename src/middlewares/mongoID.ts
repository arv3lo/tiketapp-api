import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export function isValidID(req: Request, res: Response, next: NextFunction) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid mongoDB ID');
    next();
}
