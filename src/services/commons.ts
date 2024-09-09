import { createApi } from '@reduxjs/toolkit/query/react';
import { IResponseGetManifestConfirm } from 'models/manifests';
import { DropdownResponse } from 'models/dispatchStatus';
import customFetchBase from './customFetchBase';

export const CommonsApi = createApi({
    reducerPath: 'CommonsApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        checkIllegalCharacterForJWNet: builder.query<IResponseGetManifestConfirm, { value: string }>({
            query: ({ value }) => ({
                url: `/v1/commons/CheckIllegalCharacterForJWNet/${value}`,
                method: 'GET',
            }),
        }),
        getSortOrder: builder.query<DropdownResponse[], void>({
            query: () => ({
                url: `/v1/commons/sortorder`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useLazyCheckIllegalCharacterForJWNetQuery, useLazyGetSortOrderQuery } = CommonsApi;
