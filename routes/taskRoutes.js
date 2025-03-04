// routes/taskRoutes.js
import express from "express";
import { getAllOrders} from "../controllers/taskController.js";
import { createOrder, updateOrder, deleteOrder } from "../controllers/post-put-deleteController.js";

const router = express.Router();

router.get("/", getAllOrders);





//RUTAS PARA ORDENES
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);




export default router;