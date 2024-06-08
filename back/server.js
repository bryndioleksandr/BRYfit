import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectToDB from "./models/DB_connection.js";
import router from "./routes/router.js";

dotenv.config();

const app = express();

// Налаштування CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

// Підключення роутера
app.use(router);

const startServer = async () => {
    try {
        await connectToDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Express server startup error:', error);
    }
}

startServer();