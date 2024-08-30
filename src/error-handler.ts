import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { ClientError } from "./errors/client-error.ts";

type FastifyErrorHandler = FastifyInstance["errorHandler"];
const codeError = {
  INVALID_TYPE: 400,
  INVALID_DATA: 400,
  MEASURE_NOT_FOUND: 404,
  MEASURES_NOT_FOUND: 404,
  CONFIRMATION_DUPLICATE: 409,
  DOUBLE_REPORT: 409,
};

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      error_code: "INVALID_DATA",
      error_description: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof ClientError) {
    const statusCode = codeError[error.name as keyof typeof codeError] || 400;
    reply.status(statusCode).send({
      error_code: error.name,
      error_description: error.message,
    });
    return;
  }

  return reply
    .status(500)
    .send({ message: `Internal server error - ${error.message}` });
};
