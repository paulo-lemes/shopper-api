import { Prisma } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/prisma";

const measureTypes = ["WATER", "GAS"];

export async function list(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:costumer_code/list",
    {
      schema: {
        params: z.object({
          costumer_code: z.string().min(1),
        }),
        querystring: z.object({
          measure_type: z.string().toUpperCase().optional(),
        }),
      },
    },
    async (request) => {
      const { costumer_code } = request.params;
      const { measure_type } = request.query;

      const filterMeasures: Prisma.MeasureWhereInput = {
        customer_code: costumer_code,
      };

      if (measure_type) {
        if (!measureTypes.includes(measure_type)) {
          const error = new ClientError();
          error.name = "INVALID_TYPE";
          error.message = "Tipo de medição não permitida";
          throw error;
        }
        filterMeasures.measure_type = measure_type;
      }

      const measures = await prisma.measure.findMany({
        where: filterMeasures,
        select: {
          measure_uuid: true,
          measure_datetime: true,
          measure_type: true,
          has_confirmed: true,
          image_url: true,
        },
      });

      if (!measures.length) {
        const error = new ClientError();
        error.name = "MEASURES_NOT_FOUND";
        error.message = "Nenhuma leitura encontrada";
        throw error;
      }

      return { costumer_code, measures };
    }
  );
}
