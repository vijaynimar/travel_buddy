import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { dbConnection } from "./config/dbConnection.js";
import { authRouter } from "./routers/router.js";
import { tripRouter } from "./routers/tripRouter.js";
import path from "path";
import { fileURLToPath } from "url";

import { ai } from "./routers/aiRoute.js";
// >>>>>>> ba0db2a27b28c73533ed0792ff8dab3b4950ea8c
const app = express();
app.use(cookieParser());
const frontendUrl = ["", "http://localhost:3000"];
const corsOptions = {
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Get __dirname equivalent in ES6
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


export let homePage = path.join(__dirname, "../Frontend/homePage.html")
export let tourDetailPage = path.join(__dirname, "../Frontend/tourDetail.html")
export let FavoritePage = path.join(__dirname, "../Frontend/Favorite.html")

app.use(express.static(path.join(__dirname, "../Frontend")));
app.use(morgan("dev"));



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