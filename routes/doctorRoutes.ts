import express from "express"
import { crearDoctor, loginDoctor, perfilDoctor } from "../controllers/doctorController.js"
import doctorAuth from "../middleware/doctorAuth.js"


const router = express.Router()

// === Doctor

router.post("/login",loginDoctor)
router.post("/",doctorAuth,crearDoctor)
router.get("/perfil",doctorAuth,perfilDoctor)

router.get("/paciente/:search",doctorAuth)
router.get("/registros/:paciente_id",doctorAuth)
router.get("/descargar/:paciente_id",doctorAuth)

export default router