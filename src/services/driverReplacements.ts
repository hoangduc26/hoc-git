import { createApi } from '@reduxjs/toolkit/query/react';
import { ILocation, IParamsRequestPostLocation } from 'models/location';
import { IDriverReplacementSSpot, IDriverReplacementsCourse, IDriverReplacementsCoursesRegister, IDriverReplacementsSpotsRegister, IParamsGetCourseOfDay, IParamsGetDriverReplacementCoursesByDriverCd, IParamsGetDriverReplacementsDrivers, IParamsGetDriverReplacementsSpotsByDriverCd, IResponseGetCourseOfDay, IResponseGetDriverReplacementsDrivers } from 'models/driverReplacements';
import customFetchBase from './customFetchBase';

export const DriverReplacementsApi = createApi({
    reducerPath: 'DriverReplacementsApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getDriverReplacementsDrivers: builder.query<IResponseGetDriverReplacementsDrivers, IParamsGetDriverReplacementsDrivers>({
            query: (params) => ({
                url: '/v1/driverreplacements/drivers',
                method: 'GET',
                params,
            }),
        }),

        getDriverReplacementsSpotsByDriverCd: builder.query<IDriverReplacementSSpot[], IParamsGetDriverReplacementsSpotsByDriverCd>({
            query: (params) => ({
                url: `/v1/driverreplacements/spots/${params.driverCd}`,
                method: 'GET',
                params,
            }),
        }),

        postDriverReplacementsSpotsRegister: builder.mutation<any, IDriverReplacementsSpotsRegister>({
            query: (body) => ({
                url: `/v1/driverreplacements/spots/register`,
                method: 'POST',
                body,
            }),
        }),

        getCourseOfDay: builder.query<IResponseGetCourseOfDay, IParamsGetCourseOfDay>({
            query: (params) => ({
                url: `/v1/driverreplacements/courses/${params.driverCd}/coursesofday`,
                method: 'GET',
                params,
            }),
        }),

        getDriverReplacementsCoursesByDriverCd: builder.query<IDriverReplacementsCourse[], IParamsGetDriverReplacementCoursesByDriverCd>({
            query: (params) => ({
                url: `/v1/driverreplacements/courses/${params.driverCd}`,
                method: 'GET',
                params,
            }),
        }),

        postDriverReplacementsCoursesRegister: builder.mutation<any, IDriverReplacementsCoursesRegister>({
            query: (body) => ({
                url: `/v1/driverreplacements/courses/register`,
                method: 'POST',
                body,
            }),
        }),

    }),
});

export const { useLazyGetDriverReplacementsDriversQuery,
    useLazyGetDriverReplacementsSpotsByDriverCdQuery,
    usePostDriverReplacementsSpotsRegisterMutation,
    useLazyGetCourseOfDayQuery,
    useLazyGetDriverReplacementsCoursesByDriverCdQuery, usePostDriverReplacementsCoursesRegisterMutation } = DriverReplacementsApi;
