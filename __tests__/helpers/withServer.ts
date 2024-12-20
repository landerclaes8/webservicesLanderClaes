import supertest from 'supertest';
import type { Server } from '../../src/createServer';
import createServer from '../../src/createServer';
import { prisma } from '../../src/data';
import { hashPassword } from '../../src/core/password';
import Role from '../../src/core/roles';

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();
   

    const passwordHash = await hashPassword('12345678');
    await prisma.user.createMany({
      data: [
        {
          id: 1,
          name: 'Test User',
          email: 'test.user@hogent.be',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.USER]),
        },
        {
          id: 2,
          name: 'Admin User',
          email: 'admin.user@hogent.be',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.ADMIN, Role.USER]),
        },
      ],
    })
  
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
          },
      ],
  });

    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.order.deleteMany();

    await server.stop();
  });
}
