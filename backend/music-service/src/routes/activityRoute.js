import express from "express";
import { logActivity, getRecentActivity } from "../controllers/activityController.js";

const activityRouter = express.Router();

activityRouter.post("/log", logActivity);
activityRouter.get("/user/:userId", getRecentActivity);

export default activityRouter;
