import Fastify from "fastify";
import process from "node:process";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", function (_, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/ping", function (_, reply) {
  reply.send("pong");
});

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exitCode = 1;
  }
  // Server is now listening on ${address}
  console.log(`server is on ${address}`);
});
