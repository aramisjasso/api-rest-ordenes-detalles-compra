// routes/taskRoutes.js
import express from "express";
import { getAllTasks, getTaskById, createTask, updateTask } from "../controllers/taskController.js";
import { createOrder, updateOrder, deleteOrder } from "../controllers/post-put-deleteController.js";

const router = express.Router();







//RUTAS PARA ORDENES
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);




export default router;