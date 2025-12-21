// redux/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ,
        credentials: 'include',
    }),
    tagTypes: ['User', 'Auth', 'loadUser'],
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: () => ({
                url: 'refresh-token',   
                method: 'GET',
                credentials: 'include' as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.accessToken && data?.user) {
                        dispatch(userLoggedIn({
                            token: data.accessToken,
                            user: data.user
                        }));
                    }
                } catch (error: any) {
                    console.log("No refresh token available");
                }
            }
        }),
        loadUser: builder.query({
            query: () => ({
                url: 'me',
                method: 'GET',
                credentials: 'include' as const,
            }),
            providesTags: ['loadUser'],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.user) {
                        dispatch(userLoggedIn({
                            token: data.accessToken || "",
                            user: data.user
                        }));
                    }
                } catch (error: any) {
                    console.log("User not authenticated");
                }
            }
        }),
        logOut : builder.query({
            query: () => ({
                url: 'logout',
                method: 'GET',
                credentials: 'include' as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log("Logout failed");
                }
            }
        }),
    })
});

export const { useRefreshTokenQuery, useLoadUserQuery, useLogOutQuery } = apiSlice;