import express from "express"
import { buscarPaciente, crearDoctor, descargarRegistros, loginDoctor, perfilDoctor, registrosPaciente } from "../controllers/doctorController.js"
import doctorAuth from "../middleware/doctorAuth.js"


const router = express.Router()

// === Doctor

router.post("/login",loginDoctor)
router.post("/",doctorAuth,crearDoctor)
router.get("/perfil",doctorAuth,perfilDoctor)

router.get("/paciente/:search",doctorAuth,buscarPaciente)
router.get("/registros/:paciente_id",doctorAuth,registrosPaciente)
router.get("/descargar/:paciente_id",doctorAuth,descargarRegistros)

export default router