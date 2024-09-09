export interface IParamsRequestGetPastComplaint {
    CompanyCd: string;
    SiteCd: string;
    PageNumber: number;
    PageSize: number;
    CompletionType: number;
}

export interface IGetPastComplaintSuccess {
    items: IPastComplaint[];
    totalRecords: number;
}

export interface IPastComplaint {
    systemId: 0;
    seq: 0;
    branchCd?: number;
    receptionNumber?: number;
    receptionDate?: string;
    customerCd?: string;
    customerName?: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    salesPersonCd?: string,
    salesPersonName?: string,
    responseCompletedDate: string;
    titleName: string;
    contactAssignee: string;
    content1: string;
    content2: string;
    content3: string;
    content4: string;
    content5: string;
    content6: string;
    content7: string;
    content8: string;
    timeStamp: string;
}
