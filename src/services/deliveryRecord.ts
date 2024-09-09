import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    IAddDeliveryRecord,
    IDeleteDeliveryRecord,
    IDeliveryRecord,
    IDeliveryRecordCollectionSite,
    IParamsRequestGetDVCollectionSites,
    IParamsRequestGetDeliveryRecord,
    IParamsRequestGetDeliveryRecordById,
    IResponseGetDeliveryRecordssSuccess,
    IUpdateDeliveryRecord,
} from 'models/deliveryRecord';
import customFetchBase from './customFetchBase';

export const DeliveryRecordApi = createApi({
    reducerPath: 'DeliveryRecordApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getDeliveryRecords: builder.query<
            IResponseGetDeliveryRecordssSuccess,
            IParamsRequestGetDeliveryRecord
        >({
            query: (params) => ({
                url: `/v1/deliveryrecords/paging`,
                method: 'GET',
                params,
            }),
        }),

        getDeliveryRecordsById: builder.query<IDeliveryRecord, IParamsRequestGetDeliveryRecordById>(
            {
                query: (params) => ({
                    url: `/v1/deliveryrecords/${params.id}`,
                    method: 'GET',
                    params,
                }),
            },
        ),

        addDeliveryRecord: builder.mutation<any, IAddDeliveryRecord>({
            query: (body) => ({
                url: `/v1/deliveryrecords`,
                method: 'POST',
                body,
            }),
        }),

        updateDeliveryRecord: builder.mutation<any, { id: number; body: IUpdateDeliveryRecord }>({
            query: (params) => ({
                url: `/v1/deliveryrecords/${params.id}`,
                method: 'PUT',
                body: params.body,
            }),
        }),

        deleteDeliveryRecord: builder.mutation<any, { id: number, body: IDeleteDeliveryRecord }>({
            query: (params) => ({
                url: `/v1/deliveryrecords/${params.id}`,
                method: 'DELETE',
                body: params.body,
            }),
        }),

        getDeliveryRecordCollectionSites: builder.query<
            IDeliveryRecordCollectionSite[],
            IParamsRequestGetDVCollectionSites
        >({
            query: (params) => ({
                url: `/v1/deliveryrecords/collectionsites`,
                method: 'GET',
                params,
            }),
        }),
    }),
});

const initialState = {
};

const deliveryRecordSlice = createSlice({
    name: 'deliveryRecordSlice',
    initialState,
    reducers: {
    },
});

export const {
    useLazyGetDeliveryRecordsQuery,
    useLazyGetDeliveryRecordsByIdQuery,
    useLazyGetDeliveryRecordCollectionSitesQuery,
    useAddDeliveryRecordMutation,
    useUpdateDeliveryRecordMutation,
    useDeleteDeliveryRecordMutation,
} = DeliveryRecordApi;

export const deliveryRecordReducer = deliveryRecordSlice.reducer;
