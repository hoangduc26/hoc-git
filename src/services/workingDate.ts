import { createSlice } from '@reduxjs/toolkit';

const initialState: { workingDate?: any } = {
    workingDate: null,
};

const workingDateSlice = createSlice({
    name: 'workingDateSlice',
    initialState,
    reducers: {
        saveWorkingDate: (state, action) => {
            state.workingDate = action.payload;
        },

        cleanWorkingDate: (state) => {
            state.workingDate = null;
        },
    },
});

export const { saveWorkingDate, cleanWorkingDate } = workingDateSlice.actions;
export const WorkingDateReducer = workingDateSlice.reducer;
