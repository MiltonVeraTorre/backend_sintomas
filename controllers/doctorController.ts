

// === Doctor

import { Request, Response } from "express"
import { prisma } from ".."
import { DoctorInt } from "../types/ModelTypes"
import { ReqDoctor } from "../types/GeneralTypes"
import { handleServerError } from "../helpers/handleServerError.js"
import generarJWT from "../helpers/generarJWT.js"
import { comprobarPassword } from "../helpers/passwordFunctions.js"


// === Doctor

export async function crearDoctor(req:Request,res:Response){
    try {
        // Verificamos si existe
        const {correo} = req.body as DoctorInt

        const doctorExiste = await prisma.doctor.findFirst({
            where:{
                correo
            }
        })

        if(doctorExiste){
            return res.status(400).json({msg:"El doctor ya existe"})
        }

        // Si no existe entonces lo creamos

        const doctor = await prisma.doctor.create({
            data:req.body
        })

        return res.json(doctor)
        
    } catch (error:any) {
        return handleServerError(error,"doctor",res)
    }
}

export async function loginDoctor(req:Request,res:Response){

    const {correo,password} = req.body as DoctorInt

    try {
        // Primero lo buscamos
        const doctor = await prisma.doctor.findUnique({
            where:{
                correo
            }
        })

        // Si no existe le decimos

        if(!doctor){
            return res.status(404).json({msg:"El doctor no existe"})
        }

        // Ahora si ya comprobamos el password
        if(await comprobarPassword(password,doctor.password)){
            return res.json({
                ...doctor,
                password:undefined,
                token: generarJWT(doctor.id)
            })
        }

        // Si el password no es correcto se lo indicamos
        return res.status(403).json({msg:"Password incorrecto"})
    } catch (error:any) {
        return handleServerError(error,"doctor",res)
    }
}

export async function perfilDoctor(req:ReqDoctor,res:Response){
    const {doctor} = req
    try {

        return res.json(doctor)
        
    } catch (error:any) {
        return handleServerError(error,"doctor",res)
    }
}