import { createApi } from '@reduxjs/toolkit/query/react';
import {
    CollectSummary,
    ParamsCollectSummary,
    ParamsOperationStatus,
    ResCollectionBySeqNo,
    ResOperationStatus,
} from 'models';
import customFetchBase from './customFetchBase';

export const OperationStatusApi = createApi({
    reducerPath: 'OperationStatusApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getMapBoxInfo: builder.query<any, void>({
            query: () => ({
                url: `/v1/settings/mapboxinfo`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetMapBoxInfoQuery,
    // useGetMapboxDataByDateQuery,
    // useUpdateCollectionBySeqNoMutation,
} = OperationStatusApi;
