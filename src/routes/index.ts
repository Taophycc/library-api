import type { FastifyPluginAsync } from "fastify";
import booksRouter from "./booksRouter.js";

const routes: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.register(booksRouter, { prefix: "/books" });
};

export default routes;
