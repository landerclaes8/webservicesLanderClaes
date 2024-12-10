import type { Entity, ListResponse } from "./common";

export interface Product extends Entity {

    prijs: number;
    soort: string;
    merk: string;
    kleur: string;
    maat: string;
    stofsoort: string;
};

export interface ProductCreateInput {
    
    prijs: number;
    soort: string;
    merk: string;
    kleur: string;
    maat: string;
    stofsoort: string;
};

export interface GetAllProductsResponse extends ListResponse<Product> {};
export interface ProductUpdateInput extends ProductCreateInput {};

export interface GetProductByIdResponse extends Product{};
export interface CreateProductResponse extends ProductCreateInput{};
export interface CreateProductRequest extends GetProductByIdResponse {};
export interface UpdateProductResponse extends GetProductByIdResponse {};
export interface UpdateProductRequest extends ProductUpdateInput {};