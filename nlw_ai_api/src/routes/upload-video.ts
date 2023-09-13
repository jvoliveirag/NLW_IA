import fastifyMultipart from "@fastify/multipart";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
  
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_848_576 * 25 //1MB * 25 = 25MB
    }
  })

  app.post('/videos', async (request, reply) => {
    const data =  await request.file()

    if(!data) {
      return reply.status(400).send({ error: 'Missing file input.' })
    }

    const extension = path.extname(data.filename)

    if(extension !== '.mp3') {
      return reply.status(400).send({ error: 'Invalid input type, please upload a MP3.' })
    }

    const fileBaseName = path.basename(data.filename, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
    const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadDestination)) //recebo e escrevo aos poucos (stream - pipeline)

    const video = await prisma.video.create({
      data:{
        name: data.filename,
        path: uploadDestination,
      }
    })
    
    return {
      video
    }
  })
}