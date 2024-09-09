export interface IUserLogin {
    isAuthenticated: boolean;
    message: string;
    accessToken: string;
    accessTokenExpiryTime: string;
    refreshToken: string;
    refreshTokenExpiryTime: string;
    isSystemLimit: boolean;
    allowFileUpload: boolean;
    allowSiteNotesFileUpload: boolean;
    isDisplayOperationStatus: boolean;
    locationInformationTime: number;
    authorizedMenu: any;
    employeeCd: string;
    employeeName: string;
}

export interface IRefreshToken {
    accessToken: string;
    accessTokenExpiryTime: string;
    refreshToken: string;
    refreshTokenExpiryTime: string;
}
