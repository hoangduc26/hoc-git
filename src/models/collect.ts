import { OrderBy } from 'utils/enums';

export interface IBodyRequestDenshimanifest {
    hikiwatashiTanName: string,
    carrierCd: string,
    vehicleCd: string,
    timeStamp: string
}
export interface CollectionInformation {
    seqNo: number;
    dispatchType: number;
    collectionDate: string;
    companyName: string;
    siteName: string;
    timeStamp: string;
}

export interface CollectSummary {
    unreadMessage: number;
    uncollected: number;
    collected: number;
    exclusion: number;
    containerUnregistered: number;
    collectionInformation: CollectionInformation[];
}

export interface ParamsCollectSummary {
    driverCd: string;
    vehicleCd: string;
    carrierCd: string;
    workingDate: string;
}

export interface CollectionDetail {
    isCreateNew: boolean;
    id?: string;
    seqNo?: number;
    rowNo?: number;
    productCd?: string;
    productName?: string;
    quantity?: number | string;
    unitCd?: number;
    unitName?: string;
    convertedQuantity?: number | string;
    convertedUnitCd?: number | string;
    convertedUnitName?: string;
    addProductFlag?: boolean;
    packagingCd?: string;
    packagingName?: string;
    packagingQuantity?: any;
    maniPatternSystemId?: number;
    jwnetFlg?: boolean;
    timeStamp?: string;
}

export interface ResCollectionBySeqNo {
    seqNo: number;
    collectionDate: string;
    operationTime: string;
    companyCD: string;
    companyName: string;
    siteCD: string;
    siteName: string;
    timeStamp: string;
    collectionDetails: CollectionDetail[];
}

export interface SiteNotesPostDto {
    hidden: string;
    siteNoteNumber: number;
    customerCd: string;
    customerName: string;
    companyCd: string;
    companyName: string;
    changeable: boolean;
    siteCd: string;
    siteName: string;
    siteNoteTypeCd: string;
    siteNoteTypeName: string;
    title: string;
    content1: string;
    content2: string;
    sourceCd: string;
    sourceName: string;
    sourceNumber: number;
    sourceDetailNumber: number;
    comment: string;
    files: object[];
    deleteCommentSystemIds: number[];
    deleteFileIds: number[];
    createdBy: string;
    timeStamp: string;
}

export class SiteNotesPostClass {
    hidden: string = null;

    siteNoteNumber: number = null;

    customerCd: string = null;

    customerName: string = null;

    companyCd: string = null;

    companyName: string = null;

    changeable: boolean = null;

    siteCd: string = null;

    siteName: string = null;

    siteNoteTypeCd: string = null;

    siteNoteTypeName: string = null;

    title: string = null;

    content1: string = null;

    content2: string = null;

    sourceCd: string = null;

    sourceName: string = null;

    sourceNumber: number = null;

    sourceDetailNumber: number = null;

    comment: string = null;

    files: object[] = null;

    deleteCommentSystemIds: number[] = null;

    deleteFileIds: number[] = [];

    createdBy: string = null;

    timeStamp: string = null;
}

export interface ICollectionPrint {
    seqNo: number;
    createDate: string;
    operationTime: string;
    driverName: string;
    companyName1: string;
    companyName2: string;
    companyNameTitle1: string;
    companyNameTitle2: string;
    siteName1: string;
    siteName2: string;
    carrierName1: string;
    carrierName2: string;
    carrierPostalCode: string;
    carrierAddress1: string;
    carrierAddress2: string;
    carrierTel: string;
    collectionDetails: CollectionDetail[];
}
export interface Collection {
    seqNo: number;
    customerCD: string;
    customerName: string;
    companyCD: string;
    companyName: string;
    siteCD: string;
    siteName: string;
    receptionType: number;
    dispatchType: number;
    sourceNumber: number;
    sourceDetailNumber: number;
    arrivalTime: string;
    collectionDate: string;
    isExclusion: boolean;
    timeStamp: string;
}

export interface ParamCollection {
    seqNo: number;
}

export interface ICollectionBySeqNo {
    seqNo: number;
    status: string;
    receptionType: number;
    receptionNo: number;
    collectionDate: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    disposalCompanyCd: string;
    disposalSiteCd: string;
    disposalSiteName: string;
    timeZoneType: number;
    operationTime?: any;
    workingTimeStart: string;
    workingTimeEnd: string;
    generalContainerCd: string;
    generalContainerName: string;
    settingType: number;
    quantity: number | string;
    unitCd: number;
    signature: any;
    sourceCd: number;
    manifestType?: number;
    timeStamp: string;
    collectionDetails: CollectionDetail[];
}

export interface IBodyRequestUpdateCollection {
    collectionDate: string,
    operationTime: string,
    timeStamp: string,
    convertedPackagingSetting: number,
    collectionDetails: {
        rowNo: number,
        productCd: string,
        quantity: number,
        unitCd: number,
        convertedQuantity: number,
        convertedUnitCd: number,
        packagingCd: string,
        packagingQuantity: number,
        timeStamp: string
    }[]
}

export interface IIndustrialWaste {
    wasteTypeCd: string,
    wasteTypeName: string,
    quantity: number,
    unitName: string,
    packagingCd: string,
    packagingName: string,
    packagingQuantity: number,
}
export interface IResponseGetCollectionProductConfirm {
    seqNo: number,
    timeStamp: string,
    industrialWasteDtos: IIndustrialWaste[

    ],
    deliveryPerson: string
}

export interface ICollection {
    dispatchType: number;
    seqNo: number;
    collectionNo: number;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    siteNameFirugana: string;
    courseNameCd: string;
    courseName: string;
    rowNumber: number;
    collectionNote: string;
    status: string;
    isExclusion: boolean;
    isExistsContainer: boolean;
    isExistsContainerUnregistered: boolean;
    isExistsSiteNote: boolean;
    arrivalTimeName: string;
    arrivalTime: string;
}

export interface IResponseGetCollectionssSuccess {
    items: ICollection[];
    totalRecords: number;
}

export interface IParamsRequestCollections {
    dispatchType: number;
    driverCd: string;
    vehicleCd: string;
    workingDate: any;
    displayUnregisteredContainer: boolean;
    SearchText: string | null;
    status: number[];
    orderType: number;
    orderBy: OrderBy;
    PageNumber: number;
    PageSize: number;

}