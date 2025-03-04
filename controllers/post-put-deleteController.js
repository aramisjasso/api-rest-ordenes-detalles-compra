import db from "../models/firebase.js";
import { collection, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

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
