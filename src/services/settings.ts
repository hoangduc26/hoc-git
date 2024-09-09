import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';

export const SettingsApi = createApi({
    reducerPath: 'SettingsApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getQuantityFormat: builder.query<string, void>({
            query: () => ({
                url: `/v1/settings/quantityformat`,
                method: 'GET',
            }),
        }),

        getSizeUpload: builder.query<any, void>({
            query: () => ({
                url: `/v1/settings/maxsizeupload`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetQuantityFormatQuery, useGetSizeUploadQuery, useLazyGetSizeUploadQuery } =
    SettingsApi;
