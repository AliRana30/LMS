// redux/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        // Ensure cookies are always sent with requests
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    
    // If we get a 401 error, try to refresh the token
    if (result.error && result.error.status === 401) {
        console.log('Attempting to refresh token...');
        
        // Try to refresh the token
        const refreshResult = await baseQuery(
            {
                url: 'refresh-token',
                method: 'GET',
                credentials: 'include',
            },
            api,
            extraOptions
        );
        
        if (refreshResult.data) {
            // Retry the original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Refresh failed, log out the user
            api.dispatch(userLoggedOut());
        }
    }
    
    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
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