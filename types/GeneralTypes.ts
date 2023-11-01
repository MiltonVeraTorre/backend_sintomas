import { Request } from "express";
import { DoctorInt, PacienteInt } from "./ModelTypes";

export interface ReqPaciente extends Request{
    paciente ?: PacienteInt
}

export interface ReqDoctor extends Request{
    doctor ?: DoctorInt
}