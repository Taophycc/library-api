import fastify from "fastify";
import formbody from "@fastify/formbody";
import routes from "./routes/index";

const app = fastify();
const PORT = 3000;

const startServer = async () => {
  try {
    await app.register(formbody);
    await app.register(routes, { prefix: "/api" });

    app.get("/", async (_request, reply) => {
      reply.send({ message: "Welcome to the Library API" });
    });

    app.setNotFoundHandler(async (request, reply) => {
      reply.status(404).send({
        message: `Route ${request.method}:${request.url} not found`,
        error: "Not Found",
        statusCode: 404,
      });
    });

    await app.listen({ port: PORT });
    console.log(`Listening at http://localhost:${PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
