import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const secretKey = process.env.JWT_SECRET as string
  const token = req.cookies.jwt
  if (token) {
    try {
      jwt.verify(token, secretKey)
      next()
    } catch (e: unknown) {
      res.status(401).json({
        error: "Invalid token",
      })
    }
  } else {
    res.status(401).json({
      error: "Missing token",
    })
  }
}
