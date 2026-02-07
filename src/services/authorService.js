import db from "../config/database.js";

class AuthorService {
  async getAllAuthors() {
    return db.all(
      `SELECT a.id, a.name,
              COALESCE(SUM(s.quantity * b.royalty_per_sale), 0) AS total_earnings,
              COALESCE(SUM(s.quantity * b.royalty_per_sale), 0) - COALESCE(w.total_withdrawn, 0) AS current_balance
       FROM authors a
       LEFT JOIN books b ON b.author_id = a.id
       LEFT JOIN sales s ON s.book_id = b.id
       LEFT JOIN (
         SELECT author_id, SUM(amount) AS total_withdrawn
         FROM withdrawals
         GROUP BY author_id
       ) w ON w.author_id = a.id
       GROUP BY a.id, a.name
       ORDER BY a.id`,
    );
  }

  async getAuthorById(authorId) {
    const author = await db.get(
      `SELECT id, name, email
       FROM authors
       WHERE id = ?`,
      [authorId],
    );

    if (!author) return null;

    const books = await db.all(
      `SELECT b.id, b.title, b.royalty_per_sale,
              COALESCE(SUM(s.quantity), 0) AS total_sold,
              COALESCE(SUM(s.quantity * b.royalty_per_sale), 0) AS total_royalty
       FROM books b
       LEFT JOIN sales s ON s.book_id = b.id
       WHERE b.author_id = ?
       GROUP BY b.id, b.title, b.royalty_per_sale
       ORDER BY b.id`,
      [authorId],
    );

    const totals = await db.get(
      `SELECT
          COALESCE(SUM(s.quantity * b.royalty_per_sale), 0) AS total_earnings,
          COALESCE(SUM(s.quantity * b.royalty_per_sale), 0) - COALESCE(w.total_withdrawn, 0) AS current_balance
       FROM books b
       LEFT JOIN sales s ON s.book_id = b.id
       LEFT JOIN (
         SELECT author_id, SUM(amount) AS total_withdrawn
         FROM withdrawals
         GROUP BY author_id
       ) w ON w.author_id = b.author_id
       WHERE b.author_id = ?`,
      [authorId],
    );

    return {
      id: author.id,
      name: author.name,
      email: author.email,
      current_balance: totals.current_balance,
      total_earnings: totals.total_earnings,
      total_books: books.length,
      books,
    };
  }

  async getAuthorSales(authorId) {
    const author = await db.get("SELECT id FROM authors WHERE id = ?", [
      authorId,
    ]);

    if (!author) return null;

    return db.all(
      `SELECT b.title AS book_title,
              s.quantity,
              (s.quantity * b.royalty_per_sale) AS royalty_earned,
              s.sale_date
       FROM sales s
       INNER JOIN books b ON b.id = s.book_id
       WHERE b.author_id = ?
       ORDER BY s.sale_date DESC, s.id DESC`,
      [authorId],
    );
  }

  async getAuthorWithdrawals(authorId) {
    const author = await db.get("SELECT id FROM authors WHERE id = ?", [
      authorId,
    ]);

    if (!author) return null;

    return db.all(
      `SELECT id, amount, status, created_at
       FROM withdrawals
       WHERE author_id = ?
       ORDER BY created_at DESC, id DESC`,
      [authorId],
    );
  }

  async getCurrentBalance(authorId) {
    return db.get(
      `SELECT
          COALESCE(SUM(s.quantity * b.royalty_per_sale), 0) AS total_earnings,
          COALESCE(SUM(s.quantity * b.royalty_per_sale), 0) - COALESCE(w.total_withdrawn, 0) AS current_balance
       FROM books b
       LEFT JOIN sales s ON s.book_id = b.id
       LEFT JOIN (
         SELECT author_id, SUM(amount) AS total_withdrawn
         FROM withdrawals
         GROUP BY author_id
       ) w ON w.author_id = b.author_id
       WHERE b.author_id = ?`,
      [authorId],
    );
  }

  async authorExists(authorId) {
    const author = await db.get("SELECT id FROM authors WHERE id = ?", [
      authorId,
    ]);
    return !!author;
  }
}

export default new AuthorService();
