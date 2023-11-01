import jwt from "jsonwebtoken";

const { TokenExpiredError } = jwt;

import { Response, NextFunction } from "express";

import { prisma } from "../index.js";

import {ReqDoctor} from "../types/GeneralTypes.js"
import { DoctorInt } from "../types/ModelTypes.js";



// Middleware de autenticación de doctor de aplicación

const doctorAuth = async (
  req: ReqDoctor,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const jwtSecret = process.env.JWT_SECRET || "";
      const decoded = jwt.verify(token, jwtSecret);

      // Desde aquí verificamos si `decoded` es un objeto de tipo JwtPayload
      if (typeof decoded === "string") {
        throw new Error("Token mal formado");
      }


      const doctor = await prisma.doctor.findUnique({
        where: {
          id: decoded.id,
        },
      });


      if (!doctor) {
        const error = new Error("doctor no encontrado");
        return res.status(404).json({ msg: error.message });
      }


      req.doctor = doctor as DoctorInt



      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ msg: "Sesión vencida" });
      }
      return res.status(404).json({ msg: "Hubo un error" });
    }
  }
  if (!token) {
    const error = new Error("Token No valido");
    return res.status(401).json({ msg: error.message });
  }
  next();
};

export default doctorAuth;
