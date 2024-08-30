import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { errorHandler } from "./error-handler.ts";
import { getList } from "./routes/get-list.ts";
import { patchConfirm } from "./routes/patch-confirm.ts";
import { postUpload } from "./routes/post-upload.ts";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(postUpload);
app.register(patchConfirm);
app.register(getList);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running!");
});
