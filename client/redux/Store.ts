import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from '../redux/features/api/apiSlice'
import authReducer from "../redux/features/auth/authSlice"

export const Store = configureStore({
    reducer :{
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth : authReducer,
    },
    devTools : false,
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})

const initiliazeApp = async () => {
    // call the refresh token on every app load
    await Store.dispatch(apiSlice.endpoints.refreshToken.initiate({},{forceRefetch : true}));

    // load user on every app load
    await Store.dispatch(apiSlice.endpoints.loadUser.initiate({},{forceRefetch : true}));

}

initiliazeApp()