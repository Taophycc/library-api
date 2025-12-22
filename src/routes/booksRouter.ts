import type { FastifyPluginAsync } from "fastify";
import Book from "../models/books";
import { Op } from "sequelize";

interface BookParams {
  id: string;
  title?: string;
  author?: string;
}

interface BookBody {
  title: string;
  author: string;
}

const booksRouter: FastifyPluginAsync = async (fastify, _opts) => {
  // GET /api/books - Retrieves the complete library inventory.

  fastify.get("/", async (_req, reply) => {
    try {
      const books = await Book.findAll();
      return reply.send(books);
    } catch (error) {
      console.error("Error occured:", (error as Error).message);
      return reply.status(500).send(error);
    }
  });

  // GET /api/books/requested - Retrieves specific books that have active user requests.
  fastify.get("/requested", async (req, reply) => {
    try {
      const requestedBooks = await Book.findAll({
        where: {
          requests: {
            [Op.gt]: 0,
          },
        },
        order: [["requests", "DESC"]],
      });

      return reply.send(requestedBooks);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  // GET /api/books/:id - Retrieves a single book by its primary key (ID).
  fastify.get<{ Params: BookParams }>("/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const book = await Book.findByPk(id);
      if (!book) {
        reply.status(404).send({ message: `Book with id ${id} not found` });
        return;
      }
      return reply.send(book);
    } catch (error) {
      console.error("Error occured:", (error as Error).message);
      return reply.status(500).send(error);
    }
  });

  // POST /api/books - Adds a new book to the inventory or increments the count if it already exists.

  fastify.post<{ Body: BookBody }>("/", async (req, reply) => {
    const { title, author } = req.body;
    try {
      const existingBook = await Book.findOne({ where: { title, author } });
      if (existingBook) {
        await existingBook.increment("count");
        await existingBook.reload();
        return reply.send({
          message: "Added another copy to inventory",
          book: existingBook,
        });
      }
      const newBook = await Book.create({ title, author });
      return reply.status(201).send(newBook);
    } catch (error) {
      console.error("Error occured:", (error as Error).message);
      return reply.status(500).send(error);
    }
  });

  // POST /api/books/request - Allows users to request/wishlist a book.

  fastify.post<{ Body: BookBody }>("/request", async (req, reply) => {
    const { title, author } = req.body;

    try {
      const book = await Book.findOne({ where: { title, author } });

      if (book) {
        await book.increment("requests");
        await book.reload();
        return reply.send({
          message: "Request logged for existing book.",
          book,
        });
      } else {
        const newBook = await Book.create({
          title,
          author,
          count: 0,
          requests: 1,
        });
        return reply.status(201).send({
          message: "New book requested!",
          book: newBook,
        });
      }
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  // PUT /api/books/:id - Updates the details of an existing book.

  fastify.put<{ Body: BookBody; Params: BookParams }>(
    "/:id",
    async (req, reply) => {
      const { id } = req.params;
      const { title, author } = req.body;
      try {
        const book = await Book.findByPk(id);
        if (!book) {
          return reply
            .status(404)
            .send({ message: `Book with id ${id} not found` });
        }
        const updatedBook = await book.update({ title, author });
        return reply.send(updatedBook);
      } catch (error) {
        console.error("Error occured:", (error as Error).message);
        return reply.status(500).send(error);
      }
    }
  );

  // DELETE /api/books/:id - Removes a book from the inventory.

  fastify.delete<{ Params: BookParams }>("/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const book = await Book.findByPk(id);
      if (!book) {
        return reply
          .status(404)
          .send({ message: `Book with id ${id} not found` });
      }
      await book.destroy();
      return reply.send({ message: `Book with id ${id} deleted successfully` });
    } catch (error) {
      console.error("Error occured:", (error as Error).message);
      return reply.status(500).send(error);
    }
  });
};

export default booksRouter;
