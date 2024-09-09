import { createApi } from '@reduxjs/toolkit/query/react';
import { CompaniesContract, SitesContract } from 'models/contracts';
import { createSlice } from '@reduxjs/toolkit';
import customFetchBase from './customFetchBase';

export const ContractsApi = createApi({
    reducerPath: 'ContractsApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getCompanies: builder.query<
            CompaniesContract,
            { SearchText: string; PageNumber: number; PageSize: number }
        >({
            query: (params) => ({
                url: `/v1/contracts/companies`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: CompaniesContract) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.cd,
                        name: itm.name,
                    })),
                } as CompaniesContract),
        }),
        getSites: builder.query<
            SitesContract,
            { SearchText: string; PageNumber: number; PageSize: number; SearchType: number }
        >({
            query: (params) => ({
                url: `/v1/contracts/sites`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: SitesContract) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.siteCd,
                        name: itm.siteName,
                    })),
                } as SitesContract),
        }),
        getProducts: builder.query<
            SitesContract,
            { SearchText: string; PageNumber: number; PageSize: number; SearchType: number }
        >({
            query: (params) => ({
                url: `/v1/contracts/products`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: SitesContract) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.cd,
                        name: itm.name,
                    })),
                } as SitesContract),
        }),
        getReportClassifications: builder.query<
            SitesContract,
            { SearchText: string; PageNumber: number; PageSize: number; SearchType: number }
        >({
            query: (params) => ({
                url: `/v1/contracts/reportclassifications`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: SitesContract) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.cd,
                        name: itm.name,
                    })),
                } as SitesContract),
        }),

        getSubmit: builder.query<
            any,
            { SearchText: string; PageNumber: number; PageSize: number; SearchType: number }
        >({
            query: (params) => ({
                url: `/v1/contracts/contracts`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: any) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.cd,
                        name: itm.name,
                    })),
                } as any),
        }),

        getDetailContract: builder.query<any, { systemId: string }>({
            query: (params) => ({
                url: `/v1/contracts/${params.systemId}`,
                method: 'GET',
            }),
        }),
    }),
});

const initialState: { contracts?: any } = {
    contracts: null,
};

const contractsSlice = createSlice({
    name: 'contractsSlice',
    initialState,
    reducers: {
        saveContracts: (state, action) => {
            state.contracts = action.payload;
        },

        cleanContracts: (state) => {
            state.contracts = null;
        },
    },
});

export const { saveContracts, cleanContracts } = contractsSlice.actions;
export const ContractsReducer = contractsSlice.reducer;

export const {
    useLazyGetCompaniesQuery,
    useLazyGetSitesQuery,
    useLazyGetProductsQuery,
    useLazyGetReportClassificationsQuery,
    useLazyGetSubmitQuery,
    useGetDetailContractQuery,
    useLazyGetDetailContractQuery,
} = ContractsApi;
