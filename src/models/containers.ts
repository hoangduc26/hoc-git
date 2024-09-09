export interface ParamsContainer {
    containerType?: string;
    SearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface ContainerInformation {
    containerCd: string;
    containerName: string;
    containerTypeCd: string;
    containerTypeName: string;
}

export interface Container {
    items: ContainerInformation[];
    totalRecords: number;
}
