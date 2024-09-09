import { CollectionDetail } from './collect';
import { IDriver } from './driver';

export interface IParamsGetDriverReplacementsDrivers {
    SearchText: string,
    PageNumber: number,
    PageSize: number,
}

export interface IResponseGetDriverReplacementsDrivers {
    items: IDriver[],
    totalRecords: number,
}

export interface IParamsGetDriverReplacementsSpotsByDriverCd {
    driverCd: string,
    receptionType?: number,
    siteSearchType: number,
    siteSearchText: string,
    orderBy: number,
    orderType: number,
}

export interface IDriverReplacementSSpot {
    seqNo: number
    companyCd: string,
    companyName: string,
    siteCd: string,
    siteName: string,
    siteCheck?: boolean,
    timeStamp: string,
    collectionDetails: CollectionDetail[],
    receptionType: number
    arrivalTimeName: string,
    arrivalTime: string,
}

export interface IDriverReplacementsSpotsRegister {
    driverCd: string,
    vehicleCd: string,
    vehicleTypeCd: string,
    carrierCd: string,
    collectionDatas: {
        id: number
        timeStamp: string
    }[]
}

export interface IParamsGetCourseOfDay {
    driverCd: string,
    SearchText: string,
    PageNumber: number,
    PageSize: number,
}

export interface ICourseOfDay {
    dispatchNo: number,
    courseNameCd: string,
    courseName: string
}

export interface IResponseGetCourseOfDay {
    items: ICourseOfDay[],
    totalRecords: number,
}

export interface IParamsGetDriverReplacementCoursesByDriverCd {
    driverCd: string,
    dispatchNo: any,
    siteSearchType: number,
    siteSearchText: string,
}

export interface IDriverReplacementsCourse {
    seqNo: number,
    companyCd: string,
    companyName: string,
    siteCd: string,
    siteName: string,
    siteCheck?: boolean,
    timeStamp: string,
    collectionDetails: CollectionDetail[],
    rowNo: number,
    note: string,
    courseNameCd: string,
    courseName: string
}

export interface IDriverReplacementsCoursesRegister {
    driverCd: string,
    vehicleCd: string,
    vehicleTypeCd: string,
    carrierCd: string,
    collectionDatas: {
        id: number
        timeStamp: string
    }[]

    dispatchNo: number,
}