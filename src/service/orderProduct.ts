import { prisma } from '../data';
import type { OrderProduct, OrderProductCreateInput } from '../types/orderProduct';
import handleDBError from './_handleDBError';



const ORDERPRODUCT_SELECT = {
    orderId: true,
    productId: true,
    aantal: true,
}

export const getAll = async (): Promise<OrderProduct[]> => {
    return prisma.orderProduct.findMany({
        select: ORDERPRODUCT_SELECT,
    })
};

export const getByOrderId = async (orderId: number): Promise<OrderProduct[]> => {
    const order_Id = Number(orderId)
 
    const order=  prisma.orderProduct.findMany({
        where: {
            orderId: order_Id, //orderId is gelijk aan de orderId parameter
        },
        select: ORDERPRODUCT_SELECT,
    });

    return order;

};

export const voegtoe = async (input: OrderProductCreateInput): Promise<OrderProduct> => {
   try{
    return await prisma.orderProduct.create({
        data: input,
    });
   }catch (error: any){
    throw handleDBError(error)
   }
};

export const deleteByOrderId = async (orderId: number) => {
    try{
    const order_id = Number(orderId);
    
    await prisma.orderProduct.deleteMany({
        where: {
            orderId: order_id,
        }
    });
}catch(error: any){
    throw handleDBError('niet verwijderd');
    }
};

export const deleteByOrderProductId = async (orderId: number, productId: number) => {
   try{ 
    const order_id = Number(orderId)

    await prisma.orderProduct.delete({
        where: {
            orderId_productId: {
                orderId: order_id,
                productId: productId,
            },
        }
    })
} catch(error: any){
    console.log(error.message)
    throw handleDBError(error)

    }
}
