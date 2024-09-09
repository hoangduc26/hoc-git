export interface IVehicle {
    companyCd?: string;
    companyShortName?: string;
    vehicleCd?: string;
    vehicleName?: string;
    vehicleTypeCd?: string;
    vehicleTypeShortName?: string;
}

export interface IVehicleType {
    cd?: string;
    name?: string;
}

export interface IParamsRequestGetVehicle {
    vehicleType?: string;
}
export interface IParamsRequestGetVehicleType {
    search?: string;
    page: number;
    size: number;
}

export interface IResponseGetVehicleTypessSuccess {
    items: IVehicleType[];
    totalRecords: number;
}
