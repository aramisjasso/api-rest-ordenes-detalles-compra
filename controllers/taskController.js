// controllers/taskController.js
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