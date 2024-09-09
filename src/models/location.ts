export interface IParamsRequestPostLocation {
    vehicleTypeCd: string;
    vehicleCd: string;
    carrierCd: string;
    driverCd: string;
    latitude: any;
    longitude: any;
}

export interface ILocation {
    id: string;
    latitude: any;
    longitude: any;
    updateDate: string;
    driverCd: string;
    driverName: string;
    vehicleTypeCd: string;
    vehicleTypeName: string;
    vehicleCd: string;
    vehicleName: string;
    uncollected: number;
    collected: number;
    exclusion: number;
}
