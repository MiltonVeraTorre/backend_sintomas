/*
  Warnings:

  - Added the required column `descripcion` to the `tipo_registro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tipo_registro" ADD COLUMN     "descripcion" TEXT NOT NULL;
