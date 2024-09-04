import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExists = await LayoutModel.findOne({ type });
      if (isTypeExists) {
        return next(new ErrorHandler(`${type} already Exists`, 400));
      }
      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const mycloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.create(banner);
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const catrgoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.create({
          type: "Categories",
          categories: catrgoriesItems,
        });
      }
      res.status(200).json({
        success: true,
        message: "Layout created Succesfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit layout

export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "banner" });
        const { image, title, subTitle } = req.body;
        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
        }
        const mycloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });

        const catrgoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: catrgoriesItems,
        });
      }
      res.status(200).json({
        success: true,
        message: "Layout updated Succesfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


export const getLayoutByType = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {type } = req.body
        const layout = await LayoutModel.findOne({type})
        res.status(201).json({
          success: true,
          layout
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );


