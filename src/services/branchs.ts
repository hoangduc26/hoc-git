import { createApi } from '@reduxjs/toolkit/query/react';
import { ParamCollection, Collection } from 'models';
import { IParamsRequestGetBranch, IResponseGetBranchssSuccess } from 'models/branch';
import customFetchBase from './customFetchBase';

export const BranchApi = createApi({
    reducerPath: 'BranchApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getBranchs: builder.query<IResponseGetBranchssSuccess, IParamsRequestGetBranch>({
            query: (params) => ({
                url: `/v1/branchs`,
                method: 'GET',
                params,
            }),
        }),
    }),
});

export const { useGetBranchsQuery, useLazyGetBranchsQuery } = BranchApi;
