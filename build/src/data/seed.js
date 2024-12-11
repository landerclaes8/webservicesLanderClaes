"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const password_1 = require("../core/password");
const roles_1 = __importDefault(require("../core/roles"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await (0, password_1.hashPassword)('abcde');
    await prisma.product.createMany({
        data: [
            {
                id: 1,
                prijs: 36.99,
                soort: "Trui",
                merk: "Arte",
                kleur: "rood",
                maat: "XL",
                stofsoort: "Katoen"
            },
            { id: 2,
                prijs: 36.99,
                soort: "T-shirt",
                merk: "Arte",
                kleur: "rood",
                maat: "XL",
                stofsoort: "Katoen"
            },
            {
                id: 3,
                prijs: 36.99,
                soort: "Broek",
                merk: "Arte",
                kleur: "rood",
                maat: "XL",
                stofsoort: "Katoen"
            }
        ]
    });
    await prisma.user.createMany({
        data: [
            {
                id: 1,
                name: "Lander Vlaes",
                email: "lander.claes@telenet.be",
                password_hash: passwordHash,
                roles: JSON.stringify([roles_1.default.ADMIN, roles_1.default.USER]),
            },
            {
                id: 2,
                name: " Lander Claes",
                email: "lander.claes@telenet.nl",
                password_hash: passwordHash,
                roles: JSON.stringify([roles_1.default.USER]),
            },
            {
                id: 3,
                name: "Donald Trump",
                email: "lander.claes@telenet.de",
                password_hash: passwordHash,
                roles: JSON.stringify([roles_1.default.USER]),
            },
        ]
    });
    await prisma.order.createMany({
        data: [
            {
                id: 1,
                user_id: 1,
                date: new Date(2024, 5, 2, 19, 40)
            },
            {
                id: 2,
                user_id: 2,
                date: new Date(2024, 10, 2, 19, 40)
            },
            {
                id: 3,
                user_id: 3,
                date: new Date(2024, 6, 2, 19, 40)
            },
        ]
    });
    await prisma.orderProduct.createMany({
        data: [
            {
                orderId: 1,
                productId: 1,
                aantal: 2,
            }, {
                orderId: 2,
                productId: 2,
                aantal: 3,
            }, {
                orderId: 3,
                productId: 3,
                aantal: 7,
            },
        ]
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
