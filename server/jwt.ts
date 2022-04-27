import jwt from "jsonwebtoken"

export function createToken (id: number) {
  const secretKey = process.env.JWT_SECRET as string
  return jwt.sign({id}, secretKey, {expiresIn: '1d'})
}
