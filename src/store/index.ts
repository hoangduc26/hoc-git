import { Action, configureStore, ThunkAction, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import UserReducer, { AuthApi } from 'services/auth';
import { CollectionApi, CollectionReducer } from 'services/collection';
import { ProductReducer, ProductsApi } from 'services/product';
import { SystemSettingReducer, systemSettingApi } from 'services/systemSetting';
import { VehicleApi, VehicleReducer } from 'services/vehicle';
import { WorkingDateReducer } from 'services/workingDate';
import { SiteNotesApi, SiteNotesReducer } from 'services/siteNotes';
import { BranchApi } from 'services/branchs';
import { EmployeeApi } from 'services/employee';
import { SettingsApi } from 'services/settings';
import { PageReducer } from 'services/page';
import { LocationApi } from 'services/location';
import { DispatchStatusApi, DispatchStatusReducer } from 'services/dispatchStatus';
import { OperationStatusApi } from 'services/operations';
import { DeliveryRecordApi, deliveryRecordReducer } from 'services/deliveryRecord';
import { SitesApi } from 'services/sites';
import { PastComplaintsApi } from 'services/pastComplaints';
import { PrintReducer } from 'services/print/print';
import { ContainersApi } from 'services/containers';
import { ReceiptRecordsApi, ReceiptRecordsReducer } from 'services/receiptRecords';
import { DriverReplacementsApi } from 'services/driverReplacements';
import { PackagingApi } from 'services/packagings';
import { ManifestApi } from 'services/manifests';
import { CompaniesApi } from 'services/companies';
import { CommonsApi } from 'services/commons';
import { ContractsApi } from 'services/contracts';
import { ChatApi, GroupsReducer } from 'services/chat';
import { FileApi } from 'services/files';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    user: UserReducer,
    vehicle: VehicleReducer,
    workingDate: WorkingDateReducer,
    systemSetting: SystemSettingReducer,
    product: ProductReducer,
    page: PageReducer,
    collection: CollectionReducer,
    deliveryRecord: deliveryRecordReducer,
    dispatchStatus: DispatchStatusReducer,
    siteNotes: SiteNotesReducer,
    receiptRecords: ReceiptRecordsReducer,
    groupsChat: GroupsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: {
        print: PrintReducer,
        reducer: persistedReducer,
        [AuthApi.reducerPath]: AuthApi.reducer,
        [CollectionApi.reducerPath]: CollectionApi.reducer,
        [ProductsApi.reducerPath]: ProductsApi.reducer,
        [VehicleApi.reducerPath]: VehicleApi.reducer,
        [SiteNotesApi.reducerPath]: SiteNotesApi.reducer,
        [BranchApi.reducerPath]: BranchApi.reducer,
        [EmployeeApi.reducerPath]: EmployeeApi.reducer,
        [SettingsApi.reducerPath]: SettingsApi.reducer,
        [LocationApi.reducerPath]: LocationApi.reducer,
        [DispatchStatusApi.reducerPath]: DispatchStatusApi.reducer,
        [OperationStatusApi.reducerPath]: OperationStatusApi.reducer,
        [DeliveryRecordApi.reducerPath]: DeliveryRecordApi.reducer,
        [SitesApi.reducerPath]: SitesApi.reducer,
        [PastComplaintsApi.reducerPath]: PastComplaintsApi.reducer,
        [ContainersApi.reducerPath]: ContainersApi.reducer,
        [ReceiptRecordsApi.reducerPath]: ReceiptRecordsApi.reducer,
        [DriverReplacementsApi.reducerPath]: DriverReplacementsApi.reducer,
        [PackagingApi.reducerPath]: PackagingApi.reducer,
        [ManifestApi.reducerPath]: ManifestApi.reducer,
        [CompaniesApi.reducerPath]: CompaniesApi.reducer,
        [CommonsApi.reducerPath]: CommonsApi.reducer,
        [ContractsApi.reducerPath]: ContractsApi.reducer,
        [ChatApi.reducerPath]: ChatApi.reducer,
        [FileApi.reducerPath]: FileApi.reducer,
        [systemSettingApi.reducerPath]: systemSettingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat([
            AuthApi.middleware,
            CollectionApi.middleware,
            VehicleApi.middleware,
            ProductsApi.middleware,
            SiteNotesApi.middleware,
            BranchApi.middleware,
            EmployeeApi.middleware,
            SettingsApi.middleware,
            LocationApi.middleware,
            OperationStatusApi.middleware,
            DispatchStatusApi.middleware,
            DeliveryRecordApi.middleware,
            SitesApi.middleware,
            PastComplaintsApi.middleware,
            ContainersApi.middleware,
            ReceiptRecordsApi.middleware,
            DriverReplacementsApi.middleware,
            PackagingApi.middleware,
            ManifestApi.middleware,
            CompaniesApi.middleware,
            CommonsApi.middleware,
            ContractsApi.middleware,
            ChatApi.middleware,
            FileApi.middleware,
            systemSettingApi.middleware,
        ]),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
