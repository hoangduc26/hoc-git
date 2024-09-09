/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Avatar, Input, Skeleton, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PAGE_SIZE } from 'utils/constants';
import useDebounce from 'components/templates/hooks/useDebounce';
import { useLazyGetChatListQuery } from 'services/chat';
import dayjs from 'dayjs';
import './index.scss';
import { UserOutlined } from '@ant-design/icons';
import { SearchIcon } from 'components/icons/SearchIcon';
import iconRedClear from 'assets/icons/ic_red_clear.svg';

export interface ISelectValueModal {
    groupId: string;
    handleSelectItem(item: string): void;
}

const SearchMessage: React.FC<ISelectValueModal> = ({ groupId, handleSelectItem }) => {
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const [listChat, setListChat] = useState([]);
    const [getChatList, responseApiGet] = useLazyGetChatListQuery();
    const [keyword, setKeyword] = useState('');

    useDebounce(
        () => {
            if (keyword) {
                const params = {
                    SearchText: keyword,
                    PageNumber: 1,
                    PageSize: paging.PageSize,
                };
                handleGetData(params, true);
            } else {
                setPaging({ ...paging, totalRecords: 0 });
                setListChat([]);
            }
        },
        300,
        [keyword],
    );

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const loadMoreData = async () => {
        try {
            const params = {
                SearchText: keyword,
                PageNumber: paging.PageNumber + 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetData = async (params, isSearch?) => {
        const response = await getChatList({ groupId, params }).unwrap();
        if (response) {
            setPaging({
                ...paging,
                PageNumber: params.PageNumber,
                totalRecords: response.totalRecords,
            });
            if (isSearch) {
                setListChat(response.items);
            } else {
                setListChat([...listChat, ...response.items]);
            }
        }
    };

    return (
        <div>
            <div className='px-4 mt-4 mb-3'>
                <Input
                    className='search-chat-input'
                    size='large'
                    placeholder='検索する'
                    prefix={
                        <div className='w-5 h-5'>
                            <SearchIcon className='w-full h-full object-cover' />
                        </div>
                    }
                    allowClear={{
                        clearIcon: (
                            <img
                                src={iconRedClear}
                                alt='iconRedClear'
                                onClick={() => {
                                    setKeyword('');
                                }}
                            />
                        ),
                    }}
                    onBlur={handleInputChange}
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            handleInputChange(event);
                        }
                    }}
                />
            </div>
            <div id='scrollableDiv' className='overflow-auto h-[calc(100vh_-_244px)]'>
                {responseApiGet.isLoading ? (
                    <div className='w-full min-h-[400px] flex items-center justify-center'>
                        <Spin spinning />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={listChat.length ?? 0}
                        next={loadMoreData}
                        hasMore={listChat.length < paging?.totalRecords}
                        loader={<Skeleton paragraph={{ rows: 1 }} active />}
                        scrollableTarget='scrollableDiv'
                    >
                        {listChat.map((t, index) => (
                            <div
                                key={index}
                                className={`py-3 first:pt-0 px-2 ${index % 2 !== 0 ? 'bg-[#f4f4f4]' : ''
                                    }`}
                                onClick={() => handleSelectItem(t.messageId)}
                            >
                                <div className='flex items-center'>
                                    <Avatar
                                        icon={<UserOutlined />}
                                        size='large'
                                        className='flex justify-center items-center'
                                    />
                                    <div className='w-[88%]'>
                                        <div className='ml-2'>
                                            <div className='flex justify-between items-center'>
                                                <p className='text-sm font-bold'>{t.sender}</p>
                                                <p className='text-right text-xs text-grey-dark mt-1'>
                                                    {dayjs(t.createDate).format('YYYY/MM/DD HH:mm')}
                                                </p>
                                            </div>
                                            <p
                                                className='text-sm mt-1 break-words'
                                                dangerouslySetInnerHTML={{
                                                    __html: t.content || '',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
};

export default SearchMessage;
