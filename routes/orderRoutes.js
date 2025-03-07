import express from "express";
import { getAllOrders, getOrderById, getOrderProducts, getOrderDiscounts, getOrderShippingStatus, createOrder, updateOrder, deleteOrder, updateOrderStatusByShipping } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.get("/:id/productos", getOrderProducts);
router.get("/:id/descuentos", getOrderDiscounts);
router.get("/:id/envio", getOrderShippingStatus);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.put("/:id/status", updateOrderStatusByShipping);

export default router;
