import db from "../models/firebase.js";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc } from "firebase/firestore";

// Obtener todas las órdenes desde Firestore
export const getAllOrders = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            clienteId: doc.data().clienteId,
            fechaPedido: doc.data().fechaPedido,
            total: doc.data().total,
            estado: doc.data().estado,
            productos: doc.data().productos || [],
            descuentosAplicados: doc.data().descuentosAplicados || [],
            estadoEnvio: doc.data().estadoEnvio || {}
        }));

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error obteniendo órdenes:", error);
        res.status(500).json({ error: "Error obteniendo órdenes" });
    }
};

// Obtener productos de un pedido específico
export const getOrderProducts = async (req, res) => {
    const { id } = req.params;

    try {
        const orderRef = doc(db, "orders", id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        const orderData = orderSnap.data();
        res.status(200).json(orderData.productos || []);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos del pedido", error });
    }
};

// Obtener descuentos de un pedido específico
export const getOrderDiscounts = async (req, res) => {
    const { id } = req.params;

    try {
        const orderRef = doc(db, "orders", id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        const orderData = orderSnap.data();
        res.status(200).json(orderData.descuentosAplicados || []);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener descuentos del pedido", error });
    }
};

// Obtener estado de envío de un pedido específico
export const getOrderShippingStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const orderRef = doc(db, "orders", id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        const orderData = orderSnap.data();
        res.status(200).json(orderData.estadoEnvio || {});
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el estado de envío del pedido", error });
    }
};
