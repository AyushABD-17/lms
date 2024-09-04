import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { request } from "http";
import NotificationModel from "../models/notificationModel";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// edit course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get single course
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCacheExists = await redis.get(courseId);
      if (isCacheExists) {
        const course = JSON.parse(isCacheExists);
        res.status(201).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
        );
        await redis.set(courseId, JSON.stringify(course),"EX",604800);
        res.status(201).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all Course
export const getAllCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExists = await redis.get("allCourses");
      if (isCacheExists) {
        const course = JSON.parse(isCacheExists);

        res.status(201).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
        );
        res.status(201).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get course access - to valid user

export const getCourseByValidUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseLists = req.user?.courses;
      const courseId = req.params.is;
      const courseExists = userCourseLists?.find(
        (course: any) => course._id.toString() === courseId
      );
      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add Questions
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestions = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item.id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }
      const newQuestions: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      courseContent.questions.push(newQuestions);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question",
        message: `you have a new question in  ${course?.name}`,
      });

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add answers to questions
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId } = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item.id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }

      const question = courseContent?.questions?.find((item: any) => {
        item._id.equals(questionId);
      });

      if (!question) {
        return next(new ErrorHandler("Invalid Content id", 400));
      }

      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?.id === question.user._id) {
        // notification
        await NotificationModel.create({
          user: req.user?._id,
          title: "new question reply recieved",
          message: `you have a new question reply in  ${courseContent?.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/qiestion-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }
      res.status(20).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add review
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === course.toString()
      );
      if (!courseExists) {
        return next(
          new ErrorHandler("you are not eligible to acces this course", 400)
        );
      }
      const course = await CourseModel.findById(courseId);
      const { review, rating } = req.body as IAddReviewData;
      const reviewData: any = {
        user: req.user,
        rating,
        commnet: review,
      };
      course?.reviews.push(reviewData);

      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.rating = avg / course.reviews.length;
      }
      await course?.save();

      const notification = {
        title: "New review recieved",
        message: `${req.user?.name} has been given a review in ${course?.name}`,
      };

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;
      const course = await CourseModel.findById(courseId);

      if (!courseId) {
        return next(new ErrorHandler("course not found", 400));
      }
      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler("review not found", 404));
      }
      const replyData: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies.push(replyData);
      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get al courses by admin
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deletCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);
      if (!course) {
        return next(new ErrorHandler("User not found", 404));
      }

      await CourseModel.deleteOne({ id });

      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "User deleted Succesfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

