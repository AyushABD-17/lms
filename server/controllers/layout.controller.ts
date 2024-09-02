import cloudinary  from 'cloudinary';
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from '../models/layout.model';


export const createLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {type} = req.body
        if(type === 'Banner'){
            const {image , title , subTitle } = req.body
            const mycloud = await cloudinary.v2.uploader.upload(image,{
                folder :"layout"
            });
            const banner = {
                image:{
                    public_id:mycloud.public_id,
                    url:mycloud.secure_url,
                },
                title,
                subTitle
            };
            await LayoutModel.create(banner);


        }
        if(type ==="FAQ"){
            const {faq} = req.body
            await LayoutModel.create(faq);

        }
        if(type ==="Categories"){
            const {categories} = req.body
            await LayoutModel.create(categories);

        }
        res.status(200).json({
            success: true,
            message: "Layout created Succesfully",
          });



      } catch (error: any) {
        return next(new ErrorHandler(error.message, 404));
      }
    }
  );