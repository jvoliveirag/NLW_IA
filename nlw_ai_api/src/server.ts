import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";

const app = fastify()

app.register(getAllPromptsRoute) //todos os modulos (getAllPromptsRoute, nesse caso) usando o register devem ser asincronos

app.listen({
  port:3333,
}).then(() => {
  console.log('HTTP Server running')
})

