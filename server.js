const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Маршрут для проверки, работает ли сервер
app.get("/", (req, res) => {
    res.send("✅ API is running...");
});

// ✅ Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ MongoDB connected");

        // ✅ Запускаем сервер ТОЛЬКО после успешного подключения к базе
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Завершаем процесс при ошибке
    });

// ✅ Схема и модель для задач
const TaskSchema = new mongoose.Schema({
    text: String,
    date: String,
    completed: Boolean
});
const Task = mongoose.model("Task", TaskSchema);

// ✅ Получение всех задач (если указан `date`, фильтруем по нему)
app.get("/tasks", async (req, res) => {
    try {
        const { date } = req.query;
        const tasks = await Task.find(date ? { date } : {});
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении задач", error });
    }
});

// ✅ Добавление новой задачи
app.post("/tasks", async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при добавлении задачи", error });
    }
});

// ✅ Обновление статуса задачи (переключение `completed`)
app.put("/tasks/:id/toggle", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Задача не найдена" });

        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при обновлении задачи", error });
    }
});

// ✅ Удаление задачи
app.delete("/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: "Задача не найдена" });

        res.json({ message: "Задача удалена", deletedTask });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при удалении задачи", error });
    }
});
