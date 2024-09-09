import { createApi } from '@reduxjs/toolkit/query/react';
import { IResponseGetManifestConfirm } from 'models/manifests';
import customFetchBase from './customFetchBase';

export const ManifestApi = createApi({
    reducerPath: 'ManifestApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getManifestConfirmInformation: builder.query<IResponseGetManifestConfirm, { maniPatternSystemId: number | string }>({
            query: (params) => ({
                url: `/v1/manifests/manifestconfirm/${params.maniPatternSystemId}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetManifestConfirmInformationQuery, useLazyGetManifestConfirmInformationQuery } = ManifestApi;
