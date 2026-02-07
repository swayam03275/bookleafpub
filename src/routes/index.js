import express from "express";
import authorRoutes from "./authorRoutes.js";
import withdrawalRoutes from "./withdrawalRoutes.js";

const router = express.Router();

router.use("/authors", authorRoutes);
router.use("/withdrawals", withdrawalRoutes);

export default router;
