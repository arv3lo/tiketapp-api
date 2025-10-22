import type { NextFunction, Request, Response } from "express";
import client from 'prom-client';

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
});


export function requestCounter(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.route,
            status: res.statusCode,
        });
    });
    next();
}

export default client;