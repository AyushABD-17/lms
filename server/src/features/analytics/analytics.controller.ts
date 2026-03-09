import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../core/middleware/catchAsyncError";
import { generateLast12MonthsData } from "../../core/utils/analytics.generator";
import userModel from "../users/user.model";
import ErrorHandler from "../../core/utils/ErrorHandler";
import OrderModel from "../orders/order.model";
import CourseModel from "../courses/course.model";

export const getUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await generateLast12MonthsData(userModel);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getCourseAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await generateLast12MonthsData(CourseModel);
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getOrderAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await generateLast12MonthsData(OrderModel);
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
