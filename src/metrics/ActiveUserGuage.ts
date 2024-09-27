import { NextFunction, Request, Response } from "express";
import client from "prom-client";

const ActiveUserGauge = new client.Gauge({
  name: "active_user",  // Changed from "active-user" to "active_user"
  help: "Current number of active users",
  labelNames: ["method", "route"]
});

export function UserGauge(req: Request, res: Response, next: NextFunction) {
  ActiveUserGauge.inc({
    method: req.method,
    route: req.route ? req.route.path : req.path
  });

  res.on("finish", () => {
    ActiveUserGauge.dec({
      method: req.method,
      route: req.route ? req.route.path : req.path,  // Fixed to match the same logic as increment
    });
  });

  next();
}
