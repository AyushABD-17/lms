import mongoose, { Document,Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document{
    user:IUser,
    question:string,
    questionReplies:IComment[];
}

interface IReview extends Document{
    user:IUser,
    rating:number,
    comment:string,
    commentReplies:IComment[],
}

interface ILinks extends Document{
    title:string,
    url:string,
}

interface ICourseData extends Document{
    title:string,
    description:string,
    videoUrl:string,
    videoThumbnail:object,
    videoSection:string,
    videoLength:number,
    videoPlayer:string,
    links:ILinks[],
    suggestions:string,
    questions:IComment[]
}

interface ICourse extends Document{
    name:string,
    description:string,
    price:number,
    estimatedPrice:number,
    thumbnail:object,
    tags:string,
    level:string,
    demoUrl:string,
    benefits:{title:string}[],
    prerequistics:{title:string}[],
    reviews:IReview[],
    courseData:ICourseData[],
    rating?:number,
    purchased?:number
}

const reviewSchema = new Schema<IReview>({
    user:Object,
    rating:{
        type:Number,
        default:0,
    },
    comment:String,
    commentReplies :[Object]
});

const linkSchema = new Schema<ILinks>({
    title:String,
    url:String,
});

const commentSchema = new Schema<IComment>({
    user:Object,
    question:String,
    questionReplies:[Object],
});

const courseDataSchema = new Schema<ICourseData>({
    videoUrl:String,
    
    title:String,
    videoSection:String,
    description:String,
    videoLength:Number,
    videoPlayer:String,
    links:[linkSchema],
    suggestions:String,
    questions:[commentSchema],

});

const courseSchema = new Schema<ICourse>({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        
        type: String,
      },
      url: {
        
        type: String,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequistics: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },{timestamps:true});
  
  const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);
  export default CourseModel;
      