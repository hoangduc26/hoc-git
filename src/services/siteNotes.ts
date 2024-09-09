import { createApi } from '@reduxjs/toolkit/query/react';
import {
    Company,
    Customer,
    Employees,
    ParamsSearch,
    ParamsSiteNotes,
    SiteNotes,
    SiteNotesInformation,
    Sites,
    Sources,
    Titles,
    Types,
} from 'models';
import { createSlice } from '@reduxjs/toolkit';
import customFetchBase from './customFetchBase';

export const SiteNotesApi = createApi({
    reducerPath: 'SiteNotesApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getCustomer: builder.query<Customer, ParamsSearch>({
            query: (params) => ({
                url: `/v1/sitenotes/customers`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: Customer) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.customerCd,
                        name: itm.customerName,
                    })),
                } as Customer),
        }),

        getCompany: builder.query<Company, ParamsSearch>({
            query: (params) => ({
                url: `/v1/sitenotes/companies`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: Company) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.companyCd,
                        name: itm.companyName,
                    })),
                } as Company),
        }),

        getSites: builder.query<Sites, ParamsSearch>({
            query: (params) => ({
                url: `/v1/sitenotes/sites`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: Sites) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.siteCd,
                        name: itm.siteName,
                    })),
                } as Sites),
        }),

        getTypes: builder.query<Types, ParamsSearch>({
            query: (params) => ({
                url: `/v1/sitenotes/types`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: Types) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.cd,
                        name: itm.name,
                    })),
                } as Types),
        }),

        getEmployees: builder.query<Employees, ParamsSearch>({
            query: (params) => ({
                url: `/v1/sitenotes/employees`,
                params,
                method: 'GET',
            }),
        }),

        getTitles: builder.query<Titles, ParamsSearch>({
            query: (params) => ({
                url: `/v1/sitenotes/titles`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: Titles) =>
                ({
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.cd,
                    })),
                } as Titles),
        }),

        getSources: builder.query<Sources[], void>({
            query: () => ({
                url: `/v1/sitenotes/sources`,
                method: 'GET',
            }),
        }),

        postSearch: builder.query<SiteNotes, ParamsSiteNotes>({
            query: ({ params, ...body }) => ({
                url: '/v1/sitenotes/search',
                params,
                body,
                method: 'POST',
            }),
        }),

        postSiteNotes: builder.mutation<any, { body: any }>({
            query: ({ body }) => ({
                url: `/v1/sitenotes`,
                body,
                method: 'POST',
            }),
        }),

        deleteSiteNotes: builder.mutation<any, { systemId: number; seq: number; body: any }>({
            query: ({ systemId, seq, body }) => ({
                url: `/v1/sitenotes/${systemId}/${seq}`,
                body,
                method: 'DELETE',
            }),
        }),

        getSiteNotes: builder.query<SiteNotesInformation, { systemId: number }>({
            query: (params) => ({
                url: `/v1/sitenotes/${params.systemId}`,
                method: 'GET',
            }),
        }),

        putSiteNotes: builder.mutation<any, { systemId: number; seq: number; body: any }>({
            query: ({ systemId, seq, body }) => ({
                url: `/v1/sitenotes/${systemId}/${seq}`,
                body,
                method: 'PUT',
            }),
        }),

        putCommentSiteNotes: builder.mutation<any, { systemId: number; seq: number; body: any }>({
            query: ({ systemId, seq, body }) => ({
                url: `/v1/sitenotes/${systemId}/${seq}/comment`,
                body,
                method: 'PUT',
            }),
        }),
    }),
});

const initialState: { siteNotes?: any } = {
    siteNotes: null,
};

const siteNotesSlice = createSlice({
    name: 'siteNotesSlice',
    initialState,
    reducers: {
        saveSiteNotes: (state, action) => {
            state.siteNotes = action.payload;
        },

        cleanSiteNotes: (state) => {
            state.siteNotes = null;
        },
    },
});

export const { saveSiteNotes, cleanSiteNotes } = siteNotesSlice.actions;
export const SiteNotesReducer = siteNotesSlice.reducer;
export const {
    useLazyGetCustomerQuery,
    useLazyGetCompanyQuery,
    useLazyGetSitesQuery,
    useLazyGetTypesQuery,
    useLazyGetEmployeesQuery,
    useLazyGetTitlesQuery,
    useLazyGetSourcesQuery,
    useLazyPostSearchQuery,
    useDeleteSiteNotesMutation,
    usePostSiteNotesMutation,
    useLazyGetSiteNotesQuery,
    usePutSiteNotesMutation,
    usePutCommentSiteNotesMutation,
} = SiteNotesApi;
