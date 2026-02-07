import withdrawalService from "../services/withdrawalService.js";

class WithdrawalController {
  async createWithdrawal(req, res) {
    try {
      const authorId = Number(req.body.author_id);
      const amount = Number(req.body.amount);

      if (!authorId || !amount) {
        return res
          .status(400)
          .json({ error: "author_id and amount are required" });
      }

      const withdrawal = await withdrawalService.createWithdrawal(
        authorId,
        amount,
      );

      res.status(201).json(withdrawal);
    } catch (err) {
      console.error("Error creating withdrawal:", err);

      if (err.statusCode === 404) {
        return res.status(404).json({ error: err.message });
      }

      if (err.message.includes("Minimum") || err.message.includes("exceeds")) {
        return res.status(400).json({ error: err.message });
      }

      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new WithdrawalController();
