import supertest from "supertest";
import withServer from "../helpers/withServer";
import { login } from "../helpers/login";
import { prisma } from "../../src/data";
import testAuthHeader from "../helpers/testAuthHeaders";



const productData = {
    products: [
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
        },
    ],
};

const productDataToDelete = {
    products: [1,2,3]
};

describe('Products', () => {

    let request: supertest.Agent;
    let authHeader: string;

    withServer((r) => (request = r));

    beforeAll(async () => {
        authHeader = await login(request);
    });

    const url = '/api/products';


    describe('GET /api/products', () => {

        beforeAll(async () => {
            await prisma.product.createMany({data: productData.products})
        });

        afterAll(async () => {
            await prisma.product.deleteMany({where: {id: { in: productDataToDelete.products}}});
        });

        it('should 200 and return all places', async () => {
            const response = await request.get(url).set('Authorization', authHeader);

            expect(response.statusCode).toBe(200);
            expect(response.body.items.length).toBe(3);
            expect(response.body.items).toEqual(expect.arrayContaining([
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
            }]));
    });
});

it('should 400 when given an argument', async () => {
    const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('VALIDATION_FAILED');
    expect(response.body.details.query).toHaveProperty('invalid');
 

  testAuthHeader(() => request.get(url)); 
});



describe('GET /api/products/:id', () => {

    beforeAll(async () => {
        await prisma.product.createMany({data: productData.products})
    });

    afterAll(async () => {
        await prisma.product.deleteMany({where: {id: { in: productDataToDelete.products}}});
    });

    it('should 200 and return the requested product', async() => {
        const response = await request.get(`${url}/1`).set('Authorization', authHeader);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
                    id: 1,
                    prijs: 36.99,
                    soort: "Trui",
                    merk: "Arte",
                    kleur: "rood",
                    maat: "XL",
                    stofsoort: "Katoen"
        });

        it('should 404 when requesting not existing product', async () => {
            const response = await request.get(`${url}/200`).set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(404);
      
            expect(response.body).toMatchObject({
              code: 'NOT_FOUND',
              message: 'No product with this id exists',
            });
      
            expect(response.body.stack).toBeTruthy();
          });

          it('should 400 with invalid product id', async () => {
            const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.params).toHaveProperty('id');
          });
      
          testAuthHeader(() => request.get(`${url}/1`));
        });   
    });


    describe('POST /api/products', () => {

        const productsToDelete: number[] = [];

        afterAll(async() => {
            await prisma.product.deleteMany({where: {id: {in: productsToDelete}}});
        });

        it('should 201 and return the created place', async () => {
            const response = await request.post(url).send({
                prijs: 36.99,
                soort: "jas",
                merk: "Arte",
                kleur: "zwart",
                maat: "XL",
                stofsoort: "Katoen"
            }).set('Authorization', authHeader);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBeTruthy();
            expect(response.body.soort).toBe('jas');
            expect(response.body.prijs).toBe(36.99);

            productsToDelete.push(response.body.id);
        });

        it('should 400 when something is missing', async() =>{
            const response = await request.post(url).send({
                prijs: 36.99,
                merk: "Arte",
                kleur: "zwart",
                maat: "XL",
                stofsoort: "Katoen"
            }).set('Authorization', authHeader);

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('soort');
        });

        });


        describe('DELETE /api/places/:id', () => {

            beforeAll(async () => {
                await prisma.product.createMany({data: productData.products})
            });

            it('should 204 and return nothing', async () => {
                const response = await request.delete(`${url}/1`).set('Authorization', authHeader);
          
                expect(response.statusCode).toBe(204);
                expect(response.body).toEqual({});
              });

              it('should 404 with not existing product', async () => {
                const response = await request.delete(`${url}/200`).set('Authorization', authHeader);
          
                expect(response.statusCode).toBe(404);
                expect(response.body).toMatchObject({
                  code: 'NOT_FOUND',
                  message: 'No product with this id exists',
                });
                expect(response.body.stack).toBeTruthy();
              });

              it('should 400 with invalid place id', async () => {
                const response = await request.delete(`${url}/invalid`).set('Authorization', authHeader);
          
                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe('VALIDATION_FAILED');
                expect(response.body.details.params).toHaveProperty('id');
              });
          
              testAuthHeader(() => request.delete(`${url}/1`));


        })//einde vierde test
});







