import express from "express"

import pacienteAuth from "../middleware/pacienteAuth.js"
import { crearPaciente, crearTipoDato, eliminarAntecedente, eliminarNota, eliminarTipoDato, loginPaciente, obtenerAntecedentes, obtenerDatos, obtenerDoctores, obtenerNotas, obtenerTipoDato, obtenerTiposDato, perfilPaciente, registrarAntecedente, registrarDato, registrarNota, updatePaciente } from "../controllers/pacienteController.js"

const router = express.Router()

// === Paciente

router.post("/login",loginPaciente)
router.post("/",crearPaciente)
router.put("/",pacienteAuth,updatePaciente)
router.get("/perfil",pacienteAuth,perfilPaciente)

// === Ruta padre "/api/usuario"

// === Antecedentes

router.get("/antecedentes",pacienteAuth,obtenerAntecedentes)
router.post("/antecedente",pacienteAuth,registrarAntecedente)
router.delete("/antecedente/:id",pacienteAuth,eliminarAntecedente)

// === Tipos dato

router.get("/tipos_dato/:cuantitativo",pacienteAuth,obtenerTiposDato)
router.get("/tipo_dato/:id",pacienteAuth,obtenerTipoDato)
router.post("/tipo_dato",pacienteAuth,crearTipoDato)
router.delete("/tipo_dato/:id",pacienteAuth,eliminarTipoDato)

// === Datos

router.post("/dato",pacienteAuth,registrarDato)
router.get("/datos/:tipo_id",pacienteAuth,obtenerDatos)

// == Notas
router.post("/nota",pacienteAuth,registrarNota)
router.get("/nota",pacienteAuth,obtenerNotas)
router.delete("/nota/:id",pacienteAuth,eliminarNota)

// === Doctores
router.get("/doctores",pacienteAuth,obtenerDoctores)

export default router