import  express  from "express";
import { isAuthenticate } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";

const orderRouter = express.Router();
orderRouter.post ("/create-order",isAuthenticate, createOrder);
orderRouter.post ("/get-all-orders",isAuthenticate, getAllOrders);


export default orderRouter;