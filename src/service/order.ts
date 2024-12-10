//verbonden met databank
import { prisma } from "../data";
import type {Order, OrderCreateInput} from "../types/order";
import ServiceError from "../core/serviceError";
import Role from "../core/roles";
import handleDBError from "./_handleDBError";

const ORDER_SELECT = {
    id: true,
    date: true,
    user: {
        select: {
            id: true,
            name: true,
        }
    },
    orderproduct: { //staat klein geschreven in de databank
        select: {
            orderId: true,
            productId: true,
            aantal: true,
        }
    }, 
   };

export const getAll = async (roles: string[], userId: number): Promise<Order[]> => {
    return prisma.order.findMany({
        where:  roles.includes(Role.ADMIN) ? {} : { user_id: userId },
        select: ORDER_SELECT,
});
};

export const getById = async (orderId: number, roles: string[], userId: number): Promise<Order> => {
    const extraFilter = roles.includes(Role.ADMIN) ? {} : { user_id: userId };
    const id = Number(orderId)
    const order = await prisma.order.findUnique({
        where: {
            id,
            ...extraFilter
        },
        select: ORDER_SELECT,
 }
    );

    if (!order) {
        throw ServiceError.notFound('Geen order met dit id');
    }

    //geeft een array terug zoals gedefinieerd in ProductArrayResponse
    return order;
};

export const voegToeById = async (input: OrderCreateInput): Promise<Order> => {
    try{
    return await prisma.order.create({
      data: {
        user_id: input.userId,
        date: input.date
      },
      
    });
}catch(error: any){
    throw handleDBError(error);
}
   
};

export const verwijderById = async (orderId: number, roles: string[], userId: number): Promise<void> => {
    try{
    const extraFilter = roles.includes(Role.ADMIN) ? {} : { user_id: userId };
    const id = Number(orderId)

    await prisma.order.delete({
        where: {
            id,
            ...extraFilter
        }
    })
}catch(error: any){
    throw handleDBError(error); //
}
};