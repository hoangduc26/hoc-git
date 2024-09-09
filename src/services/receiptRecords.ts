import { createApi } from '@reduxjs/toolkit/query/react';
import {
    ParamsReceiptRecordDetail,
    ParamsReceiptRecords,
    ParamsScalings,
    ReceiptRecordDetail,
    ReceiptRecords,
    Scalings,
} from 'models';
import { createSlice } from '@reduxjs/toolkit';
import customFetchBase from './customFetchBase';

export const ReceiptRecordsApi = createApi({
    reducerPath: 'ReceiptRecordsApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getScalings: builder.query<Scalings, ParamsScalings>({
            query: (params) => ({
                url: `/v1/receiptrecords/scalings`,
                params,
                method: 'GET',
            }),
        }),
        getReceiptRecords: builder.query<ReceiptRecords, ParamsReceiptRecords>({
            query: (params) => ({
                url: `/v1/receiptrecords/receiptrecords`,
                params,
                method: 'GET',
            }),
        }),
        getReceiptRecordDetail: builder.query<
            ReceiptRecordDetail,
            { orderType: number; slipSystemId: number; params?: ParamsReceiptRecordDetail }
        >({
            query: ({ orderType, slipSystemId, params }) => ({
                url: `/v1/receiptrecords/${orderType}/${slipSystemId}`,
                params,
                method: 'GET',
            }),
        }),
        postReceiptRecords: builder.mutation<
            any,
            { orderType: number; slipSystemId: number; body: any }
        >({
            query: ({ orderType, slipSystemId, body }) => ({
                url: `/v1/receiptrecords/${orderType}/${slipSystemId}`,
                body,
                method: 'POST',
            }),
        }),
        putReceiptRecords: builder.mutation<
            any,
            { orderType: number; slipSystemId: number; seq: number; body: any }
        >({
            query: ({ orderType, slipSystemId, seq, body }) => ({
                url: `/v1/receiptrecords/${orderType}/${slipSystemId}/${seq}`,
                body,
                method: 'PUT',
            }),
        }),

        deleteReceiptRecords: builder.mutation<
            any,
            { orderType: number; slipSystemId: number; seq: number; body: any }
        >({
            query: ({ orderType, slipSystemId, seq, body }) => ({
                url: `/v1/receiptrecords/${orderType}/${slipSystemId}/${seq}`,
                body,
                method: 'DELETE',
            }),
        }),
    }),
});

const initialState: { cacheSearchCondition?: any; cacheSearchConditionScaling?: any } = {
    cacheSearchCondition: null,
    cacheSearchConditionScaling: null,
};

const receiptRecordsSlice = createSlice({
    name: 'receiptRecordsSlice',
    initialState,
    reducers: {
        saveCacheSearchConditionReceiptRecords: (state, action) => {
            state.cacheSearchCondition = action.payload;
        },
        saveCacheSearchConditionWeighingInfos: (state, action) => {
            state.cacheSearchConditionScaling = action.payload;
        },
    },
});

export const { saveCacheSearchConditionReceiptRecords, saveCacheSearchConditionWeighingInfos } =
    receiptRecordsSlice.actions;
export const ReceiptRecordsReducer = receiptRecordsSlice.reducer;
export const {
    useLazyGetScalingsQuery,
    useLazyGetReceiptRecordsQuery,
    useLazyGetReceiptRecordDetailQuery,
    usePostReceiptRecordsMutation,
    usePutReceiptRecordsMutation,
    useDeleteReceiptRecordsMutation,
} = ReceiptRecordsApi;
