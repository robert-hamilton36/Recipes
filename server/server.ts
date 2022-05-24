import express from "express"
import path from "path"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRouter from "./routes/auth"
// import recipeRouter from "./routes/recipe"


dotenv.config()

const server: express.Application = express()

server.use(express.json())
server.use(express.static(path.join(__dirname, "public")))
server.use(cookieParser());

server.use('/api/v1/auth', authRouter)
// server.use('/api/v1/recipe', recipeRouter)

export default server
