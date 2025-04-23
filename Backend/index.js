import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { dbConnection } from "./config/dbConnection.js";
import { authRouter } from "./routers/router.js";
import { tripRouter } from "./routers/tripRouter.js";
import { ai } from "./routers/aiRoute.js";
const app = express();
const frontendUrl = ["", "http://localhost:5173"];
const corsOptions = {
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.get("/",(req,res)=>{
    res.send("vijay nimar line12")
})
app.use(cookieParser());



app.use(express.json());
// app.use(morgan("common"));
app.use(ai)
app.use(authRouter);
app.use(tripRouter)

// Connecting the mongoDB and listen at port 
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await dbConnection();
    console.log(`Server started at http://localhost:${PORT}`);
});