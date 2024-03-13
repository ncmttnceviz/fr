
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface InfoSnackbarState {
  
    open: boolean,
    severity: "error"|"warning"|"info"|"success",
    message: string
   
}
const initialState: InfoSnackbarState = {
    open: false,
    severity: "info",
    message: "",
}

export const infoSnackbarSlice = createSlice({
    name: 'infoSnackbar',
    initialState,
    reducers: {
       
        openInfoSnackbar: (state,action: PayloadAction<{severity: "error"|"warning"|"info"|"success",message: string}>) => {
            state.message = action.payload.message;
            state.severity = action.payload.severity;
            state.open = true;
        },
        closeInfoSnackbar: (state) => {
            state.open = false;
            state.severity = "info";
            state.message = "";
        },
        
    },
})
export const {openInfoSnackbar,closeInfoSnackbar} = infoSnackbarSlice.actions;
export default infoSnackbarSlice.reducer