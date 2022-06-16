import express, { Request, Response, NextFunction, Router } from "express"
import path from "path"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { errorHandler } from "../middleware/errorHandlers"

export const testServerForRoute = (testRoute: Router) => {
  dotenv.config()

  const server: express.Application = express()

  server.use(express.json())
  server.use(express.static(path.join(__dirname, "public")))
  server.use(cookieParser())
  
  server.use("/", testRoute)
  server.use(errorHandler)

  return server
}

export const testServerForMiddleware = (middleware: Middleware) => {
  const server: express.Application = express()

  server.use(express.json())
  server.use(express.static(path.join(__dirname, "public")))
  server.use(cookieParser())
 
  server.get("/throwError", (req, res, next) => {
    next(new Error('Test Thrown'))
  })

  server.use(middleware)
  server.get("/", (req, res) => {
    res.json({
      result: "no error",
    })
  })

  return server
}

type Middleware = MiddleFunction | ErrorHandler

type MiddleFunction = (req: Request, res: Response, next: NextFunction) => void

type ErrorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => void
