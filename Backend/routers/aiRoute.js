import {Router} from "express"
import { aiFetch } from "../controllers/aiIntegration.js"
const ai=Router()
ai.get("/aiIntergration",aiFetch)

export {ai}