export interface IResponseGetProducts {
    items: Product[];
    totalRecords: number;
}

export interface UnitsResponse {
    unitCd: number;
    unitName: string;
    unitShortName: string;
}

export interface Product {
    productCd: string;
    productName: string;
    productShortName: string;
    productNameFurigana: string;
    unitCd: number;
    name: string;
    key: string;
    typeCd?: string;
    typeName?: string;
}

export interface IParamsGetProductByType {
    SearchText: string;
    SearchType?: any;
    PageNumber: number;
    PageSize: number;
}

export interface IProductTypes {
    cd: string;
    name: string;
}

export interface IResponseGetProductTypes {
    items: IProductTypes[];
    totalRecords: number;
}
