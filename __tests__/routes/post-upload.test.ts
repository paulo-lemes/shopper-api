import { afterAll, beforeAll, describe } from "@jest/globals";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "../../src/env";
import { errorHandler } from "../../src/error-handler";
import { prisma } from "../../src/lib/prisma";
import { postUpload } from "../../src/routes/post-upload";

let app: ReturnType<typeof fastify>;

beforeAll(async () => {
  app = fastify();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);
  app.register(postUpload);
  await app.listen({ port: env.PORT });
  await app.ready();

  await prisma.measure.deleteMany();
});

afterAll(async () => {
  await prisma.measure.deleteMany();
  await app.close();
});

describe("POST /upload", () => {
  it("shouldn't create measure with missing body property", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/upload",
      payload: {
        customer_code: "1234",
        measure_datetime: new Date().toISOString(),
        measure_type: "WATER",
      },
    });

    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "INVALID_DATA");
    expect(payload).toHaveProperty("error_description");
  });

  it("shouldn't create measure with invalid body property", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/upload",
      payload: {
        image: "test",
        customer_code: "",
        measure_datetime: "2024-08-29",
        measure_type: "AGUA",
      },
    });

    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "INVALID_DATA");
    expect(payload).toHaveProperty("error_description");
  });

  it("shouldn't create duplicate measure", async () => {
    await prisma.measure.create({
      data: {
        customer_code: "123",
        image_url: "tempUrl",
        measure_datetime: "2024-08-20T15:00:00Z",
        measure_type: "GAS",
        measure_value: 100,
        created_at: "2024-08-20T16:00:00Z",
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/upload",
      payload: {
        image: "base64string",
        customer_code: "123",
        measure_datetime: "2024-08-20T15:00:00Z",
        measure_type: "GAS",
      },
    });

    expect(response.statusCode).toBe(409);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "DOUBLE_REPORT");
    expect(payload).toHaveProperty(
      "error_description",
      "Leitura do mês já realizada"
    );
  });
});
