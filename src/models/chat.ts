export interface ParamsGroups {
    onlyJoinedGroup?: boolean;
    companyCd: string;
    siteCd: string;
    SearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface GroupInformation {
    groupId: string;
    groupName: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    timeStamp: string;
    members: [
        {
            loginId: string;
            employeeCd: string;
            employeeName: string;
        },
    ];
}

export interface Groups {
    items: GroupInformation[];
    totalRecords: number;
}

export interface ParamsGroupChat {
    SearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface Mesages {
    items: MesagesInformation[];
    totalRecords: number;
}

export interface MesagesInformation {
    messageId: string;
    type: number;
    content: string;
    sender: string;
    groupId: string;
    createDate: string;
    fromUserId: string;
    chatEmojis: EmojiInformation[];
    attachedFiles: FileInformation[];
    timeStamp: string;
}

export interface EmojiInformation {
    emojiId: string;
    sender: string;
    createDate: string;
    fromUserId: string;
    emoji: string;
}

export interface Files {
    items: FileInformation[];
    totalRecords: number;
}

export interface FileInformation {
    fileId: number;
    fileName: string;
    fileExtention: string;
    fileLength: number;
    sender?: string;
    createDate?: string;
    fromUserId?: string;
}

export interface ParamsGetUser {
    groupId: string;
    SearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface Users {
    items: UserInformation[];
    totalRecords: number;
}

export interface UserInformation {
    employeeCd: string;
    employeeName: string;
    loginId: string;
}

export interface ParamsGetCompanies {
    SearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface ICompanyInformation {
    customerCd: string;
    customerName: string;
    companyCd: string;
    companyName: string;
    companyNameFurigana: string;
}

export interface ICompanies {
    items: ICompanyInformation[];
    totalRecords: number;
}

export interface ParamsGetSites {
    field: number;
    SearchText?: string;
    PageNumber: number;
    PageSize: number;
}

export interface ISitesInformation {
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

export interface ISites {
    items: ISitesInformation[];
    totalRecords: number;
}
