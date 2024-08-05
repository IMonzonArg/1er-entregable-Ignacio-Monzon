import { Router } from "express";
import { getUsers, deleteInactiveUsers, sendDocuments } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.delete('/', deleteInactiveUsers);
userRouter.post('/:uid/documents', sendDocuments);

export default userRouter;
