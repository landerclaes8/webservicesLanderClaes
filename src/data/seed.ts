import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

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

            {   id: 2,
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
    })

    await prisma.user.createMany({
        data: [
            {
              id: 1,
              voornaam: "Lander",
              naam: "Claes",
              email: "lander.claes@telenet.be",
              wachtwoord: "abcde",
              winkelmand_id: 1,
              favoriet_id: 1  
            },
            {
                id: 2,
                voornaam: "Lander",
                naam: "Claes",
                email: "lander.claes@telenet.nl",
                wachtwoord: "abcde",
                winkelmand_id: 2,
                favoriet_id: 2  
              },
              {
                id: 3,
                voornaam: "Lander",
                naam: "Claes",
                email: "lander.claes@telenet.de",
                wachtwoord: "abcde",
                winkelmand_id: 3,
                favoriet_id: 3  
              },
        ]
    })

    await prisma.favoriet.createMany({
        data:[
            {
                id:1,
                user_id:1
            },
            {
                id:2,
                user_id:2
            },
            {
                id:3,
                user_id:3
            },


        ]
    })

    await prisma.winkelmand.createMany({
        data:[
            {
                id:1,
                user_id:1
            },
            {
                id:2,
                user_id:2
            },
            {
                id:3,
                user_id:3
            },


        ]
    })

    
    await prisma.favorietProduct.createMany({

        data: [
            {
                favorietId: 1,
                productId: 1
            },
            {
                favorietId: 1,
                productId: 2
            },{
                favorietId: 1,
                productId: 3
            },{
                favorietId: 2,
                productId: 1
            },{
                favorietId: 2,
                productId: 2
            },{
                favorietId: 2,
                productId: 3
            },{
                favorietId: 3,
                productId: 1
            },{
                favorietId: 3,
                productId: 2
            },{
                favorietId: 3,
                productId: 3
            },

        ]
    })

    await prisma.winkelmandProduct.createMany({
        data:[
            {
                winkelmandId:1,
                productId:1
            },{
                winkelmandId:1,
                productId:2
            },{
                winkelmandId:1,
                productId:3
            },{
                winkelmandId:2,
                productId:1
            },{
                winkelmandId:2,
                productId:2
            },{
                winkelmandId:2,
                productId:3
            },{
                winkelmandId:3,
                productId:1
            },{
                winkelmandId:3,
                productId:2
            },{
                winkelmandId:3,
                productId:3
            },
        ]
    })

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