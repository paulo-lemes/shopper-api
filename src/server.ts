import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { errorHandler } from "./error-handler";
import { getList } from "./routes/get-list";
import { patchConfirm } from "./routes/patch-confirm";
import { postUpload } from "./routes/post-upload";

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
