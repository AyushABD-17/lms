import express from "express";
import { authorizeRoles, isAuthenticate } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAuthenticate,
  authorizeRoles("admin"),
  createLayout
);
layoutRouter.put(
  "/create-layout",
  isAuthenticate,
  authorizeRoles("admin"),
  editLayout
);
layoutRouter.get(
  "/get-layout",
  
  getLayoutByType
);

export default layoutRouter;
