
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface AuthState {

    loginOrRegisterModal: boolean,
    loginOrRegisterModalTab: number,
    smsVerificationModal: boolean,
    emailVerificationModal: boolean,
    passwordResetModal: boolean,

}
const initialState: AuthState = {

    loginOrRegisterModal: false,
    loginOrRegisterModalTab: 0,
    smsVerificationModal: false,
    emailVerificationModal: false,
    passwordResetModal: false,


}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        handleLoginOrRegisterModal: (state, action: PayloadAction<boolean>) => {
            state.loginOrRegisterModal = action.payload;
        },
        handleLoginOrRegisterModalTab: (state, action: PayloadAction<number>) => {
            state.loginOrRegisterModalTab = action.payload;
        },
        handleSmsVerificationModal: (state, action: PayloadAction<boolean>) => {
            state.smsVerificationModal = action.payload;
        },
        handleEmailVerificationModal: (state, action: PayloadAction<boolean>) => {
            state.emailVerificationModal = action.payload;
        },
        handlePasswordResetModal: (state, action: PayloadAction<boolean>) => {
            state.passwordResetModal = action.payload;
        },

    },
})
export const { 
    handleLoginOrRegisterModal,
    handleLoginOrRegisterModalTab,
    handleSmsVerificationModal,
    handleEmailVerificationModal,
    handlePasswordResetModal,
} = authSlice.actions;
export default authSlice.reducer