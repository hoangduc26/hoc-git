import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { ResError } from 'models';
import { tokenStatus } from 'services/auth';
import { store } from 'store';
import { CONSTANT_ROUTE, LOCAL_STORAGE } from 'utils/constants';
import { showErrorToast } from 'utils/functions';

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/`;
const apiDisableRefreshTokens = [
    {
        method: 'GET',
        url: '/v1/authen/status',
    },
    {
        method: 'POST',
        url: '/v1/locations',
    },
];
// Create a new mutex
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem(LOCAL_STORAGE.KEY_ACCESS_TOKEN);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const customFetchBase: BaseQueryFn<string | FetchArgs | any, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
    responseType?,
) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    // const release = await mutex.acquire();
    if (result.error && result.error.status === 401) {
        const request = args;
        let isAllowRefreshToken = false;
        const ind = apiDisableRefreshTokens.findIndex(
            (d) => d.method === request.method && d.url === request.url,
        );
        if (ind === -1) {
            isAllowRefreshToken = true;
        }
        if (isAllowRefreshToken) {
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();

                try {
                    // TODO: sao k dùng postRefresh trong auth service ??????????????????????????????????????????????????????????????????????
                    const refreshResult: any = await baseQuery(
                        {
                            credentials: 'include',
                            url: '/v1/authen/refresh',
                            method: 'POST',
                            body: {
                                accessToken: localStorage.getItem(LOCAL_STORAGE.KEY_ACCESS_TOKEN),
                                refreshToken: localStorage.getItem(LOCAL_STORAGE.KEY_REFRESH_TOKEN),
                            },
                        },
                        api,
                        extraOptions,
                    );
                    if (refreshResult.data) {
                        // Retry the initial query
                        localStorage.setItem(
                            LOCAL_STORAGE.KEY_ACCESS_TOKEN,
                            refreshResult?.data?.accessToken,
                        );
                        localStorage.setItem(
                            LOCAL_STORAGE.KEY_REFRESH_TOKEN,
                            refreshResult?.data.refreshToken,
                        );
                        result = await baseQuery(args, api, extraOptions);
                    } else {
                        store.dispatch(tokenStatus(false));
                    }
                } finally {
                    // release must be called once the mutex should be released again.
                    release();
                    // localStorage.removeItem(LOCAL_STORAGE.KEY_ACCESS_TOKEN);
                    // localStorage.removeItem('REFRESH_TOKEN');
                    // localStorage.removeItem('persist:root');
                    // window.location.href = '/login';
                }
            } else {
                // wait until the mutex is available without locking it
                await mutex.waitForUnlock();
                result = await baseQuery(args, api, extraOptions);
            }
        }
    } else if (
        result.error &&
        (result.error.status === 409 || result.error.status === 404 || result.error.status === 400)
    ) {
        const { message } = result.error.data as ResError;
        showErrorToast(message);
    }

    return result;
};

export default customFetchBase;
