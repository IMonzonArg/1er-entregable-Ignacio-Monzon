import { Router } from "express";
import { getUsers, sendDocuments } from "../controllers/userController.js"


const userRouter = Router()

userRouter.get('/', getUsers)

userRouter.post('/:uid/documents', sendDocuments)

export default userRouter