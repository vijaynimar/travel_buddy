import express from "express";
import { signUpUser, loginUser, forgotPassword, resetPassword, checkForToken } from "../controllers/auth.controller.js";
const authRouter = express.Router();

import path from "path";
import { fileURLToPath } from "url";


export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);



// http:localhost/signup
authRouter.post("/signup", signUpUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", checkForToken, resetPassword);
// authRouter.get("/home", async (req, res) => {
//     try {
//         res.send("d")
//     } catch (error) {
//         return res.json({ error: error.message });
//     }
// });
export { authRouter };