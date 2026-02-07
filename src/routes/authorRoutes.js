import express from "express";
import authorController from "../controllers/authorController.js";

const router = express.Router();

router.get("/", authorController.getAllAuthors.bind(authorController));
router.get("/:id", authorController.getAuthorById.bind(authorController));
router.get(
  "/:id/sales",
  authorController.getAuthorSales.bind(authorController),
);
router.get(
  "/:id/withdrawals",
  authorController.getAuthorWithdrawals.bind(authorController),
);

export default router;
