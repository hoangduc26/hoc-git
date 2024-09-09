import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { SitesInformation } from 'models';
import { IParamsGetSiteByKey, IParamsGetSitesUnloadings } from 'models/site';
import { IResponseGetDVUnloadingSitesSuccess } from 'models/deliveryRecord';
import customFetchBase from './customFetchBase';

export const SitesApi = createApi({
    reducerPath: 'SitesApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getSiteByKey: builder.query<SitesInformation, IParamsGetSiteByKey>({
            query: (params) => ({
                url: `/v1/sites/siteinfobycollectionseqno/${params.seqNo}`,
                method: 'GET',
            }),
        }),

        getSitesByCompany: builder.query<SitesInformation, { companyCd: string; siteCd: string }>({
            query: (params) => ({
                url: `/v1/sites/${params.companyCd}/${params.siteCd}`,
                method: 'GET',
            }),
        }),

        getSitesUnloadings: builder.query<
            IResponseGetDVUnloadingSitesSuccess,
            IParamsGetSitesUnloadings
        >({
            query: (params) => ({
                url: `/v1/sites/unloadings`,
                method: 'GET',
                params,
            }),
        }),
    }),
});

const initialState = {};

const siteSlice = createSlice({
    name: 'siteSlice',
    initialState,
    reducers: {},
});

export const {
    useLazyGetSiteByKeyQuery,
    useLazyGetSitesByCompanyQuery,
    useLazyGetSitesUnloadingsQuery,
} = SitesApi;
