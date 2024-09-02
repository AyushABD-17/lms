import express from "express";
import { authorizeRoles, isAuthenticate } from "../middleware/auth";
import { getNotifications, updateNotifications } from "../controllers/notification.controller";

const notificationRoute = express.Router();

notificationRoute.get("/get-all-notification",isAuthenticate,authorizeRoles("admin"),getNotifications)
notificationRoute.put("/update-notification",isAuthenticate,authorizeRoles("admin"),updateNotifications)


export default notificationRoute;