/*
  Warnings:

  - You are about to drop the column `wachtwoord` on the `user` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roles` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `wachtwoord`,
    ADD COLUMN `password_hash` VARCHAR(255) NOT NULL,
    ADD COLUMN `roles` JSON NOT NULL;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_email_key` TO `idx_user_email_unique`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_name_key` TO `idx_user_name_unique`;
