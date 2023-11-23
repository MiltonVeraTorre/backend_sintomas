export interface DoctorInt {
    id: number;
    nombre: string;
    correo: string;
    password: string;
    pacientes?: PacienteInt[];
  }
  
  export interface PacienteInt {
    id: number;
    nombre: string;
    apellido:string
    nacimiento:Date
    genero:string
    correo: string;
    telefono:string
    password: string;
    doctorId?: number | null;
    doctor?: DoctorInt | null;
    notas?: NotaInt[];
    tipos_registro?: TipoRegistroInt[];
    registros?: RegistroInt[];
    antecedentes?: AntecedenteInt[];
  }
  
  export interface NotaInt {
    id: number;
    fecha: Date;
    nota: string;
    pacienteId: number;
    paciente: PacienteInt;
  }
  
  export interface AntecedenteInt {
    id: number;
    nombre: string;
    descripcion: string;
    fecha: Date;
    pacienteId: number;
    paciente: PacienteInt;
  }
  
  export interface TipoRegistroInt {
    id: number;
    nombre: string;
    cuantitativo: boolean;
    descripcion: string;
    unidad?: string | null;
    pacienteId?: number | null;
    paciente?: PacienteInt | null;
    registros?: RegistroInt[];
  }
  
  export interface RegistroInt {
    id: number;
    valor: number;
    tipoId: number;
    tipo: TipoRegistroInt;
    fecha: Date;
    pacienteId: number;
    paciente: PacienteInt;
  }
  