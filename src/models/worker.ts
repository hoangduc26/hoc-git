export interface IWorker {
    cd: string;
    name: string;
}

export interface IParamsRequestGetWorkers {
    SearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface IResponseGetWorkersSuccess {
    items: IWorker[];
    totalRecords: number;
}
