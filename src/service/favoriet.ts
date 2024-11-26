// verbonden met databank
import { prisma } from "../data";
import { Product } from "../types/product";
import type { FavorietCreateInput } from "../types/favorietProduct";
//import { FavorietProduct } from "../types/favorietProduct";

// geeft alle favorietId's en userId's terug
export const getAll = async () => {
    return prisma.favoriet.findMany();
}

export const getById = async (id: number): Promise<Product[]> => {
    const favoriet = await prisma.favorietProduct.findMany({
        where: {
            favorietId: id
        },
        include: {
            product: true
        }
    });

    if (!favoriet || favoriet.length === 0) {
        throw new Error('Geen winkelmand met dit id');
    }

    return favoriet.map(fp => fp.product);
};

//nieuwe rij aanmaken in favorietProduct. 
export const voegToeById = async (id: number, input: FavorietCreateInput): Promise<FavorietCreateInput> => {
    return prisma.favorietProduct.create({
      data: {
            favorietId: id,
            productId: Number(input.productId)
        }
    })
} 

//verwijderen van rij in favorietProduct
export const verwijderById = async (id: number, input: FavorietCreateInput) => {
    await prisma.favorietProduct.delete({
        where: {
            favorietId_productId: {
                favorietId: id,
                productId: Number(input.productId),
            }
        }
    })
}