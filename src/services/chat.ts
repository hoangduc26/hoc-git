import { createApi } from '@reduxjs/toolkit/query/react';
import {
    Files,
    GroupInformation,
    Groups,
    ICompanies,
    ISites,
    Mesages,
    ParamsGetCompanies,
    ParamsGetSites,
    ParamsGetUser,
    ParamsGroupChat,
    ParamsGroups,
    Users,
} from 'models';
import { createSlice } from '@reduxjs/toolkit';
import * as signalR from '@microsoft/signalr';
import customFetchBase from './customFetchBase';

export const ChatApi = createApi({
    reducerPath: 'ChatApi',
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getGroups: builder.query<Groups, ParamsGroups>({
            query: (params) => ({
                url: `/v1/chats/groups`,
                params,
                method: 'GET',
            }),
        }),

        getGroupByGroupId: builder.query<GroupInformation, { groupId: string }>({
            query: ({ groupId }) => ({
                url: `/v1/chats/groups/${groupId}`,
                method: 'GET',
            }),
        }),

        postGroups: builder.mutation<any, { body: any }>({
            query: ({ body }) => ({
                url: `/v1/chats/groups`,
                body,
                method: 'POST',
            }),
        }),
        putGroups: builder.mutation<any, { groupId: string; body: any }>({
            query: ({ groupId, body }) => ({
                url: `/v1/chats/groups/${groupId}`,
                body,
                method: 'PUT',
            }),
        }),

        deleteGroups: builder.mutation<any, { groupId: string; body: any }>({
            query: ({ groupId, body }) => ({
                url: `/v1/chats/groups/${groupId}`,
                body,
                method: 'DELETE',
            }),
        }),

        getChatList: builder.query<Mesages, { groupId: string; params?: ParamsGroupChat }>({
            query: ({ groupId, params }) => ({
                url: `/v1/chats/${groupId}/messages`,
                params,
                method: 'GET',
            }),
        }),

        getFileList: builder.query<Files, { groupId: string; params?: ParamsGroupChat }>({
            query: ({ groupId, params }) => ({
                url: `/v1/chats/${groupId}/files`,
                params,
                method: 'GET',
            }),
        }),

        postFiletChat: builder.mutation<any, { groupId: string; body: any }>({
            query: ({ groupId, body }) => ({
                url: `/v1/chats/${groupId}/files`,
                body,
                method: 'POST',
            }),
        }),

        getUsers: builder.query<Users, ParamsGetUser>({
            query: (params) => ({
                url: `/v1/chats/users`,
                params,
                method: 'GET',
            }),
        }),

        getCompanies: builder.query<ICompanies, ParamsGetCompanies>({
            query: (params) => ({
                url: `/v1/chats/companies`,
                params,
                method: 'GET',
            }),
        }),

        getSites: builder.query<ISites, ParamsGetSites>({
            query: (params) => ({
                url: `/v1/chats/sites`,
                params,
                method: 'GET',
            }),
        }),
    }),
});

const initialState: { cacheSearchCondition?: any; infoGroupChat?: any } = {
    cacheSearchCondition: null,
    infoGroupChat: null,
};

const groupsSlice = createSlice({
    name: 'groupsSlice',
    initialState,
    reducers: {
        saveCacheSearchConditionGroups: (state, action) => {
            state.cacheSearchCondition = action.payload;
        },
        saveCacheGroupName: (state, action) => {
            state.infoGroupChat = action.payload;
        },
    },
});

export const { saveCacheSearchConditionGroups, saveCacheGroupName } = groupsSlice.actions;
export const GroupsReducer = groupsSlice.reducer;
export const {
    useLazyGetGroupsQuery,
    useLazyGetGroupByGroupIdQuery,
    usePostGroupsMutation,
    usePutGroupsMutation,
    useDeleteGroupsMutation,
    useLazyGetChatListQuery,
    useLazyGetFileListQuery,
    usePostFiletChatMutation,
    useLazyGetUsersQuery,
    useLazyGetCompaniesQuery,
    useLazyGetSitesQuery,
} = ChatApi;
