import express, { Router } from "express"
import path from "path"
import dotenv from "dotenv"

export const testServerWithRoute = (testRoute: Router) => {
  dotenv.config()
  
  const server: express.Application = express()
  
  server.use(express.json())
  server.use(express.static(path.join(__dirname, "public")))
  
  server.use('/test', testRoute)
  
  return server
}
