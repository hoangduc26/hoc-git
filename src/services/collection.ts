import { createApi } from '@reduxjs/toolkit/query/react';
import {
    CollectSummary,
    ICollectionPrint,
    Collection,
    ParamCollection,
    ParamsCollectSummary,
    ResCollectionBySeqNo,
    ICollectionBySeqNo,
    IBodyRequestDenshimanifest,
    IResponseGetCollectionProductConfirm,
    IResponseGetCollectionssSuccess,
    IParamsRequestCollections,
} from 'models';
import {
    IResponseGetCoursesSuccess,
    IParamsRequestCollectionCourses,
    IParamsRequestCollectionCoursesByCd,
} from 'models/course';
import { IResponseGetSpotsSuccess, IParamsRequestCollectionSpots } from 'models/spot';
import { createSlice } from '@reduxjs/toolkit';
import customFetchBase from './customFetchBase';

export const CollectionApi = createApi({
    reducerPath: 'CollectionApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getCollectionSummary: builder.query<CollectSummary, ParamsCollectSummary>({
            query: (params) => ({
                url: `/v1/collections/summary`,
                params,
                method: 'GET',
            }),
        }),

        getCollectionBySeqNo: builder.query<ICollectionBySeqNo, { seqNo: number }>({
            query: ({ seqNo }) => ({
                url: `/v1/collections/${seqNo}`,
                method: 'GET',
            }),
        }),

        updateCollectionBySeqNo: builder.mutation<any, { seqNo: number; body: any, isExportPdf: boolean }>({
            query: ({ seqNo, body, isExportPdf }) => ({
                url: `/v1/collections/${seqNo}/quantity`,
                body,
                method: 'PUT',
                params: { isExportPdf },
            }),
        }),

        getCollectionSpots: builder.query<IResponseGetSpotsSuccess, IParamsRequestCollectionSpots>({
            query: (params: IParamsRequestCollectionSpots) => ({
                url: '/v1/collections/spots',
                params,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getCollections: builder.query<IResponseGetCollectionssSuccess, IParamsRequestCollections>({
            query: (params: IParamsRequestCollections) => ({
                url: '/v1/collections',
                params,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getSignatureCollection: builder.query<any, { seqNo: number }>({
            query: ({ seqNo }) => ({
                url: `/v1/collections/${seqNo}/signature`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
        }),

        getCollectionCourses: builder.query<
            IResponseGetCoursesSuccess,
            IParamsRequestCollectionCourses
        >({
            query: (params: IParamsRequestCollectionCourses) => ({
                url: '/v1/collections/courses',
                params,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getCollectionCoursesByCd: builder.query<
            IResponseGetCoursesSuccess,
            IParamsRequestCollectionCoursesByCd
        >({
            query: (params: IParamsRequestCollectionCoursesByCd) => ({
                url: `/v1/collections/courses/${params.courseNameCd}`,
                params,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getInfoCollection: builder.query<Collection, ParamCollection>({
            query: ({ seqNo }) => ({
                url: `/v1/collections/${seqNo}/info`,
                method: 'GET',
            }),
        }),

        updateExclusionStatusBySeqNo: builder.mutation<any, { seqNo: number; body: any }>({
            query: ({ seqNo, body }) => ({
                url: `/v1/collections/${seqNo}/exclusionstatus`,
                body,
                method: 'PUT',
            }),
        }),

        getCollectionContainer: builder.query<any, { seqNo: number }>({
            query: ({ seqNo }) => ({
                url: `/v1/collections/${seqNo}/containers`,
                method: 'GET',
            }),
        }),

        getCollectionPrintInfo: builder.query<ICollectionPrint, { seqNo: string | number }>({
            query: ({ seqNo }) => ({
                url: `/v1/collections/${seqNo}/printinfo`,
                method: 'GET',
            }),
        }),
        getContainersByContainerSeqNo: builder.query<
            any,
            { seqNo: number; containerSeqNo: number; recordNo: number }
        >({
            query: (params) => ({
                url: `/v1/collections/${params.seqNo}/containers/${params.containerSeqNo}/${params.recordNo}`,
                method: 'GET',
            }),
        }),

        postContainers: builder.mutation<any, { seqNo: number; body: any }>({
            query: ({ seqNo, body }) => ({
                url: `/v1/collections/${seqNo}/containers`,
                body,
                method: 'POST',
            }),
        }),

        putContainers: builder.mutation<
            any,
            { seqNo: number; containerSeqNo: number; recordNo: number; body: any }
        >({
            query: ({ seqNo, containerSeqNo, recordNo, body }) => ({
                url: `/v1/collections/${seqNo}/containers/${containerSeqNo}/${recordNo}`,
                body,
                method: 'PUT',
            }),
        }),

        getCollectionProductConfirm: builder.query<IResponseGetCollectionProductConfirm, { seqNo: string | number }>({
            query: ({ seqNo }) => ({
                url: `/v1/collections/${seqNo}/collectionproductconfirm`,
                method: 'GET',
            }),
        }),

        postDenshimanifest: builder.mutation<any, { seqNo: string | number; body: IBodyRequestDenshimanifest }>({
            query: ({ seqNo, body }) => ({
                url: `/v1/collections/${seqNo}/denshimanifest`,
                body,
                method: 'POST',
            }),
        }),

    }),
});

const collectionSlice = createSlice({
    name: 'collectionSlice',
    initialState: {
        filter: {
            searchConditions: null,
            isDisplayUnregisteredContainer: true,
        },

        collectedQuantityInput: {
            seqNo: null,
            time: null,
            formState: null,
            listCollectionState: null,
            isCreateNew: false,
            isEdit: false,
            selectedCollection: null,
            collectionDate: null,
        },
    },
    reducers: {
        setIsDisplayUnregisteredContainer: (state, action) => {
            state.filter = {
                ...state.filter,
                isDisplayUnregisteredContainer: action.payload,
            };
        },

        setSearchConditions: (state, action) => {
            state.filter = {
                ...state.filter,
                searchConditions: action.payload,
            };
        },

        clearSearchConditions: (state) => {
            state.filter = {
                ...state.filter,
                searchConditions: null,
            };
        },

        setCacheCollectedQuantityInput: (state, action) => {
            state.collectedQuantityInput = action.payload;
        },

        clearCacheCollectedQuantityInput: (state) => {
            state.collectedQuantityInput = {
                seqNo: null,
                time: null,
                formState: null,
                listCollectionState: null,
                isCreateNew: false,
                isEdit: false,
                selectedCollection: null,
                collectionDate: null,
            };
        },
    },
});

export const {
    setSearchConditions,
    clearSearchConditions,
    setIsDisplayUnregisteredContainer,
    setCacheCollectedQuantityInput,
    clearCacheCollectedQuantityInput,
} = collectionSlice.actions;
export const CollectionReducer = collectionSlice.reducer;

export const {
    useLazyGetCollectionSummaryQuery,
    useGetCollectionBySeqNoQuery,
    useLazyGetCollectionBySeqNoQuery,
    useUpdateCollectionBySeqNoMutation,
    useLazyGetCollectionSpotsQuery,
    useLazyGetCollectionCoursesQuery,
    useLazyGetCollectionCoursesByCdQuery,
    useLazyGetInfoCollectionQuery,
    useUpdateExclusionStatusBySeqNoMutation,
    useGetCollectionContainerQuery,
    useLazyGetCollectionPrintInfoQuery,
    useLazyGetContainersByContainerSeqNoQuery,
    usePostContainersMutation,
    usePutContainersMutation,
    usePostDenshimanifestMutation,
    useLazyGetCollectionProductConfirmQuery,
    useLazyGetCollectionContainerQuery, useLazyGetCollectionsQuery, useLazyGetSignatureCollectionQuery,
} = CollectionApi;
