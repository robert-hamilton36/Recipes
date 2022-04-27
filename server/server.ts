import express from "express"
import path from "path"
import dotenv from "dotenv"

import authRouter from "./routes/auth"


dotenv.config()

const server: express.Application = express()

server.use(express.json())
server.use(express.static(path.join(__dirname, "public")))

server.use('/api/v1/auth', authRouter)

export default server
