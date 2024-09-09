import { Input, List, Modal, Radio, RadioChangeEvent, Skeleton, Spin } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.scss';
import {
    Company,
    CompanyInformation,
    Customer,
    CustomerInformation,
    Product,
    IResponseGetProducts,
    SiteNotesInformation,
    Sites,
    SitesInformation,
    Titles,
    TitlesInformation,
    Types,
    TypesInformation,
} from 'models';
import { BorderLeftIcon } from 'components/icons/BorderLeftIcon';
import { SearchIcon } from 'components/icons/SearchIcon';

export interface ISelectValueModal {
    title: string;
    products: IResponseGetProducts | Customer | Company | Sites | Types | Titles;
    listProducts:
        | Product[]
        | CustomerInformation[]
        | CompanyInformation[]
        | SitesInformation[]
        | TypesInformation[]
        | TitlesInformation[];
    open: boolean;
    isLoading: boolean;
    setOpen(value: boolean): void;
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void;
    handleSelectItem(item: any): void;
    loadMoreData(): Promise<void>;
    searchValue?: string;
    handleChangeRadio?(event: RadioChangeEvent): void;
    radioItems?: { id: number; text: string }[];
    isSite?: boolean;
}

const SelectValueModal: React.FC<ISelectValueModal> = ({
    title,
    products,
    listProducts,
    open,
    isLoading,
    setOpen,
    handleInputChange,
    handleSelectItem,
    loadMoreData,
    searchValue,
    handleChangeRadio,
    radioItems,
    isSite,
}) => {
    const initPaginations = {
        // search: searchProduct,
        page: 1,
        size: 10,
    };

    const onCloseModal = () => {
        setOpen(false);
    };

    return (
        <Modal className='main-menu__modal  font-inter' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-2'>{title}一覧</h2>
                    <div className=' bg-yellow59 rounded-sm text-red2a font-bold flex items-center text-sm justify-center px-2 py-1'>
                        {products?.totalRecords ?? 0}
                    </div>
                </div>
                <div role='button' onClick={onCloseModal}>
                    <img src={iconClose} className='w-full h-full object-cover' alt='info' />
                </div>
            </div>

            <div className='px-4'>
                {radioItems && (
                    <Radio.Group
                        name='radiogroup'
                        defaultValue={radioItems.length > 0 && radioItems[0].id}
                        onChange={handleChangeRadio}
                        className='radio-group w-full flex justify-between mt-1'
                    >
                        {radioItems.length > 0 &&
                            radioItems.map((radio) => (
                                <Radio className='text-sm' value={radio.id}>
                                    {radio.text}
                                </Radio>
                            ))}
                    </Radio.Group>
                )}
                {/* Search */}
                <div className='mt-4 mb-3'>
                    <Input
                        size='large'
                        placeholder='検索する'
                        prefix={
                            <div className='w-5 h-5'>
                                <SearchIcon className='w-full h-full object-cover' />
                            </div>
                        }
                        onChange={handleInputChange}
                        defaultValue={searchValue}
                    />
                </div>

                <div
                    id='scrollableDiv'
                    className={`${radioItems ? 'scrollableDivRadio' : 'scrollableDiv'}`}
                >
                    {isLoading ? (
                        <div className='w-full min-h-[400px] flex items-center justify-center'>
                            <Spin spinning />
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={listProducts.length ?? 0}
                            next={() => {
                                loadMoreData();
                            }}
                            hasMore={listProducts.length < products?.totalRecords}
                            loader={<Skeleton paragraph={{ rows: 1 }} active />}
                            scrollableTarget='scrollableDiv'
                        >
                            {/* 
                            | Product
                                | CustomerInformation
                                | CompanyInformation
                                | SitesInformation
                                | TypesInformation
                                | TitlesInformation
                            */}
                            <List<any>
                                dataSource={listProducts}
                                locale={{ emptyText: <div/> }}
                                renderItem={(item) => (
                                    <List.Item key={item.key}>
                                        <List.Item>
                                            <div
                                                role='button'
                                                onClick={
                                                    () => handleSelectItem(item)
                                                    // handleSelectItem({
                                                    //     code: item.key,
                                                    //     name: item.name,
                                                    // })
                                                }
                                                className={`${
                                                    // isSite ? 'h-[100%] py-1' : 'h-[54px]'
                                                    isSite ? 'h-[100%] py-1' : 'min-h-[54px]'
                                                } w-full flex items-center gap-3 bg-white rounded-md shadow-sm relative`}
                                            >
                                                {/* <div className='w-2 h-[60px] absolute top-[-3px] left-0'> */}
                                                <div className='w-2 absolute top-[50%] translate-y-[-50%] left-0 h-full'>
                                                    <BorderLeftIcon className='h-full object-cover' />
                                                </div>
                                                <h2 className='text-green1A text-md font-medium mb-0 my-1 ml-6 py-2'>
                                                    {item.name}
                                                    {isSite && (
                                                        <div>
                                                            <h2 className='text-gray68'>
                                                                現場名 :{' '}
                                                                <span className='text-black11'>
                                                                    {item.name}
                                                                </span>
                                                            </h2>
                                                            <h2 className='text-gray68'>
                                                                住 所：
                                                                <span className='text-black11'>
                                                                    {item.siteAddress}
                                                                </span>
                                                            </h2>
                                                        </div>
                                                    )}
                                                </h2>
                                            </div>
                                        </List.Item>
                                    </List.Item>
                                )}
                            />
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SelectValueModal;
