export interface ISalePerson {
    cd: string;
    name: string;
}

export interface IParamsRequestGetSalePerson {
    search?: string;
    page: number;
    size: number;
}

export interface IResponseGetSalePersonssSuccess {
    items: ISalePerson[];
    totalRecords: number;
}
