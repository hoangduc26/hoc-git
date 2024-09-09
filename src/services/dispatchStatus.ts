import { createApi } from '@reduxjs/toolkit/query/react';
import {
    DispatchStatusResponse,
    DropdownResponse,
    ParamsDispatchStatus,
} from 'models/dispatchStatus';
import { createSlice } from '@reduxjs/toolkit';
import customFetchBase from './customFetchBase';

export const DispatchStatusApi = createApi({
    reducerPath: 'DispatchStatusApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getSearchDispatchStatus: builder.query<DispatchStatusResponse, ParamsDispatchStatus>({
            query: (params) => ({
                url: '/v1/dispatchstatuses',
                params,
                method: 'GET',
            }),
        }),
    }),
});
const initialState: { dispatchStatus?: any; cacheSearchCondition?: any } = {
    dispatchStatus: null,
    cacheSearchCondition: null,
};

const dispatchStatusSlice = createSlice({
    name: 'dispatchStatusSlice',
    initialState,
    reducers: {
        saveCacheSearchConditionDispatchStatus: (state, action) => {
            state.cacheSearchCondition = action.payload;
        },

        saveDispatchStatus: (state, action) => {
            state.dispatchStatus = action.payload;
        },

        cleanDispatchStatus: (state) => {
            state.dispatchStatus = null;
        },
    },
});

export const { saveDispatchStatus, cleanDispatchStatus, saveCacheSearchConditionDispatchStatus } =
    dispatchStatusSlice.actions;
export const DispatchStatusReducer = dispatchStatusSlice.reducer;
export const { useLazyGetSearchDispatchStatusQuery } =
    DispatchStatusApi;
