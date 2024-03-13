
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface HeaderState {
    headerSize: number,
}
const initialState: HeaderState = {
    headerSize: 0,   
}

export const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        handleHeaderSize: (state,action: PayloadAction<number>) => {
            state.headerSize = action.payload;
        },
    },
})
export const {handleHeaderSize} = headerSlice.actions;
export default headerSlice.reducer