import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080; 

app.use("/api/auth", authRoutes)


app.listen(5000, ()=>{
    console.log(`server is running on port ${PORT}`)
    connectDB();
})