import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { IUserLogin, IRefreshToken } from 'models';
import { CONSTANT_ROUTE, LOCAL_STORAGE } from 'utils/constants';
import customFetchBase from './customFetchBase';

export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        postLogin: builder.mutation<
            IUserLogin,
            { username: string; password: string; rememberLogin: boolean }
        >({
            query: (body: any) => ({
                url: '/v1/authen',
                body,
                method: 'POST',
                credentials: 'include',
            }),
        }),

        postRefresh: builder.mutation<IRefreshToken, { accessToken: string; refreshToken: string }>(
            {
                query: (body: any) => ({
                    url: '/v1/authen/refresh',
                    body,
                    method: 'POST',
                    credentials: 'include',
                }),
            },
        ),

        getStatusAuth: builder.query<any, void>({
            query: () => ({
                url: `/v1/authen/status`,
                method: 'GET',
            }),
        }),

        postSettingAuth: builder.mutation<any, { param: string }>({
            query: (body: any) => ({
                url: '/v1/authen/setting/access',
                body: body?.param || '',
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
    }),
});

export const {
    usePostLoginMutation,
    useGetStatusAuthQuery,
    usePostSettingAuthMutation,
    useLazyGetStatusAuthQuery,
} = AuthApi;

const initialState: { user?: IUserLogin | any; isLoggedIn: boolean; tokenStatus: boolean } = {
    user: {},
    isLoggedIn: false,
    tokenStatus: true,
};

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        logIn: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            state.isLoggedIn = true;
            localStorage.setItem(LOCAL_STORAGE.KEY_ACCESS_TOKEN, action.payload?.accessToken);
            localStorage.setItem(LOCAL_STORAGE.KEY_REFRESH_TOKEN, action.payload?.refreshToken);
        },
        logOut: (state) => {
            localStorage.removeItem(LOCAL_STORAGE.KEY_ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE.KEY_REFRESH_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE.KEY_PERSIST_ROOT);
            window.location.href = `/${CONSTANT_ROUTE.LOGIN}`;
        },
        tokenStatus: (state, action) => {
            state.tokenStatus = action.payload;
        },
    },
});

export const { logIn, logOut, tokenStatus } = userSlice.actions;
export default userSlice.reducer;
