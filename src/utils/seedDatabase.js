import db from "../config/database.js";

async function createTables() {
  await db.run(
    `CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      bank_account TEXT NOT NULL,
      ifsc TEXT NOT NULL
    )`,
  );

  await db.run(
    `CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      royalty_per_sale INTEGER NOT NULL,
      FOREIGN KEY(author_id) REFERENCES authors(id)
    )`,
  );

  await db.run(
    `CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      sale_date TEXT NOT NULL,
      FOREIGN KEY(book_id) REFERENCES books(id)
    )`,
  );

  await db.run(
    `CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(author_id) REFERENCES authors(id)
    )`,
  );

  console.log("Database tables created successfully");
}

async function seedData() {
  const authorCount = await db.get("SELECT COUNT(*) as count FROM authors");

  if (authorCount.count === 0) {
    console.log("Seeding database with initial data...");

    await db.run(
      `INSERT INTO authors (id, name, email, bank_account, ifsc) VALUES
        (1, 'Priya Sharma', 'priya@email.com', '1234567890', 'HDFC0001234'),
        (2, 'Rahul Verma', 'rahul@email.com', '0987654321', 'ICIC0005678'),
        (3, 'Anita Desai', 'anita@email.com', '5678901234', 'SBIN0009012')`,
    );

    await db.run(
      `INSERT INTO books (id, title, author_id, royalty_per_sale) VALUES
        (1, 'The Silent River', 1, 45),
        (2, 'Midnight in Mumbai', 1, 60),
        (3, 'Code & Coffee', 2, 75),
        (4, 'Startup Diaries', 2, 50),
        (5, 'Poetry of Pain', 2, 30),
        (6, 'Garden of Words', 3, 40)`,
    );

    await db.run(
      `INSERT INTO sales (book_id, quantity, sale_date) VALUES
        (1, 25, '2025-01-05'),
        (1, 40, '2025-01-12'),
        (2, 15, '2025-01-08'),
        (3, 60, '2025-01-03'),
        (3, 45, '2025-01-15'),
        (4, 30, '2025-01-10'),
        (5, 20, '2025-01-18'),
        (6, 10, '2025-01-20')`,
    );

    console.log("Database seeded successfully");
  } else {
    console.log("Database already contains data, skipping seed");
  }
}

export async function initializeDatabase() {
  await createTables();
  await seedData();
}
