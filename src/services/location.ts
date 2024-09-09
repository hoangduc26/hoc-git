import { createApi } from '@reduxjs/toolkit/query/react';
import { ILocation, IParamsRequestPostLocation } from 'models/location';
import customFetchBase from './customFetchBase';

export const LocationApi = createApi({
    reducerPath: 'LocationApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        postLocation: builder.mutation<any, IParamsRequestPostLocation>({
            query: (body) => ({
                url: `/v1/locations`,
                method: 'POST',
                body,
            }),
        }),

        getLocation: builder.query<ILocation[], { refDate: string }>({
            query: (params) => ({
                url: '/v1/locations',
                method: 'GET',
                params,
            }),
        }),
    }),
});

export const { usePostLocationMutation, useLazyGetLocationQuery } = LocationApi;
