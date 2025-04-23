import {Router} from "express"
import { aiFetch } from "../controllers/aiIntegration.js"
const ai=Router()
ai.post("/aiIntergration",aiFetch)

export {ai}