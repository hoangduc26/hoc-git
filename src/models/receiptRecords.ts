export interface ParamsScalings {
    ReceiptDate: string;
    RecordType?: number;
    WorkerCd?: string;
    EtcType: number;
    EtcSearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface WeighingInformation {
    orderType: number;
    slipSystemId: number;
    slipNumber: number;
    slipDate: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    slipNote: string;
    temporaryNote: string;
    carrierCd: string;
    carrierName: string;
    vehicleCd: string;
    vehicleName: string;
    vehicleTypeCd: string;
    vehicleTypeName: string;
    driverCd: string;
    driverName: string;
    customerCd: string;
    customerName: string;
    salesPersonCd: string;
    salesPersonName: string;
    receiptRecordSeq: number;
}

export interface Scalings {
    items: WeighingInformation[];
    totalRecords: number;
}

export interface ParamsReceiptRecords {
    WorkDate?: string;
    WorkerCd?: string;
    EtcType: number;
    EtcSearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface ReceiptRecordsInformation {
    orderType: number;
    slipSystemId: number;
    seq: number;
    workDate: string;
    workTime: string;
    workerCd: string;
    workerName: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    carrierCd: string;
    carrierName: string;
    vehicleCd: string;
    vehicleName: string;
    vehicleTypeCd: string;
    vehicleTypeName: string;
    isExistsFile: boolean;
}

export interface ReceiptRecords {
    items: ReceiptRecordsInformation[];
    totalRecords: number;
}

export interface ParamsReceiptRecordDetail {
    seq?: number;
}

export interface ReceiptRecordDetail {
    orderType: number;
    slipSystemId: number;
    slipNumber: number;
    slipDate: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    slipNote: string;
    temporaryNote: string;
    carrierCd: string;
    carrierName: string;
    vehicleCd: string;
    vehicleName: string;
    vehicleTypeCd: string;
    vehicleTypeName: string;
    driverCd: string;
    driverName: string;
    customerCd: string;
    customerName: string;
    salesPersonCd: string;
    salesPersonName: string;
    seq: number;
    workDate: string;
    workTime: string;
    workerCd: string;
    workerName: string;
    workNote: string;
    detailDtos: [
        {
            detailSystemId: number;
            detailSeq: number;
            productCd: string;
            productName: string;
            quantity: number;
        },
    ];
    fileDataDtos: [
        {
            fileId: number;
            fileName: string;
            fileExtention: string;
            fileLength: number;
        },
    ];
    timeStamp: string;
}
