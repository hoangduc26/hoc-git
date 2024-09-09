export interface CompaniesContract {
    items: CompanieContract[];
    totalRecords: number;
}

export interface CompanieContract {
    cd: string;
    name: string;
    customerCd: string;
    customerName: string;
    customerNameFurigana: string;
    companyCd: string;
    companyName: string;
    key: string;
}

// export interface ParamsQuerySearch {
//     PageNumber: number;
//     PageSize: number;
// }
export interface ParamsContracts {
    PageNumber: number;
    PageSize: number;
}

export interface SitesContract {
    items: SiteContract[];
    totalRecords: number;
}

export interface SiteContract {
    params: ParamsContracts;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    siteNameFurigana: string;
    siteAddress: string;
    siteAddress2: string;
    name: string;
    key: string;
    cd: string;
}
