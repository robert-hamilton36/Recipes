import express from "express"
import path from "path"

import usersRouter from "./routes/users"

const server: express.Application = express()

server.use(express.json())
server.use(express.static(path.join(__dirname, "public")))

server.use('/api/v1/users', usersRouter)

export default server
