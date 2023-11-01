import { PrismaClient } from "@prisma/client";



// Importamos Prisma
const prisma = new PrismaClient()



// Obtenemos un usuario junto a todos sus datos


const usuario = await prisma.paciente.findUnique({
    where:{
        id:1
    },
    include:{
        doctor:true,
        antecedentes:true,
        notas:true,
        registros:{
            include:{
                tipo:true
            }
        },
        
    }
})

const tipos_registro = await prisma.tipo_registro.findMany({
    where:{
        OR:[
            {pacienteId:null},
            {pacienteId:usuario?.id}
        ]
    
    }
})





console.log(JSON.stringify(usuario,null,2))

console.log(tipos_registro)





