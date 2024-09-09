import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPrinting: false,
};

const PrintSlice = createSlice({
    initialState,
    name: 'PrintSlice',
    reducers: {
        startPrint: (state) => {
            state.isPrinting = true;
        },

        endPrint: (state) => {
            state.isPrinting = false;
        },
    },
});


export const { startPrint, endPrint } = PrintSlice.actions;
export const PrintReducer = PrintSlice.reducer;