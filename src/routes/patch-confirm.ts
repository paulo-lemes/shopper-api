import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/prisma";

export async function patchConfirm(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/confirm",
    {
      schema: {
        body: z.object({
          measure_uuid: z.string().uuid(),
          confirmed_value: z.coerce.number(),
        }),
      },
    },
    async (request) => {
      const { measure_uuid, confirmed_value } = request.body;

      const existingMeasure = await prisma.measure.findUnique({
        where: {
          measure_uuid,
        },
      });

      if (!existingMeasure) {
        const error = new ClientError();
        error.name = "MEASURE_NOT_FOUND";
        error.message = "Leitura não encontrada";
        throw error;
      }

      if (existingMeasure.has_confirmed) {
        const error = new ClientError();
        error.name = "CONFIRMATION_DUPLICATE";
        error.message = "Leitura do mês já realizada";
        throw error;
      }

      await prisma.measure.update({
        where: { measure_uuid },
        data: {
          measure_value: confirmed_value,
          has_confirmed: true,
        },
      });

      return { success: true };
    }
  );
}
