/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-irregular-whitespace */
import { Input, Modal, Radio, Skeleton, Spin } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import { BorderLeftIcon } from 'components/icons/BorderLeftIcon';
import { SearchIcon } from 'components/icons/SearchIcon';
import useDebounce from 'components/templates/hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    useLazyGetCompanyQuery,
    useLazyGetCustomerQuery,
    useLazyGetEmployeesQuery,
    useLazyGetSitesQuery,
    useLazyGetSourcesQuery,
    useLazyGetTypesQuery,
} from 'services/siteNotes';
import { PAGE_SIZE } from 'utils/constants';

export interface ISelectValueModal {
    title: string;
    type: number; // 1: customer, 2: company, 3: sites, 4: types, 5: employees, 6: sources
    defaultValue?: string;
    open: boolean;
    valueHiddenSources?: string;
    setOpen(value: boolean): void;
    setDefaultValue?(value: string): void;
    handleSelectItem(item: any, type: number): void;
}

const SiteNoteModal: React.FC<ISelectValueModal> = ({
    title,
    type,
    defaultValue,
    open,
    valueHiddenSources,
    setOpen,
    setDefaultValue,
    handleSelectItem,
}) => {
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const [dataList, setDataList] = useState([]);
    const [getCustomer, responseCustomerApiGet] = useLazyGetCustomerQuery();
    const [getCompany, responseCompanyApiGet] = useLazyGetCompanyQuery();
    const [getSites, responsSitesApiGet] = useLazyGetSitesQuery();
    const [getTypes, responseTypesApiGet] = useLazyGetTypesQuery();
    const [getEmployees, responseEmployeesApiGet] = useLazyGetEmployeesQuery();
    const [getSources, responseSourcesApiGet] = useLazyGetSourcesQuery();
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState();

    useEffect(() => {
        if (defaultValue) {
            setKeyword(defaultValue);
        }
    }, [defaultValue]);

    useDebounce(
        () => {
            const params =
                type === 3
                    ? {
                          search: keyword,
                          field: searchType,
                          page: 1,
                          size: paging.PageSize,
                      }
                    : {
                          search: keyword,
                          page: 1,
                          size: paging.PageSize,
                      };
            handleGetData(params, true);
        },
        300,
        [keyword, searchType],
    );

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleRadioGroupChange = (e) => {
        setSearchType(e.target.value);
    };

    useEffect(() => {
        const params =
            type === 3
                ? {
                      search: keyword,
                      field: searchType,
                      page: paging.PageNumber,
                      size: paging.PageSize,
                  }
                : {
                      search: keyword,
                      page: paging.PageNumber,
                      size: paging.PageSize,
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
            const params = await (type === 3
                ? {
                      search: keyword,
                      field: searchType,
                      page: paging.PageNumber + 1,
                      size: paging.PageSize,
                  }
                : {
                      search: keyword,
                      page: paging.PageNumber + 1,
                      size: paging.PageSize,
                  });
            handleGetData(params);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetData = async (params, isSearch?) => {
        let response;
        if (type === 1) {
            response = await getCustomer(params).unwrap();
        } else if (type === 2) {
            response = await getCompany(params).unwrap();
        } else if (type === 3) {
            response = await getSites(params).unwrap();
        } else if (type === 4) {
            response = await getTypes(params).unwrap();
        } else if (type === 5) {
            response = await getEmployees(params).unwrap();
        } else if (type === 6) {
            response = await getSources(params).unwrap();
        }

        if (response) {
            setPaging({
                ...paging,
                PageNumber: params.page,
                totalRecords: type === 6 ? response.length : response.totalRecords,
            });
            let items = [];
            if (type === 1) {
                items = response.items.map((element, index) => {
                    const item = {
                        id: dataList.length + index,
                        cd: element.customerCd,
                        name: element.customerName,
                        nameFurigana: element.customerNameFurigana,
                    };
                    return item;
                });
            } else if (type === 2) {
                items = response.items.map((element, index) => {
                    const item = {
                        id: dataList.length + index,
                        cd: element.companyCd,
                        name: element.companyName,
                        nameFurigana: element.companyNameFurigana,
                        customerCd: element.customerCd,
                        customerName: element.customerName,
                    };
                    return item;
                });
            } else if (type === 3) {
                items = response.items.map((element, index) => {
                    const item = {
                        id: dataList.length + index,
                        cd: element.siteCd,
                        name: element.siteName,
                        nameFurigana: element.siteNameFurigana,
                        siteAddress: element.siteAddress,
                        companyCd: element.companyCd,
                        companyName: element.companyName,
                        customerCd: element.customerCd,
                        customerName: element.customerName,
                    };
                    return item;
                });
            } else if (type === 6) {
                response.forEach((element, index) => {
                    if (element.cd !== 0 && element.cd !== +valueHiddenSources) {
                        const item = {
                            id: dataList.length + index,
                            cd: element.cd.toString(),
                            name: element.name,
                        };
                        items.push(item);
                    }
                });
            } else {
                items = response.items.map((element, index) => {
                    const item = {
                        id: dataList.length + index,
                        cd: element.cd,
                        name: element.name,
                    };
                    return item;
                });
            }
            if (isSearch) {
                setDataList(items);
            } else {
                setDataList([...dataList, ...items]);
            }
        }
    };

    return (
        <Modal className='main-menu__modal  font-inter' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-2'>{title}一覧</h2>
                    <div className=' bg-yellow59 rounded-sm text-red2a font-bold flex items-center text-sm justify-center px-2 py-1'>
                        {type === 6 ? dataList.length : paging?.totalRecords ?? 0}
                    </div>
                </div>
                <div role='button' onClick={onCloseModal}>
                    <img src={iconClose} className='w-full h-full object-cover' alt='info' />
                </div>
            </div>

            <div className='px-4'>
                {/* Search */}
                {type === 3 && (
                    <div className='mt-4 mb-3'>
                        <Radio.Group
                            className='flex justify-between w-full'
                            size='large'
                            onChange={(e) => handleRadioGroupChange(e)}
                            value={searchType}
                        >
                            <Radio value={1} className='text-ssm mr-0'>
                                業者名
                            </Radio>
                            <Radio value={2} className='text-ssm mr-0'>
                                現場名
                            </Radio>
                            <Radio value={3} className='text-ssm mr-0'>
                                住所
                            </Radio>
                            <Radio value={0} className='text-ssm mr-0'>
                                全て
                            </Radio>
                        </Radio.Group>
                    </div>
                )}
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
                    {responseCustomerApiGet.isLoading ||
                    responseCompanyApiGet.isLoading ||
                    responsSitesApiGet.isLoading ||
                    responseTypesApiGet.isLoading ||
                    responseEmployeesApiGet.isLoading ||
                    responseSourcesApiGet.isLoading ? (
                        <div className='w-full min-h-[400px] flex items-center justify-center'>
                            <Spin spinning />
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={dataList.length ?? 0}
                            next={loadMoreData}
                            hasMore={dataList.length < paging?.totalRecords}
                            loader={<Skeleton paragraph={{ rows: 1 }} active />}
                                height={type === 3 ? window.innerHeight - 194 : window.innerHeight - 150}
                        >
                            {dataList.map((t) => (
                                <div
                                    key={t.id}
                                    role='button'
                                    onClick={() => handleSelectItem(t, type)}
                                >
                                    <div
                                        className={`flex items-center gap-3 h-[54px] bg-white rounded-md shadow-sm relative mb-3 ${
                                            type === 3 ? 'hidden' : ''
                                        }`}
                                    >
                                        <div className='w-2 h-[60px] absolute top-[-3px] left-0'>
                                            <BorderLeftIcon className='h-full object-cover' />
                                        </div>
                                        <h2 className='text-green1A text-md font-medium mb-0 ml-6 truncate'>
                                            {t.name}
                                        </h2>
                                    </div>
                                    <div
                                        className={`gap-3 bg-white rounded-md shadow-sm py-3 mb-3 ${
                                            type !== 3 ? 'hidden' : ''
                                        }`}
                                    >
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
                                                    <span className='text-black11'>{t.name}</span>
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

export default SiteNoteModal;
