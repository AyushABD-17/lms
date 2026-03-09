require('dotenv').config();
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors"
import { ErrorMiddleware } from "./core/middleware/error";
import userRouter from "./features/users/user.route";
import courseRouter from "./features/courses/course.route";
import orderRouter from "./features/orders/order.route";
import notificationRoute from "./features/notifications/notification.route";
import analyticsRoute from "./features/analytics/analytics.route";
import layoutRouter from "./features/layouts/layout.route";

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

app.use(cors({
    origin: process.env.ORIGIN
}))

app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRoute);
app.use("/api/v1", analyticsRoute);
app.use("/api/v1", layoutRouter);




// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    });

});


app.use(ErrorMiddleware);