import express, { Request, Response } from "express";
import { requestCountMiddleware } from "./metrics/RequestCount";
import client from "prom-client";
import { UserGauge } from "./metrics/ActiveUserGuage";
import { Histogram } from "prom-client";
import { Histrogram } from "./metrics/Histogram";
const app = express();




const port = process.env.PORT || 3000;

// Mock API data
const products = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
];
app.use(requestCountMiddleware);
app.use(UserGauge);
app.use(Histrogram);
app.use((req, res, next) => {
  const startdate =  Date.now()
   next();
   const endDate = Date.now();
   console.log(`total ms:`, endDate - startdate, "ms" );
})
// GET all products
app.get("/products", (req, res) => {
  res.json(products);
});
app.get("/metrics", async (req:Request, res:Response) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})
app.listen(port, ()=> {
  console.log(`Server running on port ${port}`);
});