import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';

export const FileApi = createApi({
    reducerPath: 'FileApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getFile: builder.query<any, { fileId: number }>({
            query: ({ fileId }) => ({
                url: `/v1/files/${fileId}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const { useLazyGetFileQuery } = FileApi;
