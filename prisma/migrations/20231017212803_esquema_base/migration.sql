-- CreateTable
CREATE TABLE "doctor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paciente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nota" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "nota" TEXT NOT NULL,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antecedente" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "antecedente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enfermedad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "antecedenteId" INTEGER NOT NULL,

    CONSTRAINT "enfermedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_registro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cuantitativo" BOOLEAN NOT NULL,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "tipo_registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "registro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota" ADD CONSTRAINT "nota_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfermedad" ADD CONSTRAINT "enfermedad_antecedenteId_fkey" FOREIGN KEY ("antecedenteId") REFERENCES "antecedente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_registro" ADD CONSTRAINT "tipo_registro_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro" ADD CONSTRAINT "registro_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipo_registro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro" ADD CONSTRAINT "registro_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
