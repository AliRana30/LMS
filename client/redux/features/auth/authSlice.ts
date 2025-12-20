// redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Avatar {
    public_id?: string;
    url: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: Avatar;
    role?: string;
}

interface AuthState {
    access_token: string;
    user: User | null;
}

const initialState: AuthState = {
    access_token: "",
    user: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            state.access_token = action.payload.token;
        },
        userLoggedIn: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.access_token = action.payload.token;
            state.user = action.payload.user;
        },
        userLoggedOut: (state) => {
            state.access_token = "";
            state.user = null;
        }
    }
});

export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;