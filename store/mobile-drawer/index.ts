
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface MobileDrawerState {
    mobileDrawer: boolean,
}
const initialState: MobileDrawerState = {
    mobileDrawer: false,   
}

export const mobileDrawerSlice = createSlice({
    name: 'mobileDrawer',
    initialState,
    reducers: {
        handleMobileDrawer: (state,action: PayloadAction<boolean>) => {
            state.mobileDrawer = action.payload;
        },
    },
})
export const {handleMobileDrawer} = mobileDrawerSlice.actions;
export default mobileDrawerSlice.reducer