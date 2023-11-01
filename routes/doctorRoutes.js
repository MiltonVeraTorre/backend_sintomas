import express from "express";
import { crearDoctor, loginDoctor, perfilDoctor } from "../controllers/doctorController";
import doctorAuth from "../middleware/doctorAuth";
const router = express.Router();
router.post("/login", loginDoctor);
router.post("/", doctorAuth, crearDoctor);
router.get("/perfil", doctorAuth, perfilDoctor);
export default router;
