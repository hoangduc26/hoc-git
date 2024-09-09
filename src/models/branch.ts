export interface IBranch {
    cd: string;
    name: string;
}
export interface IParamsRequestGetBranch {
    search?: string;
    page: number;
    size: number;
}

export interface IResponseGetBranchssSuccess {
    items: IBranch[];
    totalRecords: number;
}
