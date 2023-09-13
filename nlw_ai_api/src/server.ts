import { fastify } from "fastify";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";

const app = fastify()

app.register(getAllPromptsRoute) //todos os modulos (getAllPromptsRoute, nesse caso) usando o register devem ser asincronos
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)

app.listen({
  port:3333,
}).then(() => {
  console.log('HTTP Server running')
})

