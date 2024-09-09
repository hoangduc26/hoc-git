import { createApi } from '@reduxjs/toolkit/query/react';
import { IGetPastComplaintSuccess, IParamsRequestGetPastComplaint, IPastComplaint } from 'models/pastComplaint';
import customFetchBase from './customFetchBase';

export const PastComplaintsApi = createApi({
    reducerPath: 'PastComplaintsApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getPastComplaints: builder.query<IGetPastComplaintSuccess, IParamsRequestGetPastComplaint>({
            query: (params) => ({
                url: `/v1/pastcomplaints/paging`,
                params,
                method: 'GET',
            }),
        }),

        getPastComplaintByKey: builder.query<IPastComplaint, { systemId: string | number, seq: string | number }>({
            query: (params) => ({
                url: `/v1/pastcomplaints/${params.systemId}/${params.seq}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useLazyGetPastComplaintsQuery, useLazyGetPastComplaintByKeyQuery } = PastComplaintsApi;
