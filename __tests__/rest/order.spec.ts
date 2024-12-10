import supertest from "supertest";
import withServer from "../helpers/withServer";
import { login } from "../helpers/login";
import { prisma } from "../../src/data";
import testAuthHeader from "../helpers/testAuthHeaders";

const orderData = {
    orders: [
        {
            id:1,
            user_id:1,
            date: new Date(2024, 5, 2, 19, 40)
        },
        {
            id:2,
            user_id:2,
            date: new Date(2024, 10, 2, 19, 40)
        },
        {
            id:3,
            user_id:3,
            date: new Date(2024, 6, 2, 19, 40)
        },
    ]
};

const orderProductData = {
    orderProducts: [ 
        {
            orderId:1,
            productId:1,
            aantal: 2,
        },{
            orderId:2,
            productId:2,
            aantal: 3,
        },{
            orderId:3,
            productId:3,
            aantal: 7,
        },
    ]
}

const OrderDataToDelete = {
    orders: [1,2,3],
    orderProducts: [1,2,3]
};

describe('Orders', () => {


    let request: supertest.Agent;
    let authHeader: string;

    withServer((r) => (request = r));
  
    beforeAll(async () => {
      authHeader = await login(request);
    });

    const url = '/api/orders';

    describe('GET /api/orders', () =>{
        
        beforeAll(async () => {
            await prisma.order.createMany({ data: orderData.orders });
          ;

          await prisma.orderProduct.createMany({ data: orderProductData.orderProducts });
        
      
          afterAll(async () => {
            await prisma.order.deleteMany({ where: { id: { in: OrderDataToDelete.orders } } });
          });

          afterAll(async () => {
            await prisma.orderProduct.deleteMany({ where: { orderId: { in: OrderDataToDelete.orderProducts } } });
          });

         it('should 200 and return all orders', async () => {
            const response = await request.get(url).set('Authorization', authHeader);

            expect(response.statusCode).toBe(200);
            expect(response.body.items.length).toBe(3);
            expect(response.body.items).toEqual(expect.arrayContaining([
                {
                    "id": 1,
                    "date": "2024-06-02T17:40:00.000Z",
                    "user": {
                        "id": 1,
                        "name": "Lander Vlaes"
                    },
                    "orderproduct": [
                        {
                            "orderId": 1,
                            "productId": 1,
                            "aantal": 2
                        }
                    ]
                },
                {
                    "id":3,
                    "date": "2024-10-02T17:40:00.000Z",
                    "user": {
                        "id": 2,
                        "name": "Lander Claes"
                    },

                    "orderproduct" : [
                        {
                        "orderId": 2,
                        "productId":2,
                        "aantal": 3,
                        }
                    ]

                },
                {
                    "id": 3,
                    "date": "2024-07-02T17:40:00.000Z",
                    "user": {
                        "id": 3,
                        "name": "Donald Trump"
                    },
                    "orderproduct": [
                        {
                            "orderId": 3,
                            "productId": 3,
                            "aantal": 7
                        }
                    ]
                },


            ]));


         }) 

         it('should 400 when given an argument', async () => {
            const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('invalid');
          });
      
          testAuthHeader(() => request.get(url));

    }); //einde van eerste test

    describe('GET /api/places/:id', () => {

        beforeAll(async () => {
            await prisma.order.createMany({ data: orderData.orders });
             await prisma.orderProduct.createMany({ data: orderProductData.orderProducts });
        });

          afterAll(async () => {
            await prisma.order.deleteMany({ where: { id: { in: OrderDataToDelete.orders } } });
            await prisma.orderProduct.deleteMany({ where: { orderId: { in: OrderDataToDelete.orderProducts } } 
            
        }); 
    });


    it('should 200 and return the requested order', async () => {
        const response = await request.get(`${url}/1`).set('Authoriation', authHeader);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
                    "id": 1,
                    "date": "2024-06-02T17:40:00.000Z",
                    "user": {
                        "id": 1,
                        "name": "Lander Vlaes"
                    },
                    "orderproduct": [
                        {
                            "orderId": 1,
                            "productId": 1,
                            "aantal": 2
                        }
                    ]
        });
    })

    it('should 404 when requesting a not existing order', async () => {
        const response = await request.get(`${url}/200`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);

      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Geen order met dit id',
      });

      expect(response.body.stack).toBeTruthy();
    })

    it('should 400 with invalid order id', async () => {
        const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);
  
        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe('VALIDATION_FAILED');
        expect(response.body.details.params).toHaveProperty('id');
      });
  
        testAuthHeader(() => request.get(`${url}/1`));
}   ); //einde tweede test


    describe('POST /api/products', () => {

        const ordersToDelete: number[] = [];
        const orderProductToDelete: number[] = [];

        afterAll(async () => {
            await prisma.order.deleteMany({ where: { id: { in: ordersToDelete } } });
            await prisma.orderProduct.deleteMany({ where: { orderId: { in: orderProductToDelete } } });
          });

        it('should 201 and return the created order', async () => {
            const response = await request.post(url).send({
                //vragen!!
            }).set('Authorization', authHeader);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBeTruthy();
            expect(response.body.userId).toBe("");
      
            ordersToDelete.push(response.body.id);
        });
    }); //einde derde test

    describe('DELETE /api/orders', () => {

        beforeAll(async () => {
            await prisma.order.createMany({ data: orderData.orders });
             await prisma.orderProduct.createMany({ data: orderProductData.orderProducts });
        });

        it('should 204 and return nothing', async () => {
            const response = await request.delete(`${url}/1`).set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});
          });

          it('should 404 with not existing place', async () => {
            const response = await request.delete(`${url}/200`).set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
              code: 'NOT_FOUND',
              message: 'No user with this id exists', //!!!!!!!!!!!!!!!!!! aanpassen!
            });
            expect(response.body.stack).toBeTruthy();
          });

          it('should 400 with invalid order id', async () => {
            const response = await request.delete(`${url}/invalid`).set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.params).toHaveProperty('id');
          });
      
          testAuthHeader(() => request.delete(`${url}/1`));
    }) //einde vierde test


})

})
