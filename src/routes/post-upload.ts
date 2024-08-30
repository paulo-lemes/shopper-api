import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { analyzeImageMeasurement } from "../lib/googleapi";
import { prisma } from "../lib/prisma";
import { extractIntegerNumber } from "../utils";

export async function postUpload(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/upload",
    {
      schema: {
        body: z.object({
          image: z.string().base64(),
          customer_code: z.string().min(1),
          measure_datetime: z.string().datetime(),
          measure_type: z.enum(["WATER", "GAS"]),
        }),
      },
    },
    async (request) => {
      const { image, customer_code, measure_datetime, measure_type } =
        request.body;

      const existingMeasures = await prisma.measure.findMany({
        where: {
          customer_code,
          measure_type,
        },
      });

      const targetMonth = new Date(measure_datetime).getMonth();

      const hasMatchingMonth = existingMeasures.some(
        (measure) =>
          new Date(measure.measure_datetime).getMonth() === targetMonth
      );

      if (hasMatchingMonth) {
        const error = new ClientError();
        error.name = "DOUBLE_REPORT";
        error.message = "Leitura do mês já realizada";
        throw error;
      }

      const geminiAnalysis = await analyzeImageMeasurement(image);
      const measure_value = extractIntegerNumber(geminiAnalysis.promptResponse);
      const image_url = geminiAnalysis.imageUrl;

      const newMeasure = await prisma.measure.create({
        data: {
          customer_code,
          image_url,
          measure_datetime,
          measure_type,
          measure_value,
        },
      });

      return {
        image_url,
        measure_value,
        measure_uuid: newMeasure.measure_uuid,
      };
    }
  );
}
