// Common
export interface ParamsSearch {
    search: string;
    field?: number;
    page?: number;
    size?: number;
}

// Customer
export interface CustomerInformation {
    customerCd: string;
    customerName: string;
    customerNameFurigana: string;
}

export interface Customer {
    items: CustomerInformation[];
    totalRecords: number;
}

// Copmpany
export interface CompanyInformation {
    companyCd: string;
    companyName: string;
    companyNameFurigana: string;
}

export interface Company {
    items: CompanyInformation[];
    totalRecords: number;
}

// Site
export interface SitesInformation {
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    siteNameFurigana: string;
    siteAddress: string;
    siteAddress2: string;
    siteAssigneeName: string;
    siteAssigneeTel: string;
    siteSalesPersonName: string;
    siteTel: string;
    sitePost: string;
    note1: string;
    note2: string;
    note3: string;
    note4: string;
    receptionInstruction1: any;
    receptionInstruction2: any;
    receptionInstruction3: any;
    receptionNote1: string | null;
    receptionNote2: string | null;
    receptionNote3: string | null;
    customerCd: string;
    customerName: string;
}

export interface Sites {
    items: SitesInformation[];
    totalRecords: number;
}

// Type
export interface TypesInformation {
    cd: string;
    name: string;
}

export interface Types {
    items: TypesInformation[];
    totalRecords: number;
}

// Employees
export interface EmployeesInformation {
    cd: string;
    name: string;
}

export interface Employees {
    items: EmployeesInformation[];
    totalRecords: number;
}

// Titles
export interface TitlesInformation {
    cd: string;
    name: string;
}

export interface Titles {
    items: TitlesInformation[];
    totalRecords: number;
}

// Sources
export interface Sources {
    cd: number;
    name: string;
}

// SiteNote
export interface ParamsQuerySearch {
    PageNumber: number;
    PageSize: number;
}

export interface ParamsSiteNotes {
    params: ParamsQuerySearch;
    isHidden: boolean;
    customerCd: string;
    includeEmptyCustomer: boolean;
    companyCd: string;
    includeEmptyCompany: boolean;
    siteCd: string;
    includeEmptySite: boolean;
    siteNoteTypeCd: string;
    registeredBy: string;
    sourceCd: string;
    sourceNumber: number;
    sourceDetailNumber: number;
    includeFreeSearchText: boolean;
    freeSearchField: number;
    freeSearchText: string;
}

export interface SiteNotes {
    items: SiteNotesInformation[];
    totalRecords: number;
}

export interface SiteNotesInformation {
    changeable: boolean;
    comments: GetComment[];
    companyCd: string;
    companyName: string;
    content1: string;
    content2: string;
    createdBy: string;
    createdDate: string;
    customerCd: string;
    customerName: string;
    files: any;
    hiddenBy: any;
    hiddenDate: any;
    isHidden: boolean;
    registeredBy: string;
    seq: number;
    siteCd: string;
    siteName: string;
    siteNoteNumber: number;
    siteNoteTypeCd: string;
    siteNoteTypeName: string;
    sourceCd: string;
    sourceDetailNumber: any;
    sourceName: string;
    sourceNumber: any;
    systemId: number;
    timeStamp: string;
    title: string;
    isExistsAttachedFile: boolean;
}

export interface GetComment {
    comment: string;
    commentedBy: string;
    commentedDate: string;
    detailSystemId: number;
}
