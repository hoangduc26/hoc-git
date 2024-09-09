export interface IDriver {
    cd: string;
    name: string;
}

export interface IParamsRequestGetDrivers {
    search?: string;
    page: number;
    size: number;
}

export interface IResponseGetDriverssSuccess {
    items: IDriver[];
    totalRecords: number;
}
