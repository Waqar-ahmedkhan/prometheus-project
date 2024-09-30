import { NextFunction, Request, Response } from "express";
import client from "prom-client";

export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000, 9000] // Define your own buckets here
});

export function Histrogram(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();  // Capture the start time before proceeding
    res.on('finish', () => {   // Use `res.on('finish')` to measure after response is sent
        const duration = Date.now() - start;  // Calculate the duration in ms
        httpRequestDurationMicroseconds.observe(
            {
                method: req.method,
                route: req.route ? req.route.path : req.path,
                code: res.statusCode.toString(),  // Status code should be a string
            },
            duration
        );
    });

    next();
}
