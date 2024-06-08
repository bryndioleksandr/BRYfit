import dotenv from "dotenv";
import mongoose from "mongoose";

// Завантажуємо змінні середовища з файлу .env
dotenv.config();

const connectToDB = async () => {
    try {
        await mongoose.connect(
            process.env.DB_CONNECTION, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log('MongoDB connection succeeded...');
        console.log('connection is ' + process.env.DB_CONNECTION);
    } catch (error) {
        console.error('MongoDB database connection error:', error);
    }
}

export default connectToDB;