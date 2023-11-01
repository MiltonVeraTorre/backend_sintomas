/*
  Warnings:

  - You are about to drop the `enfermedad` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pacienteId]` on the table `antecedente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descripcion` to the `antecedente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha` to the `antecedente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `antecedente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pacienteId` to the `antecedente` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "enfermedad" DROP CONSTRAINT "enfermedad_antecedenteId_fkey";

-- AlterTable
ALTER TABLE "antecedente" ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "pacienteId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "enfermedad";

-- CreateIndex
CREATE UNIQUE INDEX "antecedente_pacienteId_key" ON "antecedente"("pacienteId");

-- AddForeignKey
ALTER TABLE "antecedente" ADD CONSTRAINT "antecedente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
