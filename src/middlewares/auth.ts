import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export function authentication(req: Request, res: Response, next: NextFunction) {
    const token = req.header(Bun.env.AUTH_TOKEN_KEY || "");
    if (!token) return res.status(401).send('Access denied. No token provided');
    try {
        const decoded = jwt.verify(token, Bun.env.AUTH_TOKEN_SECRET || "");
        req.userId = decoded?._id || "";
        req.role = decoded?.role || "";
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
        // return new Response(JSON.stringify({ message: "Invalid token" }), {
        //     status: 400,
        //     headers: { "Content-Type": "application/json" }
        // })
    }
}
