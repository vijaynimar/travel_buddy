import express from "express";
import { showProfile } from "../controllers/auth.controller.js";
import { profile } from "../middlewares/multer.js";
import { signUpUser, loginUser, editProfile,forgotPassword, resetPassword, checkForToken } from "../controllers/auth.controller.js";
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
<<<<<<< HEAD
// authRouter.get("/home", async (req, res) => {
//     try {
//         res.send("d")
//     } catch (error) {
//         return res.json({ error: error.message });
//     }
// });
=======
authRouter.get("/showProfile",checkForToken,showProfile)
authRouter.post("/profileEdit",profile,checkForToken,editProfile)
authRouter.get("/", async (req, res) => {
    try {
        return res.json({ msg: "This is homePage." });
    } catch (error) {
        return res.json({ error: error.message });
    }
});
>>>>>>> ba0db2a27b28c73533ed0792ff8dab3b4950ea8c
export { authRouter };