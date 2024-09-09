import { OrderBy, CollectionStatus } from '../utils/enums';

export interface IParamsRequestCollectionSpots {
    driverCd: string;
    vehicleCd: string;
    workingDate: any;
    displayUnregisteredContainer: boolean;
    status: CollectionStatus;
    orderType: number;
    orderBy: OrderBy;
    PageNumber: number;
    PageSize: number;
}

export interface ISpot {
    seqNo: number;
    collectionNo: number;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    collectionNote: string;
    status: string;
    isExclusion: boolean;
    isExistsContainer: boolean;
    isExistsContainerUnregistered: boolean;
    isExistsSiteNote: boolean;
    arrivalTimeName: string;
    arrivalTime: string;
}


export interface IResponseGetSpotsSuccess {
    items: ISpot[];
    totalRecords: number;
}
