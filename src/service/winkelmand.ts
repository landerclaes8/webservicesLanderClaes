//verbonden met databank
import { prisma } from "../data";
import type {WinkelmandCreateInput, WinkelmandProductId } from "../types/winkelmandProduct";
import type { Product } from "../types/product";

// geeft alle winkelmandId's en userId's terug
export const getAll = async () => {
    return prisma.winkelmand.findMany();
}

//eventueel aanpassen dat hier ineens alle kenmerken van kleding worden gegeven, niet enkel id's
export const getById = async (id: number): Promise<Product[]> => {
    const winkelmand = await prisma.winkelmandProduct.findMany({
        where: {
            winkelmandId: id
        },
        include: {
            product: true
        }
    });

    if (!winkelmand || winkelmand.length === 0) {
        throw new Error('Geen winkelmand met dit id');
    }

    //geeft een array terug zoals gedefinieerd in ProductArrayResponse
    return winkelmand.map(wp => wp.product);
};

//nieuwe rij aanmaken in winkelmandProduct. 
export const voegToeById = async (iden: number, input: WinkelmandCreateInput): Promise<WinkelmandProductId> => {
    return await prisma.winkelmandProduct.create({
      data: {
        winkelmandId: iden,
        productId: Number(input.productId)
      }
    });
} 

//verwijderen van rij in winkelmand
export const verwijderById = async (id: number, input: WinkelmandProductId) => {
    await prisma.winkelmandProduct.delete({
        where: {
            winkelmandId_productId: {
                winkelmandId: id,
                productId: Number(input.productId)
            }
        }
    })
}