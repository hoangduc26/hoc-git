/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Modal, Radio, Skeleton, Spin } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import { SearchIcon } from 'components/icons/SearchIcon';
import useDebounce from 'components/templates/hooks/useDebounce';
import { IParamsGetProductByType } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLazyGetProductsByTypeQuery } from 'services/product';
import { PAGE_SIZE } from 'utils/constants';
import { scrollTopInfiniteScrollComponent } from 'utils/functions';

export interface ISelectValueModal {
    open: boolean;
    setOpen(value: boolean): void;
    handleSelectItem(item: any): void;
}

const ModalSelectProductHasSearchType: React.FC<ISelectValueModal> = ({
    open,
    setOpen,
    handleSelectItem,
}) => {
    const containerRef: { current: HTMLDivElement } = useRef();
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const [products, setProducts] = useState([]);
    const [searchType, setSearchType] = useState(0);
    const [getProducts, responseGetProducts] = useLazyGetProductsByTypeQuery();
    const [keyword, setKeyword] = useState('');

    const handleRadioGroupChange = (e) => {
        setSearchType(e.target.value);
    };

    useEffect(() => {
        handleGetProducts(true);
    }, [searchType]);

    useDebounce(
        () => {
            handleGetProducts(true);
        },
        300,
        [keyword],
    );

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    useEffect(() => {
        handleGetProducts(true);
    }, []);

    const onCloseModal = () => {
        setOpen(false);
    };

    const loadMoreData = async () => {
        try {
            handleGetProducts(false);
        } catch (error) {
            //
        }
    };

    const handleGetProducts = async (isSearch?) => {
        const params: IParamsGetProductByType = {
            SearchText: keyword,
            SearchType: searchType,
            PageNumber: isSearch ? 1 : paging.PageNumber + 1,
            PageSize: paging.PageSize,
        };

        if (isSearch) {
            scrollTopInfiniteScrollComponent();
        }

        const response = await getProducts(params).unwrap();
        if (response) {
            setPaging({
                ...paging,
                PageNumber: params.PageNumber,
                totalRecords: response.totalRecords,
            });
            if (isSearch) {
                setProducts(response.items);
            } else {
                setProducts([...products, ...response.items]);
            }
        }
    };

    return (
        <Modal className='main-menu__modal  font-inter' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-2'>品名一覧</h2>
                    <div className=' bg-yellow59 rounded-sm text-red2a font-bold flex items-center text-sm justify-center px-2 py-1'>
                        {paging?.totalRecords ?? 0}
                    </div>
                </div>
                <div role='button' onClick={onCloseModal}>
                    <img src={iconClose} className='w-full h-full object-cover' alt='info' />
                </div>
            </div>
            <div className='flex-wrap mt-4 px-4'>
                <Radio.Group
                    className='[&_span]:text-ssm text-ssm flex flex-wrap gap-y-3'
                    onChange={(e) => handleRadioGroupChange(e)}
                    value={searchType}
                >
                    <Radio value={0} className='whitespace-nowrap'>
                        品名
                    </Radio>
                    <Radio value={1} className='whitespace-nowrap'>
                        種類
                    </Radio>
                    <Radio value={undefined} className='whitespace-nowrap'>
                        全て
                    </Radio>
                </Radio.Group>
            </div>
            <div className='px-4'>
                {/* Search */}
                <div className='mt-3 mb-3'>
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
                <div ref={containerRef}>
                    {responseGetProducts.isLoading ? (
                        <div className='w-full min-h-[400px] flex items-center justify-center'>
                            <Spin spinning />
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={products.length ?? 0}
                            next={loadMoreData}
                            hasMore={products.length < paging?.totalRecords}
                            loader={<Skeleton paragraph={{ rows: 1 }} active />}
                            height={window.innerHeight - 150}
                        >
                            {products.map((p, index) => (
                                <div
                                    key={index}
                                    role='button'
                                    onClick={() =>
                                        handleSelectItem({
                                            productCd: p.productCd,
                                            productName: p.productName,
                                        })
                                    }
                                    className='rounded px-4 py-3 relative mb-3 bg-white  text-md pl-6 shadow-sm'
                                >
                                    <div>
                                        <span className='text-green1A text-md'>
                                            {p.productName}
                                        </span>
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

export default ModalSelectProductHasSearchType;
