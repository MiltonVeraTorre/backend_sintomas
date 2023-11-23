/*
  Warnings:

  - A unique constraint covering the columns `[correo]` on the table `doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correo]` on the table `paciente` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "paciente" ADD COLUMN     "apellido" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "genero" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "nacimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "telefono" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "doctor_correo_key" ON "doctor"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_correo_key" ON "paciente"("correo");
