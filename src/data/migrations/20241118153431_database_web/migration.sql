-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL,
    `prijs` DOUBLE NOT NULL,
    `soort` VARCHAR(255) NOT NULL,
    `merk` VARCHAR(255) NOT NULL,
    `kleur` VARCHAR(255) NOT NULL,
    `maat` VARCHAR(255) NOT NULL,
    `stofsoort` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `winkelmanden` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `winkelmanden_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `winkelmand_product` (
    `winkelmandId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`winkelmandId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL,
    `voornaam` VARCHAR(255) NOT NULL,
    `naam` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `wachtwoord` VARCHAR(255) NOT NULL,
    `winkelmand_id` INTEGER NOT NULL,
    `favoriet_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_winkelmand_id_key`(`winkelmand_id`),
    UNIQUE INDEX `user_favoriet_id_key`(`favoriet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorieten` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `favorieten_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoriet_product` (
    `favorietId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`favorietId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `winkelmanden` ADD CONSTRAINT `winkelmanden_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `winkelmand_product` ADD CONSTRAINT `winkelmand_product_winkelmandId_fkey` FOREIGN KEY (`winkelmandId`) REFERENCES `winkelmanden`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `winkelmand_product` ADD CONSTRAINT `winkelmand_product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorieten` ADD CONSTRAINT `favorieten_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoriet_product` ADD CONSTRAINT `favoriet_product_favorietId_fkey` FOREIGN KEY (`favorietId`) REFERENCES `favorieten`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoriet_product` ADD CONSTRAINT `favoriet_product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
