require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔍 Проверка переменной MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ Подключение к MongoDB успешно!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Ошибка подключения к MongoDB:", err);
        process.exit(1);
    });
