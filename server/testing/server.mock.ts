import express, { Request, Response, NextFunction, Router } from "express"
import path from "path"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"

export const testServerForRoute = (testRoute: Router) => {
  dotenv.config()

  const server: express.Application = express()
  
  server.use(express.json())
  server.use(express.static(path.join(__dirname, "public")))
  server.use(cookieParser());

  server.use('/', testRoute)
  
  return server
}

export const testServerForMiddleware = (middleware: Middleware) => {
  const server: express.Application = express()
  
  server.use(express.json())
  server.use(express.static(path.join(__dirname, "public")))
  server.use(cookieParser());

  server.use(middleware)
  server.get('/', (req, res) => {
    res.json({
      result: 'no error'
    })
  })
  return server
}

type Middleware = (req: Request, res: Response, next: NextFunction) => void