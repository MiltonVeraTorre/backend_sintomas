import express from "express"

import pacienteAuth from "../middleware/pacienteAuth.js"
import { crearPaciente, crearTipoDato, eliminarAntecedente, eliminarTipoDato, loginPaciente, obtenerAntecedentes, obtenerTipoDato, obtenerTiposDato, perfilPaciente, registrarAntecedente, registrarDato, registrarNota } from "../controllers/pacienteController"

const router = express.Router()

// === Paciente

router.post("/login",loginPaciente)
router.post("/",pacienteAuth,crearPaciente)
router.get("/perfil",pacienteAuth,perfilPaciente)


// === Antecedentes

router.get("/antecedentes",pacienteAuth,obtenerAntecedentes)
router.post("/antecedente",pacienteAuth,registrarAntecedente)
router.delete("/antecedente/:id",pacienteAuth,eliminarAntecedente)

// === Tipos dato

router.get("/tipos_dato",pacienteAuth,obtenerTiposDato)
router.get("/tipo_dato/:id",pacienteAuth,obtenerTipoDato)
router.post("/tipo_dato",pacienteAuth,crearTipoDato)
router.delete("/tipo_dato/:id",pacienteAuth,eliminarTipoDato)

// === Datos

router.post("/dato",pacienteAuth,registrarDato)

// == Notas
router.post("/nota",pacienteAuth,registrarNota)

export default router