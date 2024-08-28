import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { uploadImage } from "./routes/upload-image";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(uploadImage);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running!");
});
