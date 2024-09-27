"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGauge = UserGauge;
const prom_client_1 = __importDefault(require("prom-client"));
const ActiveUserGauge = new prom_client_1.default.Gauge({
    name: "active_user", // Changed from "active-user" to "active_user"
    help: "Current number of active users",
    labelNames: ["method", "route"]
});
function UserGauge(req, res, next) {
    ActiveUserGauge.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path
    });
    res.on("finish", () => {
        ActiveUserGauge.dec({
            method: req.method,
            route: req.route ? req.route.path : req.path, // Fixed to match the same logic as increment
        });
    });
    next();
}
