import createApp from "./app.js";
import db from "./config/database.js";
import { PORT } from "./config/env.js";
import { initializeDatabase } from "./utils/seedDatabase.js";

async function startServer() {
  try {
    // Connect to database
    await db.connect();

    // Initialize database schema and seed data
    await initializeDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await db.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await db.close();
  process.exit(0);
});

startServer();
