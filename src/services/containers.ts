import { createApi } from '@reduxjs/toolkit/query/react';
import { Container, ParamsContainer } from 'models';
import customFetchBase from './customFetchBase';

export const ContainersApi = createApi({
    reducerPath: 'ContainersApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getContainersType: builder.query<any, ParamsContainer>({
            query: (params) => ({
                url: `/v1/containers/types`,
                params,
                method: 'GET',
            }),
        }),

        getContainers: builder.query<Container, ParamsContainer>({
            query: (params) => ({
                url: `/v1/containers`,
                params,
                method: 'GET',
            }),
        }),

        getContainerByCd: builder.query<any, { containerTypeCd: string, containerCd: string }>({
            query: ({ containerTypeCd, containerCd }) => ({
                url: `/v1/containers/${containerTypeCd}/${containerCd}`,
                method: 'GET',
            }),
        }),

        getContainerTypeByCd: builder.query<any, { typeCd: string }>({
            query: ({ typeCd }) => ({
                url: `/v1/containers/types/${typeCd}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useLazyGetContainersTypeQuery, useLazyGetContainersQuery, useLazyGetContainerByCdQuery, useLazyGetContainerTypeByCdQuery } = ContainersApi;
