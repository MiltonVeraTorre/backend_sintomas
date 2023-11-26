import { handleServerError } from "../helpers/handleServerError.js";
import { prisma } from "../index.js";
import { comprobarPassword, hashPassword } from "../helpers/passwordFunctions.js";
import generarJWT from "../helpers/generarJWT.js";
export async function crearPaciente(req, res) {
    try {
        const { correo, password } = req.body;
        const pacienteExiste = await prisma.paciente.findFirst({
            where: {
                correo: { mode: "insensitive", equals: correo }
            }
        });
        if (pacienteExiste) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }
        const numero = req.body.telefono;
        if (isNaN(+numero)) {
            return res.status(400).json({ msg: "El telefono debe ser un numero" });
        }
        const paciente = await prisma.paciente.create({
            data: {
                ...req.body,
                password: await hashPassword(password)
            }
        });
        return res.json({
            ...paciente,
            token: generarJWT(paciente.id)
        });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function loginPaciente(req, res) {
    console.log(req.body);
    const { correo, password } = req.body;
    try {
        const paciente = await prisma.paciente.findFirst({
            where: {
                correo: {
                    mode: "insensitive",
                    equals: correo
                }
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
    console.log(paciente);
    try {
        return res.json(paciente);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function updatePaciente(req, res) {
    const { paciente } = req;
    try {
        const pacienteActualizado = await prisma.paciente.update({
            where: {
                id: paciente?.id
            },
            data: {
                ...req.body
            }
        });
        return res.json(pacienteActualizado);
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
    const { paciente } = req;
    try {
        const antecedente = await prisma.antecedente.create({
            data: {
                ...req.body,
                pacienteId: paciente?.id
            }
        });
        return res.json(antecedente);
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
    const { cuantitativo } = req.params;
    try {
        const tiposDato = await prisma.tipo_registro.findMany({
            where: {
                OR: [
                    { pacienteId: paciente?.id },
                    { pacienteId: null }
                ],
                cuantitativo: cuantitativo === "true"
            },
            include: {
                registros: {
                    orderBy: {
                        fecha: "desc"
                    },
                    where: {
                        pacienteId: paciente?.id
                    },
                    take: 1
                }
            }
        });
        const tipoDataUltimoRegistro = tiposDato.map((td) => ({
            ...td,
            registros: undefined,
            ultimoRegistro: Math.round(td.registros[0]?.valor ?? 0),
            fechaUltimoRegistro: td.registros[0]?.fecha.toISOString() ?? new Date().toISOString()
        }));
        console.log(tipoDataUltimoRegistro);
        return res.json(tipoDataUltimoRegistro);
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
        const tipoDatoExiste = await prisma.tipo_registro.findFirst({
            where: {
                AND: [
                    { nombre: { mode: "insensitive", equals: req.body.nombre } },
                    {
                        OR: [
                            { pacienteId: paciente?.id },
                            { pacienteId: null }
                        ]
                    }
                ]
            }
        });
        if (tipoDatoExiste) {
            return res.status(400).json({ msg: "Ya existe un tipo de dato con ese nombre" });
        }
        const tipoDato = await prisma.tipo_registro.create({
            data: {
                ...req.body,
                pacienteId: paciente?.id
            }
        });
        return res.json({ ...tipoDato, ultimoRegistro: 0,
            fechaUltimoRegistro: new Date().toISOString() });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function eliminarTipoDato(req, res) {
    const { id } = req.params;
    try {
        const tipoDato = await prisma.tipo_registro.findUnique({
            where: {
                id: +id
            }
        });
        if (!tipoDato?.pacienteId) {
            return res.status(400).json({ msg: "No se puede eliminar un tipo de dato que no sea personalizado" });
        }
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
        const registro = await prisma.registro.create({
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
export async function obtenerDatos(req, res) {
    const { tipo_id } = req.params;
    const { paciente } = req;
    try {
        const registros = await prisma.registro.findMany({
            where: {
                pacienteId: paciente?.id,
                tipoId: +tipo_id
            },
            orderBy: {
                fecha: "desc"
            },
            take: 10
        });
        console.log("Registros", registros);
        return res.json(registros);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function registrarNota(req, res) {
    const { paciente } = req;
    const { nota } = req.body;
    console.log(nota);
    try {
        if (nota === "")
            return res.status(400).json({ msg: "La nota no puede estar vacia" });
        const notaRegistrada = await prisma.nota.create({
            data: {
                ...req.body,
                pacienteId: paciente?.id
            }
        });
        return res.json(notaRegistrada);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function obtenerNotas(req, res) {
    const { paciente } = req;
    try {
        const notas = await prisma.nota.findMany({
            where: {
                pacienteId: paciente?.id
            }
        });
        return res.json(notas);
    }
    catch (error) {
        return handleServerError(error, "Nota", res);
    }
}
export async function eliminarNota(req, res) {
    const { id } = req.params;
    try {
        await prisma.nota.delete({
            where: {
                id: +id
            }
        });
        return res.json({ msg: "Nota eliminada correctamente" });
    }
    catch (error) {
        return handleServerError(error, "Nota", res);
    }
}
export async function obtenerDoctores(req, res) {
    const { paciente } = req;
    try {
        const doctores = await prisma.doctor.findMany();
        console.log(doctores);
        return res.json(doctores);
    }
    catch (error) {
        return handleServerError(error, "Doctor", res);
    }
}
