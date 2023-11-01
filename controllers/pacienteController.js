import { handleServerError } from "../helpers/handleServerError";
import { prisma } from "..";
import { comprobarPassword } from "../helpers/passwordFunctions";
import generarJWT from "../helpers/generarJWT";
export async function crearPaciente(req, res) {
    try {
        const { correo } = req.body;
        const pacienteExiste = await prisma.paciente.findFirst({
            where: {
                correo
            }
        });
        if (pacienteExiste) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }
        const paciente = await prisma.paciente.create({
            data: req.body
        });
        return res.json(paciente);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function loginPaciente(req, res) {
    const { correo, password } = req.body;
    try {
        const paciente = await prisma.paciente.findUnique({
            where: {
                correo
            }
        });
        if (!paciente) {
            return res.status(404).json({ msg: "El paciente no existe" });
        }
        if (await comprobarPassword(password, paciente.password)) {
            return res.json({
                ...paciente,
                password: undefined,
                token: generarJWT(paciente.id)
            });
        }
        return res.status(403).json({ msg: "Password incorrecto" });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function perfilPaciente(req, res) {
    const { paciente } = req;
    try {
        return res.json(paciente);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function obtenerAntecedentes(req, res) {
    const { paciente } = req;
    try {
        const antecedentes = await prisma.antecedente.findMany({
            where: {
                pacienteId: paciente?.id
            }
        });
        return res.json(antecedentes);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function registrarAntecedente(req, res) {
    try {
        await prisma.antecedente.create({
            data: req.body
        });
        return res.json({ msg: "Antecedente registrado correctamente" });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function eliminarAntecedente(req, res) {
    const { id } = req.params;
    try {
        await prisma.antecedente.delete({
            where: {
                id: +id
            }
        });
        return res.json({ msg: "Antecedente borrado correctamente" });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function obtenerTiposDato(req, res) {
    const { paciente } = req;
    try {
        const tiposDato = await prisma.tipo_registro.findMany({
            where: {
                OR: [
                    { pacienteId: paciente?.id },
                    { pacienteId: null }
                ]
            }
        });
        return res.json(tiposDato);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function obtenerTipoDato(req, res) {
    const { id } = req.params;
    try {
        const tipoDato = await prisma.tipo_registro.findUniqueOrThrow({
            where: {
                id: +id
            }
        });
        return res.json({ msg: "Tipo de dato creado correctamente" });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function crearTipoDato(req, res) {
    const { paciente } = req;
    try {
        await prisma.tipo_registro.create({
            data: {
                ...req.body,
                pacienteId: paciente?.id
            }
        });
        return res.json({ msg: "Tipo de dato registrado correctamente" });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function eliminarTipoDato(req, res) {
    const { id } = req.params;
    try {
        await prisma.tipo_registro.delete({
            where: {
                id: +id
            }
        });
        return res.json({ msg: "Tipo de dato eliminado correctamente" });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function registrarDato(req, res) {
    const { paciente } = req;
    try {
        await prisma.registro.create({
            data: {
                ...req.body,
                pacienteId: paciente?.id,
            }
        });
        return res.json({ msg: "Registro creado correctamente" });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function registrarNota(req, res) {
    const { paciente } = req;
    try {
        await prisma.nota.create({
            data: {
                ...req.body,
                pacienteId: paciente?.id
            }
        });
        return res.json({ msg: "Nota creada correctamente" });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
