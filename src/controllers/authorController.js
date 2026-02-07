import authorService from "../services/authorService.js";

class AuthorController {
  async getAllAuthors(req, res) {
    try {
      const authors = await authorService.getAllAuthors();
      res.json(authors);
    } catch (err) {
      console.error("Error fetching authors:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAuthorById(req, res) {
    try {
      const authorId = Number(req.params.id);
      const author = await authorService.getAuthorById(authorId);

      if (!author) {
        return res.status(404).json({ error: "Author not found" });
      }

      res.json(author);
    } catch (err) {
      console.error("Error fetching author:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAuthorSales(req, res) {
    try {
      const authorId = Number(req.params.id);
      const sales = await authorService.getAuthorSales(authorId);

      if (sales === null) {
        return res.status(404).json({ error: "Author not found" });
      }

      res.json(sales);
    } catch (err) {
      console.error("Error fetching author sales:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAuthorWithdrawals(req, res) {
    try {
      const authorId = Number(req.params.id);
      const withdrawals = await authorService.getAuthorWithdrawals(authorId);

      if (withdrawals === null) {
        return res.status(404).json({ error: "Author not found" });
      }

      res.json(withdrawals);
    } catch (err) {
      console.error("Error fetching author withdrawals:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new AuthorController();
