// routes/taskRoutes.js
import express from "express";
import { getAllOrders} from "../controllers/taskController.js";
const router = express.Router();

router.get("/", getAllOrders);
/* router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask); */

export default router;