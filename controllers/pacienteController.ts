import { Request, Response } from "express";
import { handleServerError } from "../helpers/handleServerError";
import { prisma } from "..";
import { PacienteInt } from "../types/ModelTypes";
import { comprobarPassword } from "../helpers/passwordFunctions";
import generarJWT from "../helpers/generarJWT";
import { ReqPaciente } from "../types/GeneralTypes";


// === Paciente

export async function crearPaciente(req:Request,res:Response){
    try {
        // Verificamos si existe
        const {correo} = req.body as PacienteInt

        const pacienteExiste = await prisma.paciente.findFirst({
            where:{
                correo
            }
        })

        if(pacienteExiste){
            return res.status(400).json({msg:"El usuario ya existe"})
        }

        // Si no existe entonces lo creamos

        const paciente = await prisma.paciente.create({
            data:req.body
        })

        return res.json(paciente)
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function loginPaciente(req:Request,res:Response){

    const {correo,password} = req.body as PacienteInt

    try {
        // Primero lo buscamos
        const paciente = await prisma.paciente.findUnique({
            where:{
                correo
            }
        })

        // Si no existe le decimos

        if(!paciente){
            return res.status(404).json({msg:"El paciente no existe"})
        }

        // Ahora si ya comprobamos el password
        if(await comprobarPassword(password,paciente.password)){
            return res.json({
                ...paciente,
                password:undefined,
                token: generarJWT(paciente.id)
            })
        }

        // Si el password no es correcto se lo indicamos
        return res.status(403).json({msg:"Password incorrecto"})
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function perfilPaciente(req:ReqPaciente,res:Response){
    const {paciente} = req
    try {

        return res.json(paciente)
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

// === Antecedentes

export async function obtenerAntecedentes(req:ReqPaciente,res:Response){
    const {paciente} = req
    try {
        const antecedentes = await prisma.antecedente.findMany({
            where:{
                pacienteId:paciente?.id
            }
        })

        return res.json(antecedentes)
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function registrarAntecedente(req:Request,res:Response){

    try {

        await prisma.antecedente.create({
            data:req.body
        })

        return res.json({msg:"Antecedente registrado correctamente"})
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function eliminarAntecedente(req:Request,res:Response){
    const {id} = req.params
    try {
        await prisma.antecedente.delete({
            where:{
                id:+id
            }
        })

        return res.json({msg:"Antecedente borrado correctamente"})
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

// === Tipos dato

export async function obtenerTiposDato(req:ReqPaciente,res:Response){
    const {paciente} =req
    try {

        // Obtendremos los tipos datos que sean nulos o que tengan el id de paciente

        const tiposDato = await prisma.tipo_registro.findMany({
            where:{
                OR:[
                    {pacienteId:paciente?.id},
                    {pacienteId:null}
                ]
            }
        })

        return res.json(tiposDato)
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function obtenerTipoDato(req:Request,res:Response){
    const {id} = req.params
    try {

        const tipoDato = await prisma.tipo_registro.findUniqueOrThrow({
            where:{
                id:+id
            }
        })

        return res.json({msg:"Tipo de dato creado correctamente"})
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function crearTipoDato(req:ReqPaciente,res:Response){
    const {paciente} = req
    try {

        await prisma.tipo_registro.create({
            data:{
                ...req.body,
                pacienteId:paciente?.id
            }
        })

        return res.json({msg:"Tipo de dato registrado correctamente"})
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function eliminarTipoDato(req:Request,res:Response){
    const {id} = req.params
    try {
        await prisma.tipo_registro.delete({
            where:{
                id:+id
            }
        })

        return res.json({msg:"Tipo de dato eliminado correctamente"})
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

// === Datos

export async function registrarDato(req:ReqPaciente,res:Response){
    const {paciente} = req

    try {
        await prisma.registro.create({
            data:{
                ...req.body,
                pacienteId:paciente?.id,
            }

        })

        return res.json({msg:"Registro creado correctamente"})
        

    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

// === Nota

export async function registrarNota(req:ReqPaciente,res:Response){
    const {paciente} = req
    try {

        await prisma.nota.create({
            data:{
                ...req.body,
                pacienteId:paciente?.id
            }
        })

        return res.json({msg:"Nota creada correctamente"})
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

