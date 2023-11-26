import { Request, Response } from "express";
import { handleServerError } from "../helpers/handleServerError.js";
import { prisma } from "../index.js";
import { PacienteInt } from "../types/ModelTypes";
import { comprobarPassword, hashPassword } from "../helpers/passwordFunctions.js";
import generarJWT from "../helpers/generarJWT.js";
import { ReqPaciente } from "../types/GeneralTypes";


// === Paciente

export async function crearPaciente(req:Request,res:Response){
    try {
        // Verificamos si existe
        const {correo,password} = req.body as PacienteInt

        const pacienteExiste = await prisma.paciente.findFirst({
            where:{
                correo:{mode:"insensitive",equals:correo}
            }
        })

        if(pacienteExiste){
            return res.status(400).json({msg:"El usuario ya existe"})
        }

        // Verificamos que el numero no tenga letras
        const numero = req.body.telefono as string
        if(isNaN(+numero)){
            return res.status(400).json({msg:"El telefono debe ser un numero"})
        }

        // Si no existe entonces lo creamos

        const paciente = await prisma.paciente.create({
            data:{
                ...req.body,
                password:await hashPassword(password)
            }
        })

        return res.json({
            ...paciente,
            token: generarJWT(paciente.id)
        })
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function loginPaciente(req:Request,res:Response){

    console.log(req.body)

    const {correo,password} = req.body as PacienteInt

    try {


        // Primero lo buscamos
        const paciente = await prisma.paciente.findFirst({
            where:{
                correo:{
                    mode:"insensitive",
                    equals:correo
                }
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
    console.log(paciente)

    try {

        return res.json(paciente)
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function updatePaciente(req:ReqPaciente,res:Response){
    const {paciente} = req

    
    try {
        const pacienteActualizado = await prisma.paciente.update({
            where:{
                id:paciente?.id
            },
            data:{
                ...req.body
            }
        })

        return res.json(pacienteActualizado)
        
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

export async function registrarAntecedente(req:ReqPaciente,res:Response){

    const {paciente} = req

    try {

        const antecedente = await prisma.antecedente.create({
            data:{
                ...req.body,
                pacienteId:paciente?.id
            }
        })

        return res.json(antecedente)
        
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

    const {cuantitativo} = req.params

    try {

        // Obtendremos los tipos datos que sean nulos o que tengan el id de paciente

        const tiposDato = await prisma.tipo_registro.findMany({
            where:{
                OR:[
                    {pacienteId:paciente?.id},
                    {pacienteId:null}
                ],
                cuantitativo:cuantitativo === "true"
            },
            include:{
                registros:{
                    orderBy:{
                        fecha:"desc"
                    },
                    where:{
                        pacienteId:paciente?.id
                    },
                    take:1
                }
            }
        })

        // Ahora aplanaremos tiposDato que tenga un campo de ultimo registro
        // para que sea mas facil de manejar en el front

        const tipoDataUltimoRegistro = tiposDato.map((td)=>({
            ...td,
            registros:undefined,
            ultimoRegistro:Math.round(td.registros[0]?.valor ?? 0),
            fechaUltimoRegistro: td.registros[0]?.fecha.toISOString() ?? new Date().toISOString()
        }))

        console.log(tipoDataUltimoRegistro)

        return res.json(tipoDataUltimoRegistro)
        
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

        // Validamos que no haya un tipo de dato con el mismo nombre

        const tipoDatoExiste = await prisma.tipo_registro.findFirst({
            where:{
                AND:[
                    {nombre:{mode:"insensitive",equals:req.body.nombre}},
                    {
                        OR:[
                            {pacienteId:paciente?.id},
                            {pacienteId:null}
                        ]
                    }
                ]
            }
        })

        if(tipoDatoExiste){
            return res.status(400).json({msg:"Ya existe un tipo de dato con ese nombre"})
        }

        const tipoDato = await prisma.tipo_registro.create({
            data:{
                ...req.body,
                pacienteId:paciente?.id
            }
        })

        return res.json({...tipoDato, ultimoRegistro: 0,
            fechaUltimoRegistro: new Date().toISOString()})
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function eliminarTipoDato(req:Request,res:Response){
    const {id} = req.params
    try {
        // Verificamos que no se quiera eliminar un tipo de dato que sea con pacienteId null

        const tipoDato = await prisma.tipo_registro.findUnique({
            where:{
                id:+id
            }
        })

        if(!tipoDato?.pacienteId){
            return res.status(400).json({msg:"No se puede eliminar un tipo de dato que no sea personalizado"})
        }

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
        const registro = await prisma.registro.create({
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

export async function obtenerDatos(req:ReqPaciente,res:Response){
    const {tipo_id} = req.params
    const {paciente} = req

    try {

        // Obtenemos los ultimos 10 registros de ese tipo de dato del paciente
        const registros = await prisma.registro.findMany({
            where:{
                pacienteId:paciente?.id,
                tipoId:+tipo_id
            },
            orderBy:{
                fecha:"desc"
            },
            take:10
        })

        console.log("Registros",registros)

        return res.json(registros)
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

// === Nota

export async function registrarNota(req:ReqPaciente,res:Response){
    const {paciente} = req

    const {nota} = req.body

    console.log(nota)

    try {

        if(nota === "") return res.status(400).json({msg:"La nota no puede estar vacia"})

        const notaRegistrada = await prisma.nota.create({
            data:{
                ...req.body,
                pacienteId:paciente?.id
            }
        })

        return res.json(notaRegistrada)
        
    } catch (error:any) {
        return handleServerError(error,"Paciente",res)
    }
}

export async function obtenerNotas(req:ReqPaciente,res:Response){
    const {paciente} = req

    try {

        // Obtenemos las notas del paciente

        const notas = await prisma.nota.findMany({
            where:{
                pacienteId:paciente?.id
            }
        })

        return res.json(notas)
        
    } catch (error:any) {
        return handleServerError(error,"Nota",res)
    }
}

export async function eliminarNota(req:ReqPaciente,res:Response){
    const {id} = req.params
    try {
        await prisma.nota.delete({
            where:{
                id:+id
            }
        })

        return res.json({msg:"Nota eliminada correctamente"})
    } catch (error:any) {
        return handleServerError(error,"Nota",res)
    }
}

export async function obtenerDoctores(req:ReqPaciente,res:Response){
    const {paciente} = req

    try {

        // Obtenemos los doctores a elegir

        const doctores = await prisma.doctor.findMany()

        console.log(doctores)

        return res.json(doctores)
        
    } catch (error:any) {
        return handleServerError(error,"Doctor",res)
    }
}

