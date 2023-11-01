import { prisma } from "..";
import { handleServerError } from "../helpers/handleServerError.js";
import generarJWT from "../helpers/generarJWT.js";
import { comprobarPassword } from "../helpers/passwordFunctions.js";
export async function crearDoctor(req, res) {
    try {
        const { correo } = req.body;
        const doctorExiste = await prisma.doctor.findFirst({
            where: {
                correo
            }
        });
        if (doctorExiste) {
            return res.status(400).json({ msg: "El doctor ya existe" });
        }
        const doctor = await prisma.doctor.create({
            data: req.body
        });
        return res.json(doctor);
    }
    catch (error) {
        return handleServerError(error, "doctor", res);
    }
}
export async function loginDoctor(req, res) {
    const { correo, password } = req.body;
    try {
        const doctor = await prisma.doctor.findUnique({
            where: {
                correo
            }
        });
        if (!doctor) {
            return res.status(404).json({ msg: "El doctor no existe" });
        }
        if (await comprobarPassword(password, doctor.password)) {
            return res.json({
                ...doctor,
                password: undefined,
                token: generarJWT(doctor.id)
            });
        }
        return res.status(403).json({ msg: "Password incorrecto" });
    }
    catch (error) {
        return handleServerError(error, "doctor", res);
    }
}
export async function perfilDoctor(req, res) {
    const { doctor } = req;
    try {
        return res.json(doctor);
    }
    catch (error) {
        return handleServerError(error, "doctor", res);
    }
}
