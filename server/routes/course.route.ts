import express from 'express';
import { addAnswers, addQuestions, addReplyToReview, addReview, deletCourse, editCourse, getAllCourse, getCourseByValidUser, getSingleCourse, uploadCourse } from '../controllers/course.controler';
const courseRouter = express.Router();
import { authorizeRoles, isAuthenticate } from '../middleware/auth';

courseRouter.post('/create-course',isAuthenticate,authorizeRoles("admin"), uploadCourse);
courseRouter.put('/edit-course/:id',isAuthenticate,authorizeRoles("admin"), editCourse);
courseRouter.get('/get-Course/:id', getSingleCourse);
courseRouter.get('/get-AllCourse', getAllCourse);
courseRouter.get('/get-Course-ByValid-user',isAuthenticate, getCourseByValidUser);
courseRouter.put('/add-Questions',isAuthenticate, addQuestions);
courseRouter.put('/add-answer',isAuthenticate, addAnswers);
courseRouter.put('/add-review/:id',isAuthenticate, addReview);
courseRouter.put('/add-reply',isAuthenticate, authorizeRoles("admin"), addReplyToReview);
courseRouter.put('/get-all-courses',isAuthenticate, authorizeRoles("admin"), getAllCourse);
courseRouter.put('/delete-course/:id',isAuthenticate, authorizeRoles("admin"), deletCourse);





export default courseRouter;