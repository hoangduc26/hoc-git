export interface ParamsDispatchStatus {
    dispatchType: number;
    dateCompareType?: number;
    workDateFrom?: string;
    workDateTo?: string;
    spotStatus?: number[];
    branchCd?: number;
    salesPersonCd?: string;
    driverCd?: string;
    vehicleTypeCd?: string;
    collectionPlaceType?: number;
    collectionPlace?: string;
    sortOrder: number
    pageNumber: number;
    pageSize: number;
}

export interface DispatchStatusResponse {
    items: DispatchStatusInformation[];
    totalRecords: number;
}

export interface DispatchStatusInformation {
    systemId: number;
    seqNo: number;
    dispatchSlipNo: number;
    slipTypeCd: number;
    slipType: string;
    collectionStatus: string;
    workDate: string;
    arrivalTimeName: string;
    arrivalTime: string;
    startTime: string;
    endTime: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    courseName: string;
    driverName: string;
    vehicleName: string;
    vehicleTypeName: string;
    unclosedCnt: number;
    closedCnt: number;
    excludeCnt: number;
    containerSetCnt: number;
    containerAgeCnt: number;
    dispatchStatusName: string;
    branchName: string;
    mobileDispatchSlipNo: number;
    siteNoteExistsFlg: boolean;
    isExclusion: boolean;
    productList: string[];
}

export interface DropdownResponse {
    cd: number;
    name: string;
}
