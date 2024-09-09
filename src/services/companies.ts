import { createApi } from '@reduxjs/toolkit/query/react';
import { IResponseGetManifestConfirm } from 'models/manifests';
import { ICompany } from 'models/companies';
import customFetchBase from './customFetchBase';

export const CompaniesApi = createApi({
    reducerPath: 'CompaniesApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getCompanies: builder.query<ICompany, { cd: number | string }>({
            query: (params) => ({
                url: `/v1/companies/${params.cd}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useLazyGetCompaniesQuery } = CompaniesApi;
