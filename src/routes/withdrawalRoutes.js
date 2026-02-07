import express from "express";
import withdrawalController from "../controllers/withdrawalController.js";

const router = express.Router();

router.post(
  "/",
  withdrawalController.createWithdrawal.bind(withdrawalController),
);

export default router;
