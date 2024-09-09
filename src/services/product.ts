import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    IParamsGetProductByType,
    IResponseGetProductTypes,
    IResponseGetProducts,
    UnitsResponse,
} from 'models';
import customFetchBase from './customFetchBase';

export const ProductsApi = createApi({
    reducerPath: 'ProductsApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getProducts: builder.query<
            IResponseGetProducts,
            { search: string; page: number; size: number }
        >({
            query: (params) => ({
                url: `/v1/products`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: IResponseGetProducts) =>
            ({
                ...res,
                items: res?.items?.map((item) => ({
                    ...item,
                    key: item.productCd,
                    name: item.productName,
                })),
            } as IResponseGetProducts),
        }),

        getProductsByType: builder.query<IResponseGetProducts, IParamsGetProductByType>({
            query: (params) => ({
                url: `/v1/products/selects`,
                method: 'GET',
                params,
            }),
        }),

        getUnits: builder.query<UnitsResponse[], void>({
            query: (params) => ({
                url: `/v1/units`,
                method: 'GET',
            }),
        }),

        getTypeProducts: builder.query<
            IResponseGetProductTypes,
            { SearchText: string; PageNumber: number; PageSize: number }
        >({
            query: (params) => ({
                url: `/v1/producttypes`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: IResponseGetProductTypes) => {
                const a = 'a';
                return {
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.cd,
                        name: itm.name,
                    })),
                } as IResponseGetProductTypes;
            },
        }),

        getProductsWithType: builder.query<
            IResponseGetProducts,
            { productTypeCd: string; SearchText: string; PageNumber: number; PageSize: number }
        >({
            query: (params) => ({
                url: `/v1/producttypes/products`,
                params,
                method: 'GET',
            }),
            transformResponse: (res: IResponseGetProducts) => {
                const a = 'a';
                return {
                    ...res,
                    items: res?.items?.map((itm) => ({
                        ...itm,
                        key: itm.productCd,
                        name: itm.productName,
                    })),
                } as IResponseGetProducts;
            },
        }),
    }),
});

const initialState = {
    cacheSearchProduct: {
        search: '',
        page: 1,
        size: 10,
        products: [],
    },
};

const productSlice = createSlice({
    name: 'productSlice',
    initialState,
    reducers: {
        saveCacheSearchProduct: (state, action) => { },

        clearCacheSearchProduct: (state) => { },
    },
});

export const {
    useLazyGetProductsQuery,
    useLazyGetUnitsQuery,
    useLazyGetProductsByTypeQuery,
    useGetUnitsQuery,
    useLazyGetTypeProductsQuery,
    useLazyGetProductsWithTypeQuery,
} = ProductsApi;
export const { saveCacheSearchProduct, clearCacheSearchProduct } = productSlice.actions;
export const ProductReducer = productSlice.reducer;
