import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { createSlice } from '@reduxjs/toolkit';
import {
    IParamsRequestGetVehicle,
    IParamsRequestGetVehicleType,
    IResponseGetVehicleTypessSuccess,
    IVehicle,
    IVehicleType,
} from 'models/vehicle';
import { LOCAL_STORAGE } from 'utils/constants';
import customFetchBase from './customFetchBase';

export const VehicleApi = createApi({
    reducerPath: 'VehicleApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getVehicles: builder.query<IVehicle[], IParamsRequestGetVehicle>({
            query: (params: IParamsRequestGetVehicle) => ({
                url: '/v1/vehicles',
                params,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getVehicleTypes: builder.query<
            IResponseGetVehicleTypessSuccess,
            IParamsRequestGetVehicleType
        >({
            query: (params) => ({
                url: '/v1/vehicles/types',
                params,
                method: 'GET',
                credentials: 'include',
            }),
        }),
    }),
});

const cacheVehicleSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE.KEY_VEHICLE)) || null;

const initialState: { selectedVehicle: IVehicle | null } = {
    selectedVehicle: cacheVehicleSelected,
};

const vehicleSlice = createSlice({
    name: 'vehicleSlice',
    initialState,
    reducers: {
        saveVehicle: (state, action) => {
            state.selectedVehicle = action.payload;
            localStorage.setItem(LOCAL_STORAGE.KEY_VEHICLE, JSON.stringify(action.payload));
        },

        clearVehicle: (state) => {
            state.selectedVehicle = null;
            localStorage.removeItem(LOCAL_STORAGE.KEY_VEHICLE);
        },
    },
});

export const { saveVehicle, clearVehicle } = vehicleSlice.actions;
export const { useGetVehiclesQuery, useLazyGetVehicleTypesQuery } = VehicleApi;
export const VehicleReducer = vehicleSlice.reducer;
