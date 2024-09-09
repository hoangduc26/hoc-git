export interface IParamsRequestCollectionCourses {
    driverCd: string;
    vehicleCd: string;
    workingDate: any;
    carrierCd: string;
    PageNumber: number;
    PageSize: number;
}

export interface IParamsRequestCollectionCoursesByCd {
    courseNameCd: string;
    driverCd: string;
    vehicleCd: string;
    workingDate: any;
    PageNumber: number;
    PageSize: number;
    status?: number;
    SearchText?: string;
}

export interface ICourse {
    courseName: string;
    courseNameCd: string;
    uncollected: number;
    rowNumber?: number;
    seqNo?: number;
    collectionNo?: number;
    companyCd?: any;
    companyName?: string;
    siteCd?: any;
    siteName?: string;
    collectionNote?: string;
    status?: number;
    isExclusion?: boolean;
    isExistsSiteNote?: boolean;
}

export interface IResponseGetCoursesSuccess {
    items: ICourse[];
    totalRecords: number;
}
