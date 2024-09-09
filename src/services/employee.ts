import { createApi } from '@reduxjs/toolkit/query/react';
import { IParamsRequestGetDrivers, IResponseGetDriverssSuccess } from 'models/driver';
import { IParamsRequestGetSalePerson, IResponseGetSalePersonssSuccess } from 'models/salePerson';
import { IParamsRequestGetWorkers, IResponseGetWorkersSuccess } from 'models/worker';
import customFetchBase from './customFetchBase';

export const EmployeeApi = createApi({
    reducerPath: 'EmployeeApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getSalePersons: builder.query<IResponseGetSalePersonssSuccess, IParamsRequestGetSalePerson>(
            {
                query: (params) => ({
                    url: `/v1/employees/salespersons`,
                    method: 'GET',
                    params,
                }),
            },
        ),

        getDrivers: builder.query<IResponseGetDriverssSuccess, IParamsRequestGetDrivers>({
            query: (params) => ({
                url: `/v1/employees/drivers`,
                method: 'GET',
                params,
            }),
        }),

        getWorkers: builder.query<IResponseGetWorkersSuccess, IParamsRequestGetWorkers>({
            query: (params) => ({
                url: `/v1/employees/workers`,
                method: 'GET',
                params,
            }),
        }),
    }),
});

export const {
    useGetDriversQuery,
    useLazyGetDriversQuery,
    useGetSalePersonsQuery,
    useLazyGetSalePersonsQuery,
    useLazyGetWorkersQuery,
} = EmployeeApi;
