import cors from "cors";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

export default function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/", routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}
