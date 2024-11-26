import { Product } from "@prisma/client";
import type { Entity} from "./common";


export interface WinkelmandProduct extends Entity{
    productId: number
}

export interface WinkelmandProductId{
    productId: number
}

export interface WinkelmandCreateInput {
    productId: number;
}

//type voor array van alle producten in winkelmand
export type ProductArrayResponse = Product[];
export interface GetWinkelmandByIdResponse extends ProductArrayResponse {}

export interface NieuwItemWinkelmandRequest extends WinkelmandCreateInput {}
export interface VerwijderUitWinkelmandRequest extends WinkelmandProductId{}









