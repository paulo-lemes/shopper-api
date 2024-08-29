import { afterAll, beforeAll, describe } from "@jest/globals";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "../../src/env";
import { errorHandler } from "../../src/error-handler";
import { prisma } from "../../src/lib/prisma";
import { getList } from "../../src/routes/get-list";

let app: ReturnType<typeof fastify>;

beforeAll(async () => {
  app = fastify();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);
  app.register(getList);
  await app.listen({ port: env.PORT });
  await app.ready();

  await prisma.measure.deleteMany();
});

afterAll(async () => {
  await prisma.measure.deleteMany();
  await app.close();
});

describe("GET /:costumer_code/list", () => {
  it("shouldn't list measures with invalid query param", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/1234/list?measure_type=AGUA",
    });

    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "INVALID_TYPE");
    expect(payload).toHaveProperty(
      "error_description",
      "Tipo de medição não permitida"
    );
  });

  it("shouldn't list measures with invalid param", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/1234/list",
    });

    expect(response.statusCode).toBe(404);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("error_code", "MEASURES_NOT_FOUND");
    expect(payload).toHaveProperty(
      "error_description",
      "Nenhuma leitura encontrada"
    );
  });

  it("should properly list measures", async () => {
    const measure = await prisma.measure.create({
      data: {
        customer_code: "1234",
        image_url: "tempUrl",
        measure_datetime: "2024-08-20T15:00:00Z",
        measure_type: "GAS",
        measure_value: 100,
        created_at: "2024-08-20T16:00:00Z",
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/1234/list",
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("costumer_code", "1234");
    expect(payload).toHaveProperty("measures", [
      {
        has_confirmed: false,
        image_url: "tempUrl",
        measure_datetime: "2024-08-20T15:00:00.000Z",
        measure_type: "GAS",
        measure_uuid: measure.measure_uuid,
      },
    ]);
  });
});
