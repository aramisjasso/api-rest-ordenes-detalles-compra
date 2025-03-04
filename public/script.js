document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const createTaskForm = document.getElementById("create-task-form");

    // Función para cargar y mostrar las tareas
    const loadTasks = async () => {
        try {
            const response = await fetch("/apiV1/task");
            const tasks = await response.json();
            taskList.innerHTML = ""; // Limpiar la lista
            tasks.forEach(task => {
                const li = document.createElement("li");
                li.textContent = task.title;
                taskList.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar las tareas:", error);
        }
    };

    // Función para crear una nueva tarea
    const createTask = async (title) => {
        try {
            const response = await fetch("/apiV1/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title })
            });
            if (response.ok) {
                loadTasks(); // Recargar la lista de tareas
            }
        } catch (error) {
            console.error("Error al crear la tarea:", error);
        }
    };

    // Manejar el envío del formulario
    createTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("task-title").value;
        if (title) {
            createTask(title);
            createTaskForm.reset(); // Limpiar el campo de texto
        }
    });

    // Cargar las tareas al iniciar la página
    loadTasks();
});