import { NextFunction, Request, Response } from "express";
import client from  "prom-client"



const ActiveUserGauge = new client.Gauge({
  name: "active-user",
  help: "Current number of active users",
  labelNames: ["method", "route"]

})

export function UserGauge(req:Request, res:Response, next: NextFunction){


  ActiveUserGauge.inc({
    method: req.method,
    route: req.route ? req.route.path : req.path

  })

  next();

}