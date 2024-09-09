import { Input, Modal, Select, Skeleton, Spin } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import useDebounce from 'components/templates/hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLazyGetContainersQuery, useLazyGetContainersTypeQuery } from 'services/containers';
import { PAGE_SIZE } from 'utils/constants';
import './index.scss';
import { useAppSelector } from 'store/hooks';
import { SearchIcon } from 'components/icons/SearchIcon';

export interface ISelectValueModal {
    open: boolean;
    setOpen(value: boolean): void;
    handleSelectItem(item: any): void;
}

const ModalContainer: React.FC<ISelectValueModal> = ({ open, setOpen, handleSelectItem }) => {
    const { user }: any = useAppSelector((state) => state.reducer.user);
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const [typesContainer, setTypesContainer] = useState([]);
    const [containers, setContainers] = useState([]);
    const [getTypes, responseApiGetType] = useLazyGetContainersTypeQuery();
    const [getContainers, responseApiGet] = useLazyGetContainersQuery();
    const [keyword, setKeyword] = useState('');
    const [type, setType] = useState('');

    useDebounce(
        () => {
            const params = {
                containerType: type,
                SearchText: keyword,
                PageNumber: 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params, true);
        },
        300,
        [keyword, type],
    );

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleChangeSelect = (value) => {
        setType(value);
    };

    useEffect(() => {
        if (user.containerManagementType === 2) {
            const params = {
                SearchText: '',
                PageNumber: paging.PageNumber,
                PageSize: paging.PageSize,
            };
            handleGetTypeContainer(params);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const params = {
            containerType: type,
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
                containerType: type,
                SearchText: keyword,
                PageNumber: paging.PageNumber + 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetTypeContainer = async (params) => {
        const response = await getTypes(params).unwrap();
        if (response) {
            const typeList = response.items.map((item) => ({
                value: item.cd,
                label: item.name,
            }));
            setTypesContainer(typeList);
        }
    };

    const handleGetData = async (params, isSearch?) => {
        if (user.containerManagementType === 1) {
            const response = await getTypes(params).unwrap();
            if (response) {
                setPaging({
                    ...paging,
                    PageNumber: params.PageNumber,
                    totalRecords: response.totalRecords,
                });
                const typeList = response.items.map((item) => ({
                    containerTypeCd: item.cd,
                    containerTypeName: item.name,
                    containerCd: '',
                    containerName: '',
                }));
                if (isSearch) {
                    setContainers(typeList);
                } else {
                    setContainers([...containers, ...typeList]);
                }
            }
        } else {
            const response = await getContainers(params).unwrap();
            if (response) {
                setPaging({
                    ...paging,
                    PageNumber: params.PageNumber,
                    totalRecords: response.totalRecords,
                });
                if (isSearch) {
                    setContainers(response.items);
                } else {
                    setContainers([...containers, ...response.items]);
                }
            }
        }
    };

    return (
        <Modal className='main-menu__modal  font-inter' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-2'>コンテナ一覧</h2>
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
                    {user.containerManagementType === 2 && (
                        <Select
                            size='large'
                            style={{ width: '100%' }}
                            className='select-typecontainer mb-2'
                            allowClear
                            options={typesContainer}
                            onChange={handleChangeSelect}
                            placeholder='種類で絞り込み'
                        />
                    )}
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
                <div
                    id='scrollableDiv'
                    className={`overflow-auto ${user.containerManagementType === 2
                            ? 'h-[calc(100vh_-_200px)]'
                            : 'h-[calc(100vh_-_150px)]'
                        }`}
                >
                    {responseApiGet.isLoading || responseApiGetType.isLoading ? (
                        <div className='w-full min-h-[400px] flex items-center justify-center'>
                            <Spin spinning />
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={containers.length ?? 0}
                            next={loadMoreData}
                            hasMore={containers.length < paging?.totalRecords}
                            loader={<Skeleton paragraph={{ rows: 1 }} active />}
                            scrollableTarget='scrollableDiv'
                        >
                            {containers.map((t, index) => (
                                <div
                                    key={t.containerCd.concat(t.containerTypeCd)}
                                    role='button'
                                    onClick={() => handleSelectItem(t)}
                                    className='rounded px-4 py-3 relative mb-3 bg-white  text-md pl-6 shadow-sm'
                                >
                                    {user.containerManagementType === 1 && (
                                        <div>
                                            <span className='text-green1A text-md'>
                                                {t.containerTypeName}
                                            </span>
                                        </div>
                                    )}
                                    {user.containerManagementType === 2 && (
                                        <>
                                            <div>
                                                <span className='text-green1A text-md'>
                                                    {t.containerName}
                                                </span>
                                            </div>
                                            <div className='text-gray3C text-ssm'>
                                                <span>種類：</span>
                                                <span className='font-semibold'>
                                                    {t.containerTypeName}
                                                </span>
                                            </div>
                                        </>
                                    )}
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

export default ModalContainer;
