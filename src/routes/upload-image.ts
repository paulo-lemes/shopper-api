import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { analyzeImageMeasurement } from "../lib/gemini";
import { prisma } from "../lib/prisma";

export async function uploadImage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/upload",
    {
      schema: {
        body: z.object({
          image: z.string().base64(),
          customer_code: z.string(),
          measure_datetime: z.string().datetime(),
          measure_type: z.enum(["WATER", "GAS"]),
        }),
      },
    },
    async (request) => {
      const { image, customer_code, measure_datetime, measure_type } =
        request.body;

      const existingMeasure = await prisma.measure.findFirst({
        where: {
          customer_code,
          measure_type,
        },
      });

      if (
        existingMeasure?.measure_datetime.getMonth() ===
        new Date(measure_datetime).getMonth()
      ) {
        const error = new ClientError();
        error.name = "DOUBLE_REPORT";
        error.message = "Leitura do mês já realizada";
        throw error;
      }

      const geminiAnalysis = await analyzeImageMeasurement(image);
      const measure_value = parseInt(geminiAnalysis);
      
      const image_url = "test";

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
