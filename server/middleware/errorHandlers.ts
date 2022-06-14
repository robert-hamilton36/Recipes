import { handleErrors } from "../functions/errorHandlers"
import { NextFunction, Request, Response } from "express"


export const logErrors = (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
  // log error(err)
  next(err)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const { code, error } = handleErrors(err)
  return res.status(code).json({ error })
}