// redux/features/auth/authApi.ts
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationProcess = {
    message: string;
    activationToken: string;
}

type RegistrationData = {
    email: string;
    password: string;
    name: string;
}

type ActivationRequest = {
    activation_token: string;
    activation_code: string;
}

type ActivationResponse = {
    message: string;
    success: boolean;
}

type LoginRequest = {
    email: string;
    password: string;
}

type LoginResponse = {
    success: boolean;
    message: string;
    accessToken: string;
    user: any;
}

type SocialAuthRequest = {
    email: string;
    name: string;
    avatar: string;
}

type SocialAuthResponse = {
    success: boolean;
    message: string;
    accessToken: string;
    user: any;
}

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegistrationProcess, RegistrationData>({
            query: (userData) => ({
                url: "register",
                method: "POST",
                body: userData,
                credentials: "include" as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userRegistration({
                        token: data.activationToken
                    }));
                } catch (error: any) {
                    console.error("Registration failed:", error);
                }
            }
        }),
        
        activation: builder.mutation<ActivationResponse, ActivationRequest>({
            query: ({ activation_token, activation_code }) => ({
                url: "activate-user",
                method: "POST",
                body: {
                    activation_token,
                    activation_code
                },
                credentials: "include" as const
            })
        }),
        
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: ({ email, password }) => ({
                url: 'login',
                method: 'POST',
                body: { email, password },
                credentials: "include" as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.accessToken && data.user) {
                        dispatch(userLoggedIn({
                            token: data.accessToken,
                            user: data.user
                        }));
                    }
                } catch (error: any) {
                    console.error("Login failed:", error);
                }
            }
        }),
        
        socialAuth: builder.mutation<SocialAuthResponse, SocialAuthRequest>({
            query: ({ email, name, avatar }) => ({
                url: 'social-auth',
                method: 'POST',
                body: { email, name, avatar },
                credentials: "include" as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.accessToken && data.user) {
                        dispatch(userLoggedIn({
                            token: data.accessToken,
                            user: data.user
                        }));
                    }
                } catch (error: any) {
                    console.error("Social auth failed:", error);
                }
            }
        }),
        
        logout: builder.query({
            query: () => ({
                url: 'logout',
                method: 'GET',
                credentials: "include" as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                     await queryFulfilled;
                        dispatch(userLoggedOut());
                } catch (error: any) {
                    console.error(error.message);
                }
            }
        })
        
    })  
});

export const { 
    useRegisterMutation, 
    useActivationMutation, 
    useLoginMutation, 
    useSocialAuthMutation,
    useLogoutQuery
} = authApi;