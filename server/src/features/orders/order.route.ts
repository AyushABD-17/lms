import express from "express";
import { isAuthenticate } from "../../core/middleware/auth";
import { createOrder, getAllOrders } from "./order.controller";

const orderRouter = express.Router();
orderRouter.post("/create-order", isAuthenticate, createOrder);
orderRouter.post("/get-all-orders", isAuthenticate, getAllOrders);


export default orderRouter;