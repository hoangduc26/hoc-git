import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import dayjs from 'dayjs';
import { ISystemSetting } from 'models/systemSetting';
import {
    SETTING_WHEN_SELECT_VEHICLE,
    COLLECTION_RESULT_INPUT_SETTING,
    IMPORT_RECORD_REGISTRAION_SETTING,
    WORK_LINE_VOUCHER_SETTING,
    SORT_TYPE,
    LOCAL_STORAGE,
    SPOT_WORK_DATE_TYPE,
    SETTING_SEARCH_DISPATCH_STATUS,
    SPOT_CONVERT,
    SETTING_PRODUCT_TYPE,
    DEFAULT_COLOR,
    DISPATCH_TYPES,
} from 'utils/constants';
import customFetchBase from './customFetchBase';

export const DEFAULT_SYSTEM_SETTING = {
    defaultColor: DEFAULT_COLOR.PURPLE,
    // 入力確認メッセージ設定
    inputConfirmMessageFlg: true,
    // 車輌選択時設定
    settingWhenSelectVehicle: SETTING_WHEN_SELECT_VEHICLE.PRIORITIZE_LAST_USED_VEHICLE,
    settingProductType: SETTING_PRODUCT_TYPE.DEFAULT,
    collectionResultInputSetting: {
        // 明細行初期表示件数
        convertedPackagingSetting: SPOT_CONVERT.CONVERTED_QUANTITY,
        prioritize: COLLECTION_RESULT_INPUT_SETTING.PRIORITIZE.QUANTITY_INPUT,
        dispatchType: DISPATCH_TYPES[0].value,
    },
    commonPageSize: 5,
    // 搬入実績登録設定
    importRecordRegistrationSetting:
        IMPORT_RECORD_REGISTRAION_SETTING.CARRIED_TO_EACH_COLLECTION_SITE,
    // 作業明細伝票設定
    workLineVoucherSetting: WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT,
    isPrintCopy: true,
    // 画面表示自動更新設定（リロード）- 更新間隔（秒）
    screenDisplay: {
        intervalAutoUpdate: 120,
    },
    // 位置情報の更新設定 - 更新間隔（秒）
    location: {
        intervalAutoUpdate: 120,
    },
    // Vehicle dispatch status search default settings
    // 検索条件/絞り込み/並び順の保持設定
    searchDispatchStatusDefault: {
        settingSearch: SETTING_SEARCH_DISPATCH_STATUS.PRIORITIZE_PREVIOUS_SEARCH,
        dispatchType: 0,
        isSearchWorkDate: true,
        dateCompareType: SPOT_WORK_DATE_TYPE.MATCH,
        dispatchStatusIsReceived: false,
        dispatchStatusIsDispatch: false,
        dispatchStatusIsRecorded: false,
        dispatchStatusIsCancel: false,
        dispatchStatusIsNoCollection: false,
        branchCd: null,
        branchName: '',
        salesPersonCd: null,
        salesPersonName: '',
        driverCd: null,
        driverName: '',
        vehicleTypeCd: null,
        vehicleTypeName: '',
        collectionPlaceType: 0,
        collectionPlace: '',
        sortOrder: SORT_TYPE.ASCENDING,
    },
    // 受入実績入力 品名既定値設定
    productDefault: [],
};

export const systemSettingApi = createApi({
    reducerPath: 'SystemSettingApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getSystemSetting: builder.query<ISystemSetting, any>({
            query: (params) => ({
                url: '/v1/settings/systemsetting',
                params,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        saveSystemSetting: builder.mutation<any, any>({
            query: (body) => ({
                url: '/v1/settings/registsystemsetting',
                body,
                method: 'POST',
                credentials: 'include',
            }),
        }),
    }),
});

const systemSettingSlice = createSlice({
    name: 'systemSettingSlice',
    initialState: {
        systemSetting: null,
    },
    reducers: {
        saveSystemSettingToStore: (state, action) => {
            state.systemSetting = JSON.parse(JSON.stringify(action.payload));
        },
    },
});
export const { useLazyGetSystemSettingQuery, useSaveSystemSettingMutation } = systemSettingApi;
export const { saveSystemSettingToStore } = systemSettingSlice.actions;
export const SystemSettingReducer = systemSettingSlice.reducer;