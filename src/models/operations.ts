export interface ResOperationStatus {
    id: string;
    latitude: number;
    longitude: number;
    updateDate: Date;
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
export interface ParamsOperationStatus {
    refDate: string;
}
