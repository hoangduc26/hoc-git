import { Input, Modal, Skeleton, Spin } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import { SearchIcon } from 'components/icons/SearchIcon';
import useDebounce from 'components/templates/hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLazyGetBranchsQuery } from 'services/branchs';
import { useAppDispatch } from 'store/hooks';
import { PAGE_SIZE } from 'utils/constants';
import { scrollTopInfiniteScrollComponent } from 'utils/functions';

export interface ISelectValueModal {
    open: boolean;
    setOpen(value: boolean): void;
    handleSelectItem(item: any): void;
}

const ModalSelectBranch: React.FC<ISelectValueModal> = ({ open, setOpen, handleSelectItem }) => {
    const dispatch = useAppDispatch();
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const [branchs, setBranchs] = useState([]);
    const [getBranchs, responseApiGet] = useLazyGetBranchsQuery();
    const [keyword, setKeyword] = useState('');

    useDebounce(
        () => {
            const params = {
                SearchText: keyword,
                PageNumber: 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params, true);
        },
        300,
        [keyword],
    );

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    useEffect(() => {
        const params = {
            SearchText: keyword,
            PageNumber: paging.PageNumber,
            PageSize: paging.PageSize,
        };
        handleGetData(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCloseModal = () => {
        setOpen(false);
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
        if (isSearch) {
            scrollTopInfiniteScrollComponent();
        }
        const response = await getBranchs(params).unwrap();
        if (response) {
            setPaging({
                ...paging,
                PageNumber: params.PageNumber,
                totalRecords: response.totalRecords,
            });
            if (isSearch) {
                setBranchs(response.items);
            } else {
                setBranchs([...branchs, ...response.items]);
            }
        }
    };

    return (
        <Modal className='main-menu__modal  font-inter' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-2'>拠点一覧</h2>
                    <div className=' bg-yellow59 rounded-sm text-red2a font-bold flex items-center text-sm justify-center px-2 py-1'>
                        {paging?.totalRecords ?? 0}
                    </div>
                </div>
                <div role='button' onClick={onCloseModal}>
                    <img src={iconClose} className='w-full h-full object-cover' alt='info' />
                </div>
            </div>

            <div className='px-4'>
                {/* Search */}
                <div className='mt-4 mb-3'>
                    <Input
                        size='large'
                        placeholder='検索する'
                        value={keyword}
                        prefix={
                            <div className='w-5 h-5'>
                                <SearchIcon className='w-full h-full object-cover' />
                            </div>
                        }
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    {responseApiGet.isLoading ? (
                        <div className='w-full min-h-[400px] flex items-center justify-center'>
                            <Spin spinning />
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={branchs.length ?? 0}
                            next={loadMoreData}
                            hasMore={branchs.length < paging?.totalRecords}
                            loader={<Skeleton paragraph={{ rows: 1 }} active />}
                            height={window.innerHeight - 150}
                        >
                            {branchs.map((t, index) => (
                                <div
                                    key={t.cd}
                                    role='button'
                                    onClick={() => handleSelectItem(t)}
                                    className='rounded px-4 py-3 relative mb-3 bg-white  text-md pl-6 shadow-sm'
                                >
                                    <div>
                                        <span className='text-green1A text-md'>{t.name}</span>
                                    </div>
                                    <div className='absolute left-0 bg-green1A w-[6px] bottom-0 top-0 rounded-e-xl' />
                                </div>
                            ))}
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ModalSelectBranch;
