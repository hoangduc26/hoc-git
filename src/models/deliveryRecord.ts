export interface IDeliveryRecord {
    deliverySeqNo: number;
    deliveryDate: string;
    siteStts: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    sitePost: string;
    siteTel: string;
    siteAddress: string;
    siteAddress2: string;
    note1: string;
    note2: string;
    note3: string;
    deliveryQuantity?: number;
    timeStamp?: string;
    collectionSiteDtos?: IDeliveryRecordCollectionSite[];
}

export interface IDeliveryRecordCollectionSite {
    seqNo: number;
    edaban: number;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    siteCheck: boolean;
    productCd: string;
    productName: string;
    otherProductFlg: number;
    timeStamp: string;
}

export interface IUpdateDeliveryRecord {
    unloadingCompanyCd: string;
    unloadingSiteCd: string;
    deliveryDate: string;
    deliveryQuantity: any;
    workDate: string;
    carrierCd: string;
    vehicleCd: string;
    deliveryRecordRegistSetting: number;
    collectionSiteDtos: {
        seqNo: number;
        edaban: number;
        timeStamp: string;
    }[];
    timeStamp: string;
}

export interface IDeleteDeliveryRecord {
    timeStamp: string;
}

export interface IAddDeliveryRecord {
    unloadingCompanyCd: string;
    unloadingSiteCd: string;
    deliveryDate: string;
    deliveryQuantity: any;
    workDate: string;
    carrierCd: string;
    vehicleCd: string;
    deliveryRecordRegistSetting: number;
    collectionSiteDtos: {
        seqNo: number;
        edaban: number;
        timeStamp: string;
    }[];
}

export interface IParamsRequestGetDeliveryRecord {
    WorkDate: string;
    CarrierCd: string;
    VehicleCd: string;
    PageNumber: number;
    PageSize: number;
}

export interface IParamsRequestGetDeliveryRecordById {
    id: string;
    WorkDate: string;
    CarrierCd: string;
    VehicleCd: string;
    DeliveryRecordRegistSetting: number;
}

export interface IResponseGetDeliveryRecordssSuccess {
    items: IDeliveryRecord[];
    totalRecords: number;
}

export interface IParamsRequestGetDVCollectionSites {
    WorkDate: string;
    CarrierCd: string;
    VehicleCd: string;
    DeliveryRecordRegistSetting: number;
}

export interface IUploadingSite {
    customerCd: string;
    customerName: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    siteNameFurigana: string;
    siteAddress: string;
    siteAddress2: string;
}

export interface IResponseGetDVUnloadingSitesSuccess {
    items: IUploadingSite[];
    totalRecords: number;
}