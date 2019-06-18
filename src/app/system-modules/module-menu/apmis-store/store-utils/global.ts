export const Filters = {
    All: 'All',
    ToExpire: 'Expire: This Week',
    Expired: 'Expired',
    BelowReOrder: 'Below Re-Order Level',
    OutOfStock: 'Out of Stock',
    HighConsumptionRate: 'High Consumption Rate'
};

export const ProductsToggle = {
    All: 'All',
    Drug: 'Drug',
    Consumables: 'Consumables'
};
export interface StoreProduct {
    code: string;
    id: string;
    name: string;
    type: number;
}
export interface ProductPackSize {
    id: string;
    label: string;
    size: number;
}
export interface ProductConfig {
    _id?: string;
    productId: string;
    productObject: StoreProduct;
    facilityId: string;
    rxCode: string;
    packSizes: any[];
    productType: number;
}
export interface ProductBase {
    isBase: boolean;
    name: string;
}

export enum ProductType {
    Drugs = 0,
    Consumables = 1
}
export interface ApmisConsumables {
    STR: string;
    MAT: string;
    CODE: string;
    CONSUMABLECATEGORYID: string;
}
