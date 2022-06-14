import express from "express"
import path from "path"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRouter from "./routes/auth"
import recipeRouter from "./routes/recipe"
import { requireAuth } from "./middleware/authorization"
import { errorHandler } from "./middleware/errorHandlers"

dotenv.config()

const server: express.Application = express()

server.use(express.json())
server.use(express.static(path.join(__dirname, "public")))
server.use(cookieParser())

server.use("/api/v1/auth", authRouter)
server.use("/api/v1/recipe", requireAuth, recipeRouter)

server.use(errorHandler)

export default server
