import express from "express"
import {
  changePassword,
  deleteUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/auth"

const authRouter = express.Router()

authRouter.post("/register", registerUser)
authRouter.get("/login", loginUser)
authRouter.patch("/changePassword", changePassword)
authRouter.patch("/updateUser", updateUser)
authRouter.patch("/logout", logoutUser)
authRouter.delete("/delete", deleteUser)

export default authRouter
