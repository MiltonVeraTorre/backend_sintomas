// === Doctor

import { Request, Response } from "express";
import { prisma } from "../index.js";
import { DoctorInt } from "../types/ModelTypes";
import { ReqDoctor, UserGraphData } from "../types/GeneralTypes";
import { handleServerError } from "../helpers/handleServerError.js";
import generarJWT from "../helpers/generarJWT.js";
import { comprobarPassword } from "../helpers/passwordFunctions.js";
import { antecedente, nota, registro } from "@prisma/client";
import { Parser } from "json2csv";

// === Doctor

export async function crearDoctor(req: Request, res: Response) {
  try {
    // Verificamos si existe
    const { correo } = req.body as DoctorInt;

    const doctorExiste = await prisma.doctor.findFirst({
      where: {
        correo,
      },
    });

    if (doctorExiste) {
      return res.status(400).json({ msg: "El doctor ya existe" });
    }

    // Si no existe entonces lo creamos

    const doctor = await prisma.doctor.create({
      data: req.body,
    });

    return res.json(doctor);
  } catch (error: any) {
    return handleServerError(error, "doctor", res);
  }
}

export async function loginDoctor(req: Request, res: Response) {
  const { correo, password } = req.body as DoctorInt;

  try {
    // Primero lo buscamos
    const doctor = await prisma.doctor.findUnique({
      where: {
        correo,
      },
    });

    // Si no existe le decimos

    if (!doctor) {
      return res.status(404).json({ msg: "El doctor no existe" });
    }

    // Ahora si ya comprobamos el password
    if (await comprobarPassword(password, doctor.password)) {
      return res.json({
        ...doctor,
        password: undefined,
        token: generarJWT(doctor.id),
      });
    }

    // Si el password no es correcto se lo indicamos
    return res.status(403).json({ msg: "Password incorrecto" });
  } catch (error: any) {
    return handleServerError(error, "doctor", res);
  }
}

export async function perfilDoctor(req: ReqDoctor, res: Response) {
  const { doctor } = req;
  try {
    return res.json(doctor);
  } catch (error: any) {
    return handleServerError(error, "doctor", res);
  }
}

export async function buscarPaciente(req: ReqDoctor, res: Response) {
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
  } catch (error: any) {
    return handleServerError(error, "Paciente", res);
  }
}


export async function registrosPaciente(req: ReqDoctor, res: Response) {
    const { paciente_id } = req.params;

    try {
        // Obtenemos los tipo dato que registra el paciente
        const tiposDato = await prisma.tipo_registro.findMany({
            where: {
                OR:[
                    {
                        pacienteId: +paciente_id
                    },
                    {
                        pacienteId: null
                    }
                ]
            }
        })

        // Por cada tipo de dato obtenemos los registros

        const registrosCuantitativos: UserGraphData[] = []
        const registrosSintomas :UserGraphData[] = []

        // Recorremos los tipos de dato
        for(const tipoDato of tiposDato){
            // Obtenemos los registros
            const registros = await prisma.registro.findMany({
                where:{
                    tipoId: tipoDato.id
                },
                orderBy:{
                    fecha: "asc"
                }
            })

            // Redondeamos los datos
            for(const registro of registros){
                registro.valor = Math.round(registro.valor)
            }

            // Colocamos las fechas en formato pura fecha en zona horaria de monterrey
            for(const registro of registros){
                registro.fecha = new Date(registro.fecha).toLocaleDateString("es-MX",{
                    timeZone: "America/Monterrey"
                }) as any
            }


            // Si el tipo dato es cuantitativo
            if(tipoDato.cuantitativo){
                // Agregamos los registros al array
                registrosCuantitativos.push({
                    nombre: tipoDato.nombre,
                    registros
                })
            }
            // Si el tipo dato es sintoma
            else{
                // Agregamos los registros al array
                registrosSintomas.push({
                    nombre: tipoDato.nombre,
                    registros
                })
            }
        }

        // Deolvemos los dos objetos en un solo objeto
        return res.json({
            registrosCuantitativos,
            registrosSintomas
        })

        
    } catch (error: any) {
        return handleServerError(error, "Paciente", res);
    }
}

export async function descargarRegistros(req: ReqDoctor, res: Response) {
  const { paciente_id } = req.params;
  try {
    // Obtenemos los registros que ha hecho el paciente
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

    // Aplanamos el arreglo
    const registrosAplanados = registros.map((registro) => {
      return {
        ...registro,
        tipo: registro.tipo.nombre,
      };
    });

    // Creamos el objeto parseado
    const registrosCSV = new Parser().parse(registrosAplanados)
    res.setHeader("Content-Disposition", "attachment; filename=registros.csv");
    res.setHeader("Content-Type", "text/csv");
    return res.send(registrosCSV);
  } catch (error: any) {
    return handleServerError(error, "Paciente", res);
  }
}
