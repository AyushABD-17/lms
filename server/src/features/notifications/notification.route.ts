import express from "express";
import { authorizeRoles, isAuthenticate } from "../../core/middleware/auth";
import { getNotifications, updateNotifications } from "./notification.controller";

const notificationRoute = express.Router();

notificationRoute.get("/get-all-notification", isAuthenticate, authorizeRoles("admin"), getNotifications)
notificationRoute.put("/update-notification", isAuthenticate, authorizeRoles("admin"), updateNotifications)


export default notificationRoute;