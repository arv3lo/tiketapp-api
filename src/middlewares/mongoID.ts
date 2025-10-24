import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

// simple function
export function isMongooseValidID(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

// middleware
export function isValidID(req: Request, res: Response, next: NextFunction) {
    if (!isMongooseValidID(req.params.id))
        return res.status(400).send('Invalid mongoDB ID');
    next();
}


