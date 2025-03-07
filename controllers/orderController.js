import db from "../models/firebase.js";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

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

// Obtener un pedido por ID
export const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const orderRef = doc(db, "orders", id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ id: orderSnap.id, ...orderSnap.data() });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido", error });
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

export const createOrder = async (req, res) => {
    try {
        const newOrder = {
            clienteId: req.body.clienteId,
            fechaPedido: req.body.fechaPedido || new Date().toISOString(),
            total: req.body.total,
            estado: req.body.estado || "Pendiente",
            productos: req.body.productos || [],
            descuentosAplicados: req.body.descuentosAplicados || [],
            estadoEnvio: req.body.estadoEnvio || {
                estadoActual: "Preparando",
                ubicacionActual: "Almacén central",
                fechaActualizacion: new Date().toISOString(),
            }
        };

        const docRef = await addDoc(collection(db, "orders"), newOrder);
        res.status(201).json({ id: docRef.id, ...newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el pedido", error });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const orderRef = doc(db, "orders", orderId);

        const docSnap = await getDoc(orderRef);
        if (!docSnap.exists()) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        await updateDoc(orderRef, {
            ...req.body,
            estadoEnvio: {
                ...docSnap.data().estadoEnvio,
                ...req.body.estadoEnvio // Permite actualizar solo algunas partes del estadoEnvio
            }
        });

        res.status(200).json({ id: orderId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el pedido", error });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const orderRef = doc(db, "orders", orderId);

        const docSnap = await getDoc(orderRef);
        if (!docSnap.exists()) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        await deleteDoc(orderRef);
        res.status(200).json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el pedido", error });
    }
};

// Mapeo de estados de envío a estados de pedido
const estadoPedidoPorEnvio = {
    "Preparando": "Pendiente",
    "En camino": "En tránsito",
    "Entregado": "Completado",
    "Devuelto": "Devuelto",
    "Cancelado": "Cancelado"
};

// Estados finales que no deben cambiar
const estadosFinales = ["Completado", "Cancelado", "Devuelto"];

// Actualizar estado del pedido basado en evento de transporte
export const updateOrderStatusByShipping = async (req, res) => {
    const { id } = req.params;
    const { nuevoEstadoEnvio, ubicacionActual } = req.body;

    try {
        const orderRef = doc(db, "orders", id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        const orderData = orderSnap.data();

        // Si el estado actual ya es final, no lo actualizamos
        if (estadosFinales.includes(orderData.estado)) {
            return res.status(400).json({ message: "No se puede modificar un pedido en estado final" });
        }

        const nuevoEstadoPedido = estadoPedidoPorEnvio[nuevoEstadoEnvio] || orderData.estado;

        // Historial de estados
        const historialEstados = orderData.historialEstados || [];
        historialEstados.push({
            estadoAnterior: orderData.estado,
            nuevoEstado: nuevoEstadoPedido,
            fechaCambio: new Date().toISOString()
        });

        await updateDoc(orderRef, {
            estado: nuevoEstadoPedido,
            estadoEnvio: {
                estadoActual: nuevoEstadoEnvio,
                ubicacionActual: ubicacionActual || orderData.estadoEnvio.ubicacionActual,
                fechaActualizacion: new Date().toISOString()
            },
            historialEstados
        });

        res.status(200).json({ message: "Estado del pedido actualizado", estado: nuevoEstadoPedido, estadoEnvio: nuevoEstadoEnvio });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado del pedido", error });
    }
};
