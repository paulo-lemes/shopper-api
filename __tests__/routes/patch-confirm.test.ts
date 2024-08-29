import { afterAll, beforeAll, describe } from "@jest/globals";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "../../src/env";
import { errorHandler } from "../../src/error-handler";
import { prisma } from "../../src/lib/prisma";
import { patchConfirm } from "../../src/routes/patch-confirm";

let app: ReturnType<typeof fastify>;

beforeAll(async () => {
  app = fastify();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);
  app.register(patchConfirm);
  await app.listen({ port: env.PORT });
  await app.ready();

  await prisma.measure.deleteMany();
});

afterAll(async () => {
  await prisma.measure.deleteMany();
  await app.close();
});

describe("PATCH /confirm", () => {
  it("shouldn't confirm measure with missing body property", async () => {
    const response = await app.inject({
      method: "PATCH",
      url: "/confirm",
      payload: {
        confirmed_value: "100",
      },
    });

    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "INVALID_DATA");
    expect(payload).toHaveProperty("error_description");
  });

  it("shouldn't confirm measure with invalid body property", async () => {
    const response = await app.inject({
      method: "PATCH",
      url: "/confirm",
      payload: {
        measure_uuid: "",
        confirmed_value: "",
      },
    });

    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "INVALID_DATA");
    expect(payload).toHaveProperty("error_description");
  });

  it("should properly confirm measure", async () => {
    const measure = await prisma.measure.create({
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
      method: "PATCH",
      url: "/confirm",
      payload: {
        measure_uuid: measure.measure_uuid,
        confirmed_value: "200",
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("success", true);

    const confirmedMeasure = await prisma.measure.findUnique({
      where: { measure_uuid: measure.measure_uuid },
    });

    expect(confirmedMeasure?.has_confirmed).toBeTruthy();
  });

  it("shouldn't confirm measure that has already been confirmed", async () => {
    const measure = await prisma.measure.create({
      data: {
        customer_code: "123",
        image_url: "tempUrl",
        measure_datetime: "2024-08-20T15:00:00Z",
        measure_type: "GAS",
        measure_value: 100,
        created_at: "2024-08-20T16:00:00Z",
        has_confirmed: true,
      },
    });

    const response = await app.inject({
      method: "PATCH",
      url: "/confirm",
      payload: {
        measure_uuid: measure.measure_uuid,
        confirmed_value: "200",
      },
    });

    expect(response.statusCode).toBe(409);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "CONFIRMATION_DUPLICATE");
    expect(payload).toHaveProperty(
      "error_description",
      "Leitura do mês já realizada"
    );
  });

  it("shouldn't confirm inexisting measure", async () => {
    const response = await app.inject({
      method: "PATCH",
      url: "/confirm",
      payload: {
        measure_uuid: crypto.randomUUID(),
        confirmed_value: "200",
      },
    });

    expect(response.statusCode).toBe(404);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "MEASURE_NOT_FOUND");
    expect(payload).toHaveProperty(
      "error_description",
      "Leitura não encontrada"
    );
  });
});
