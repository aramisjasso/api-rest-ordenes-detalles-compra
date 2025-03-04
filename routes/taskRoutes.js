// routes/taskRoutes.js
import express from "express";
import { getAllTasks, getTaskById, createTask, updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);

export default router;