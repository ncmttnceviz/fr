import { configureStore } from '@reduxjs/toolkit'
import categoryTreeReducer from "@/store/category-tree";
import filterReducer from "@/store/filter";
import locationReducer from "@/store/location";
import authReducer from "@/store/auth";
import infoSnackbarReducer from "@/store/info-snackbar";
import mobileDrawerReducer from "@/store/mobile-drawer";
import headerReducer from "@/store/header";
export const store = configureStore({
  reducer: {
      categoryTree: categoryTreeReducer,
      filter: filterReducer,
      location: locationReducer,
      auth: authReducer,
      infoSnackbar: infoSnackbarReducer,
      mobileDrawer: mobileDrawerReducer,
      header: headerReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector