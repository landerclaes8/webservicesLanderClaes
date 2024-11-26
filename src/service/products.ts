//verbonden met databank

import { Product } from "@prisma/client";
import { prisma } from "../data";
import { ProductCreateInput, ProductUpdateInput } from "../types/product";


export const getAll = async (): Promise<Product[]> => {
    return prisma.product.findMany();
};

export const getById = async (id:number): Promise<Product> => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        }, select: {
            id: true,
            prijs: true,
            soort: true,
            merk: true,
            kleur: true,
            maat: true,
            stofsoort: true,
        },
    });

    if(!product){
        throw Error
    };

    return product;
};

export const createProduct = async (product: ProductCreateInput): Promise<Product> => {
    try{
        return await prisma.product.create({
            data: product,
        });
    }catch (error){
        throw (error)
    }
 };

export const updateProductById = async(id: number, changes: ProductUpdateInput): Promise<Product> => {
    try{
        return await prisma.product.update({
            where: {
                id,
            },
            data: changes,
        });
    }catch(error){
        throw (error);
    };
};

export const deleteById = async(id: number) => {
    try{
        await prisma.product.delete({
            where: {
                id,
            },
        });
    }catch(error){
        throw (error);
    };
};

