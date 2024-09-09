/* eslint-disable no-irregular-whitespace */
/* eslint-disable prefer-template */
import { Input, Modal, Radio, Skeleton, Spin } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import useDebounce from 'components/templates/hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PAGE_SIZE } from 'utils/constants';
import { useLazyGetSitesQuery } from 'services/chat';
import './index.scss';
import { BorderLeftIcon } from 'components/icons/BorderLeftIcon';
import { SearchIcon } from 'components/icons/SearchIcon';

export interface ISelectValueModal {
    open: boolean;
    defaultValue?: string;
    setOpen(value: boolean): void;
    setDefaultValue?(value: string): void;
    handleSelectItem(item: any): void;
}

const ModalSelectSites: React.FC<ISelectValueModal> = ({
    open,
    defaultValue,
    setOpen,
    setDefaultValue,
    handleSelectItem,
}) => {
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const [sites, setSites] = useState([]);
    const [getSites, responseApiGet] = useLazyGetSitesQuery();
    const [keyword, setKeyword] = useState('');
    const [type, setType] = useState(1);

    useEffect(() => {
        if (defaultValue) {
            setKeyword(defaultValue);
        }
    }, [defaultValue]);

    useDebounce(
        () => {
            const params = {
                SearchText: keyword,
                field: type,
                PageNumber: 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params, true);
        },
        300,
        [keyword, type.toString()],
    );

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleRadioGroupChange = (e) => {
        setType(e.target.value);
    };

    useEffect(() => {
        const params = {
            SearchText: keyword,
            field: type,
            PageNumber: paging.PageNumber,
            PageSize: paging.PageSize,
        };
        handleGetData(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCloseModal = () => {
        setOpen(false);
        if (defaultValue) {
            setDefaultValue('');
        }
    };

    const loadMoreData = async () => {
        try {
            const params = {
                SearchText: keyword,
                field: type,
                PageNumber: paging.PageNumber + 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetData = async (params, isSearch?) => {
        const response = await getSites(params).unwrap();
        if (response) {
            setPaging({
                ...paging,
                PageNumber: params.PageNumber,
                totalRecords: response.totalRecords,
            });
            if (isSearch) {
                setSites(response.items);
            } else {
                setSites([...sites, ...response.items]);
            }
        }
    };

    return (
        <Modal className='main-menu__modal  font-inter' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-2'>現場一覧</h2>
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
                    <Radio.Group
                        className='flex justify-between w-full radio-selectSite'
                        size='large'
                        onChange={(e) => handleRadioGroupChange(e)}
                        value={type}
                    >
                        <Radio value={1} className='text-ssm'>
                            業者名
                        </Radio>
                        <Radio value={2} className='text-ssm'>
                            現場名
                        </Radio>
                        <Radio value={3} className='text-ssm'>
                            住所
                        </Radio>
                        <Radio value={0} className='text-ssm'>
                            全て
                        </Radio>
                    </Radio.Group>
                </div>
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
                <div className='overflow-auto'>
                    {responseApiGet.isLoading ? (
                        <div className='w-full min-h-[400px] flex items-center justify-center'>
                            <Spin spinning />
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={sites.length ?? 0}
                            next={loadMoreData}
                            hasMore={sites.length < paging?.totalRecords}
                            loader={<Skeleton paragraph={{ rows: 1 }} active />}
                            height={window.innerHeight - 194}
                        >
                            {sites.map((t) => (
                                <div
                                    key={t.companyCd + '' + t.siteCd}
                                    role='button'
                                    onClick={() => handleSelectItem(t)}
                                >
                                    <div className='gap-3 bg-white rounded-md shadow-sm py-3 mb-3'>
                                        <div className='flex items-center gap-3 relative'>
                                            <div className='w-2 h-[65px] absolute top-[-3px] left-0'>
                                                <BorderLeftIcon className='h-full object-cover' />
                                            </div>
                                            <div className='mb-0 ml-6 w-[90%]'>
                                                <h2 className='text-green1A text-md font-medium truncate'>
                                                    {t.companyName}
                                                </h2>
                                                <h2 className='text-md truncate'>
                                                    <span className='text-gray68'>現場名：</span>
                                                    <span className='text-black11'>
                                                        {t.siteName}
                                                    </span>
                                                </h2>
                                            </div>
                                        </div>
                                        <div className='mb-0 ml-6'>
                                            <div className='flex items-start text-md break-word'>
                                                <div className='text-gray68 whitespace-nowrap'>
                                                    住　所：
                                                </div>
                                                <div className='text-black11'>{t.siteAddress}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ModalSelectSites;
