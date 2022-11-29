import express from "express";
import {createTodo,getOneTodo,updateTodo,deleteTodo} from '../Controller/Todos.controller.js'
import { verifyToken,verifyUser } from "../Utils/verifyToken.js"
const router = express.Router();

router.post("/create/:userId",verifyUser,createTodo);

router.route("/:id")
    .get(verifyToken,getOneTodo)
    .put(verifyToken,updateTodo)
    .delete(verifyToken,deleteTodo);



export default router;