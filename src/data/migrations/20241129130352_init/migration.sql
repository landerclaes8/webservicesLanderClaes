/*
  Warnings:

  - Added the required column `date` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `date` DATETIME(0) NOT NULL;
