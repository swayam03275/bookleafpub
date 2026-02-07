import db from "../config/database.js";
import authorService from "./authorService.js";

class WithdrawalService {
  async createWithdrawal(authorId, amount) {
    // Validate amount
    if (amount < 500) {
      throw new Error("Minimum withdrawal is ₹500");
    }

    // Check if author exists
    const authorExists = await authorService.authorExists(authorId);
    if (!authorExists) {
      const error = new Error("Author not found");
      error.statusCode = 404;
      throw error;
    }

    // Check current balance
    const totals = await authorService.getCurrentBalance(authorId);
    if (amount > totals.current_balance) {
      throw new Error("Amount exceeds current balance");
    }

    // Create withdrawal
    const createdAt = new Date().toISOString();
    const result = await db.run(
      `INSERT INTO withdrawals (author_id, amount, status, created_at)
       VALUES (?, ?, 'pending', ?)`,
      [authorId, amount, createdAt],
    );

    const newBalance = totals.current_balance - amount;

    return {
      id: result.lastID,
      author_id: authorId,
      amount,
      status: "pending",
      created_at: createdAt,
      new_balance: newBalance,
    };
  }
}

export default new WithdrawalService();
