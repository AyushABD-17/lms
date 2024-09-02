import { Schema } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import NotificationModel from "../models/notificationModel";
import ErrorHandler from "../utils/ErrorHandler";
import corn from "node-cron";

export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {}
  }
);

export const updateNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Notification not Found", 404));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification?.status;
      }
      await notification.save();
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
);

//    delete notification
corn.schedule("0 0 0 * * *", async () => {
  const thrityDaysAgo = new Date(Date.now() - 30 * 24 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createedAt: { $lt: thrityDaysAgo },
  });
  console.log("Deleted all the notification");
});
