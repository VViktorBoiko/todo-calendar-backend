const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const TaskSchema = new mongoose.Schema({
    text: String,
    date: String,
    completed: Boolean
});
const Task = mongoose.model("Task", TaskSchema);

app.get("/tasks", async (req, res) => {
    const { date } = req.query;
    const tasks = await Task.find({ date });
    res.json(tasks);
});

app.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
});

app.listen(process.env.PORT, () => console.log(`✅ Server running on port ${process.env.PORT}`));
