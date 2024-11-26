import type { Entity } from "./common";
import { Product } from "./product";


export interface FavorietProduct extends Entity {
    productId: number
}

export interface FavorietCreateInput {
    productId: number;
}


export type GetFavorietByIdResponse = Product[];
export interface NieuwItemFavorietRequest extends FavorietCreateInput{};

export interface VerwijderUitFavorietResponse extends FavorietProduct{}
export interface VerwijderUitFavorietRequest extends FavorietCreateInput{}