import { createSlice } from '@reduxjs/toolkit';
import { IVehicle } from 'models/vehicle';
import { CONSTANT_ROUTE } from 'utils/constants';

const initialState: { urlPreviousPage: any } = {
    urlPreviousPage: {},
};

const pageSlice = createSlice({
    name: 'pageSlice',
    initialState,
    reducers: {
        setPreviousPage: (
            state,
            action: { payload: { previousUrlOfPage: string; previousUrl: string }; type: any },
        ) => {
            state.urlPreviousPage[action.payload.previousUrlOfPage] = action.payload.previousUrl;
        },
    },
});

export const { setPreviousPage } = pageSlice.actions;
// export const { useGetVehiclesQuery, useLazyGetVehicleTypesQuery } = VehicleApi;
export const PageReducer = pageSlice.reducer;
