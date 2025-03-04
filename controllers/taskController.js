// controllers/taskController.js
import db from "../models/firebase.js";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc } from "firebase/firestore";

// Obtener todos los pedidos
export const getPedidos = async (req, res) => {
    try {
        const pedidosRef = collection(db, "pedidos");
        const snapshot = await getDocs(pedidosRef);
        const pedidos = [];
        snapshot.forEach((doc) => {
            pedidos.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los pedidos", error });
    }
};

// Obtener productos de un pedido por ID
export const getProductos = async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const pedidoRef = doc(db, "pedidos", pedidoId);
        const docSnap = await getDoc(pedidoRef);
        if (!docSnap.exists()) {
            res.status(404).json({ message: "Pedido no encontrado" });
        } else {
            res.status(200).json(docSnap.data().productos);
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos del pedido", error });
    }
};

// Obtener descuentos aplicados de un pedido por ID
export const getDescuentos = async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const pedidoRef = doc(db, "pedidos", pedidoId);
        const docSnap = await getDoc(pedidoRef);
        if (!docSnap.exists()) {
            res.status(404).json({ message: "Pedido no encontrado" });
        } else {
            res.status(200).json(docSnap.data().descuentosAplicados);
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los descuentos del pedido", error });
    }
};

// Obtener el estado de envío de un pedido por ID
export const getEstadoEnvio = async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const pedidoRef = doc(db, "pedidos", pedidoId);
        const docSnap = await getDoc(pedidoRef);
        if (!docSnap.exists()) {
            res.status(404).json({ message: "Pedido no encontrado" });
        } else {
            res.status(200).json(docSnap.data().estadoEnvio);
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el estado de envío", error });
    }
};


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

// Obtener tarea por ID
export const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskRef = doc(db, "tasks", taskId); // Referencia al documento con el ID
        const docSnap = await getDoc(taskRef); // Obtener el documento
        if (!docSnap.exists()) {
            res.status(404).json({ message: "Tarea no encontrada" });
        } else {
            res.status(200).json({ id: docSnap.id, ...docSnap.data() });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la tarea", error });
    }
};

// Crear una nueva tarea
export const createTask = async (req, res) => {
    try {
        const newTask = {
            title: req.body.title,
            createdAt: new Date()
        };
        const docRef = await addDoc(collection(db, "tasks"), newTask); // Agregar documento a la colección "tasks"
        res.status(201).json({ id: docRef.id, ...newTask });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la tarea", error });
    }
};

// Actualizar una tarea
export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskRef = doc(db, "tasks", taskId); // Referencia al documento con el ID
        const docSnap = await getDoc(taskRef); // Obtener el documento
        if (!docSnap.exists()) {
            res.status(404).json({ message: "Tarea no encontrada" });
        } else {
            await updateDoc(taskRef, { title: req.body.title }); // Actualizar el documento
            res.status(200).json({ id: taskId, title: req.body.title });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la tarea", error });
    }
};
