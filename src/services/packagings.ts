import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';

export const PackagingApi = createApi({
    reducerPath: 'PackagingApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getAllPackagings: builder.query<{ cd: string, name: string }[], void>({
            query: () => ({
                url: `/v1/packagings/allfordenshi`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetAllPackagingsQuery, useLazyGetAllPackagingsQuery } = PackagingApi;
