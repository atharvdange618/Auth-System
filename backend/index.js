import express from 'express';
import { connectToDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json()); // parse JSON request body
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("Hello, World!");
})

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectToDB()
    console.log(`Server is listening on port ${PORT}`)
})