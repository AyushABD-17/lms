import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../../core/middleware/catchAsyncError";
import OrderModel from "./order.model";

export const newOrder = CatchAsyncError(async (data: any, next: NextFunction, res: Response) => {
  const order = await OrderModel.create(data);
  res.status(201).json({
    success: true,
    order,
  })
})

export const getAllOrdersService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    orders,
  });
}