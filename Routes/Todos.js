import express from "express";
import { createTodo,getTodos,getOneTodo,updateTodo,deleteTodo} from '../Controller/Todos.controller.js'
import { verifyToken,verifyUser } from "../Utils/verifyToken.js"
const router = express.Router();

router.post("/create/:userId",verifyUser,createTodo);
router.get("/get-all-todos", verifyToken, getTodos);

router.get("/get/:id",verifyToken,getOneTodo)
router.put("/update/:id", verifyToken, updateTodo)
router.delete("/delete/:id", verifyToken, deleteTodo)




export default router;