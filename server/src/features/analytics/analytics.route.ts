import express from "express";
import { authorizeRoles, isAuthenticate } from "../../core/middleware/auth";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "./analytics.controller";

const analyticsRoute = express.Router();

analyticsRoute.get("/get-users-analytics", isAuthenticate, authorizeRoles('admin'), getUserAnalytics)
analyticsRoute.get("/get-course-analytics", isAuthenticate, authorizeRoles('admin'), getCourseAnalytics)

analyticsRoute.get("/get-order-analytics", isAuthenticate, authorizeRoles('admin'), getOrderAnalytics)

export default analyticsRoute