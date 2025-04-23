import express from "express";
import { showProfile } from "../controllers/auth.controller.js";
import { profile } from "../middlewares/multer.js";
import { signUpUser, loginUser, editProfile,forgotPassword, resetPassword, checkForToken } from "../controllers/auth.controller.js";
const authRouter = express.Router();

// http:localhost/signup
authRouter.post("/signup", signUpUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", checkForToken, resetPassword);
authRouter.get("/showProfile",checkForToken,showProfile)
authRouter.post("/profileEdit",profile,editProfile)
authRouter.get("/", async (req, res) => {
    try {
        return res.json({ msg: "This is homePage." });
    } catch (error) {
        return res.json({ error: error.message });
    }
});
export { authRouter };