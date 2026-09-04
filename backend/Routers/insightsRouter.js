import express from "express";
import { getInsightsController } from "../controllers/insightsController.js";

const router = express.Router();

router.route("/getInsights").post(getInsightsController);

export default router;