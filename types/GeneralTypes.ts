import { Request } from "express";
import { DoctorInt, PacienteInt } from "./ModelTypes";
import { registro } from "@prisma/client";

export interface ReqPaciente extends Request{
    paciente ?: PacienteInt
}

export interface ReqDoctor extends Request{
    doctor ?: DoctorInt
}


export interface UserGraphData{
    nombre: string
    registros: registro[]
}