import { prisma } from "../index.js";
import { handleServerError } from "../helpers/handleServerError.js";
import generarJWT from "../helpers/generarJWT.js";
import { comprobarPassword } from "../helpers/passwordFunctions.js";
import { Parser } from "json2csv";
export async function crearDoctor(req, res) {
    try {
        const { correo } = req.body;
        const doctorExiste = await prisma.doctor.findFirst({
            where: {
                correo,
            },
        });
        if (doctorExiste) {
            return res.status(400).json({ msg: "El doctor ya existe" });
        }
        const doctor = await prisma.doctor.create({
            data: req.body,
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
                correo,
            },
        });
        if (!doctor) {
            return res.status(404).json({ msg: "El doctor no existe" });
        }
        if (await comprobarPassword(password, doctor.password)) {
            return res.json({
                ...doctor,
                password: undefined,
                token: generarJWT(doctor.id),
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
export async function buscarPaciente(req, res) {
    const { search } = req.params;
    try {
        const pacientes = await prisma.paciente.findMany({
            where: {
                OR: [
                    {
                        nombre: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        apellido: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });
        return res.json(pacientes);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function registrosPaciente(req, res) {
    const { paciente_id } = req.params;
    try {
        const tiposDato = await prisma.tipo_registro.findMany({
            where: {
                OR: [
                    {
                        pacienteId: +paciente_id
                    },
                    {
                        pacienteId: null
                    }
                ]
            }
        });
        const registrosCuantitativos = [];
        const registrosSintomas = [];
        for (const tipoDato of tiposDato) {
            const registros = await prisma.registro.findMany({
                where: {
                    tipoId: tipoDato.id
                },
                orderBy: {
                    fecha: "asc"
                }
            });
            for (const registro of registros) {
                registro.valor = Math.round(registro.valor);
            }
            for (const registro of registros) {
                registro.fecha = new Date(registro.fecha).toLocaleDateString("es-MX", {
                    timeZone: "America/Monterrey"
                });
            }
            if (tipoDato.cuantitativo) {
                registrosCuantitativos.push({
                    nombre: tipoDato.nombre,
                    registros
                });
            }
            else {
                registrosSintomas.push({
                    nombre: tipoDato.nombre,
                    registros
                });
            }
        }
        return res.json({
            registrosCuantitativos,
            registrosSintomas
        });
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
export async function descargarRegistros(req, res) {
    const { paciente_id } = req.params;
    try {
        const registros = await prisma.registro.findMany({
            where: {
                pacienteId: +paciente_id,
            },
            orderBy: {
                fecha: "asc",
            },
            include: {
                tipo: true,
            }
        });
        const registrosAplanados = registros.map((registro) => {
            return {
                ...registro,
                tipo: registro.tipo.nombre,
            };
        });
        const registrosCSV = new Parser().parse(registrosAplanados);
        res.setHeader("Content-Disposition", "attachment; filename=registros.csv");
        res.setHeader("Content-Type", "text/csv");
        return res.send(registrosCSV);
    }
    catch (error) {
        return handleServerError(error, "Paciente", res);
    }
}
