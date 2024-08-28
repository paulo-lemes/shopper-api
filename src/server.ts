import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { errorHandler } from "./error-handler";
import { confirm } from "./routes/confirm";
import { upload } from "./routes/upload";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(upload);
app.register(confirm);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running!");
});
