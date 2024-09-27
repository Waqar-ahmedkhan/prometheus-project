"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RequestCount_1 = require("./metrics/RequestCount");
const prom_client_1 = __importDefault(require("prom-client"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Mock API data
const products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
];
app.use(RequestCount_1.requestCountMiddleware);
app.use((req, res, next) => {
    const startdate = Date.now();
    next();
    const endDate = Date.now();
    console.log(`total ms:`, endDate - startdate, "ms");
});
// GET all products
app.get("/products", (req, res) => {
    res.json(products);
});
app.get("/metrics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const metrics = yield prom_client_1.default.register.metrics();
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.end(metrics);
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
