//verbonden met databank
import { Product } from "@prisma/client";
import { prisma } from "../data";
import { ProductCreateInput, ProductUpdateInput } from "../types/product";
import ServiceError from "../core/serviceError";
import handleDBError from './_handleDBError'
import Role from "../core/roles";


const PRODUCT_SELECT = {
    id: true,
    prijs: true,
    soort: true,
    merk: true,
    kleur: true,
    maat: true,
    stofsoort: true,
}

export const getAll = async (): Promise<Product[]> => {
    return prisma.product.findMany({
        select: PRODUCT_SELECT
    });
};

export const getById = async (id:number): Promise<Product> => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        }, select: PRODUCT_SELECT
        
    });

    if(!product){
        throw ServiceError.notFound('No product with this id exists');
    };

    return product;
};

export const createProduct = async (product: ProductCreateInput, roles: string[]): Promise<Product> => {
    
    if(!roles.includes(Role.ADMIN)) {
            throw ServiceError.forbidden('Acces denied');
    }
    
    try{
        return await prisma.product.create({
            data: product,
        });
    }catch (error: any){
        throw handleDBError(error)
    }
 };

export const updateProductById = async(id: number, changes: ProductUpdateInput, roles: string[]): Promise<Product> => {
    if(!roles.includes(Role.ADMIN)) {
        throw ServiceError.forbidden('Acces denied');
    }
    try{
        return await prisma.product.update({
            where: {
                id,
            },
            data: changes,
        });
    }catch(error: any){
        throw handleDBError(error);
    };
};

export const deleteById = async(id: number, roles: string[]) => {
    if(!roles.includes(Role.ADMIN)) {
        throw ServiceError.forbidden('Acces denied');
    }
    try{
        await prisma.product.delete({
            where: {
                id,
            },
        });
    }catch(error: any){
        throw (handleDBError(error));
    };
};



