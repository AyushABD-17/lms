import express from "express";
import { authorizeRoles, isAuthenticate } from "../middleware/auth";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analytics.controller";

const analyticsRoute  = express.Router();

analyticsRoute.get("/get-users-analytics",isAuthenticate,authorizeRoles('admin'),getUserAnalytics)
analyticsRoute.get("/get-course-analytics",isAuthenticate,authorizeRoles('admin'),getCourseAnalytics)

analyticsRoute.get("/get-order-analytics",isAuthenticate,authorizeRoles('admin'),getOrderAnalytics)

export default analyticsRoute