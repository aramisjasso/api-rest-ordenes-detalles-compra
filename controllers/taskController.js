// controllers/taskController.js
import db from "../models/firebase.js";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc } from "firebase/firestore";

// Obtener todas las tareas
export const getAllTasks = async (req, res) => {
    try {
        const tasksRef = collection(db, "tasks"); // Referencia a la colección "tasks"
        const snapshot = await getDocs(tasksRef); // Obtener todos los documentos
        const tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() }); // Agregar cada tarea al array
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las tareas", error });
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