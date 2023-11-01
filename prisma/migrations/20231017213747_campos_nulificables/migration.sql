-- DropForeignKey
ALTER TABLE "antecedente" DROP CONSTRAINT "antecedente_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "nota" DROP CONSTRAINT "nota_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "paciente" DROP CONSTRAINT "paciente_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "registro" DROP CONSTRAINT "registro_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "registro" DROP CONSTRAINT "registro_tipoId_fkey";

-- DropForeignKey
ALTER TABLE "tipo_registro" DROP CONSTRAINT "tipo_registro_pacienteId_fkey";

-- AlterTable
ALTER TABLE "paciente" ALTER COLUMN "doctorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tipo_registro" ALTER COLUMN "pacienteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota" ADD CONSTRAINT "nota_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antecedente" ADD CONSTRAINT "antecedente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_registro" ADD CONSTRAINT "tipo_registro_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro" ADD CONSTRAINT "registro_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipo_registro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro" ADD CONSTRAINT "registro_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
