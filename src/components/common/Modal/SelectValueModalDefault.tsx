/* eslint-disable no-nested-ternary */
import { Empty, Input, List, Modal, Radio, RadioChangeEvent, Skeleton, Spin } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import iconBackWhite from 'assets/icons/ic_back_white.svg';
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
    IProductTypes,
    IResponseGetProductTypes,
} from 'models';
import { vhToPixels } from 'utils/functions';
import { BorderLeftIcon } from 'components/icons/BorderLeftIcon';
import { SearchIcon } from 'components/icons/SearchIcon';

export interface ISelectValueModal {
    title: string;
    subtitle?: string;
    products: any;
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
    handleInputChange?: any;
    handleSelectItem(item: any): void;
    loadMoreData(): Promise<void>;
    searchValue?: string;
    handleChangeRadio?(event: RadioChangeEvent): void;
    radioItems?: { id: number; text: string }[];
    isSite?: boolean;
    placeholder?: string;
    companyName?: boolean;
    reportName?: boolean;
    descrtions?: boolean;
    showBackButton?: boolean;
    onClickBack?(): void;
    setSavedata?: any;
}

const SelectValueModalDefault: React.FC<ISelectValueModal> = ({
    title,
    subtitle,
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
    placeholder,
    companyName,
    reportName,
    descrtions,
    showBackButton,
    onClickBack,
    setSavedata,
}) => {
    const [defaultValue, setDefaultValue] = useState('');
    const onCloseModal = () => {
        setOpen(false);
        setDefaultValue('');
        handleInputChange('');
        if (title === '品名一覧' || title === '報告書分類一覧') {
            // ?????????
            if (setSavedata) {
                setSavedata();
            }
            const targetElement = document.querySelector('.infinite-scroll-component ');
            targetElement.scrollTop = 0;
        }
    };

    const changeInput = (e: any) => {
        if (title === '品名') {
            handleInputChange(e);
        } else {
            handleInputChange(e?.target?.value);
        }
        setDefaultValue(e?.target?.value);
    };
    const onClickBackButton = () => {
        onClickBack();
        setDefaultValue('');
        handleInputChange('');
    };

    return (
        <Modal className='main-menu__modal  font-inter' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center gap-2'>
                    {showBackButton ? (
                        <img src={iconBackWhite} alt='' onClick={onClickBackButton} />
                    ) : (
                        ''
                    )}
                    <h2 className='font-semibold text-white text-xl mb-0 mx-2 pl-2'>{title}</h2>
                    <div className=' bg-yellow59 rounded-sm text-red2a font-bold flex items-center text-sm justify-center px-2 py-1'>
                        {products?.totalRecords ?? 0}
                    </div>
                </div>
                <div role='button' onClick={onCloseModal}>
                    <img src={iconClose} className='w-full h-full object-cover' alt='info' />
                </div>
            </div>

            <div className=''>
                <div className='bg-white px-4 py-2'>
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
                </div>
                {/* Search */}
                <div className='bg-white px-4 pb-4 mb-3'>
                    <h2 className='text-green1A text-md font-medium pb-2'>{subtitle}</h2>
                    <Input
                        size='large'
                        placeholder={placeholder || '品名検索'}
                        prefix={
                            <div className='w-5 h-5'>
                                <SearchIcon className='w-full h-full object-cover' />
                            </div>
                        }
                        onChange={(e) => changeInput(e)}
                        value={isSite ? searchValue : defaultValue}
                    />
                </div>
                <Spin spinning={isLoading}>
                    <div
                        id='scrollableDiv'
                        className={`${radioItems ? 'scrollableDivRadio' : 'scrollableDiv'} px-4`}
                    >
                        {products?.totalRecords === 0 ? (
                            title === '品名一覧' ? (
                                <div className='text-sm text-yellow01 pb-4'>
                                    品名情報はありません
                                </div>
                            ) : title === '種類一覧' ? (
                                <div className='text-sm text-yellow01 pb-4'>
                                    種類情報はありません
                                </div>
                            ) : title === '業者一覧' ? (
                                <div className='text-sm text-yellow01 pb-4'>
                                    業者情報はありません
                                </div>
                            ) : title === '現場一覧' ? (
                                <div className='text-sm text-yellow01 pb-4'>
                                    現場情報はありません
                                </div>
                            ) : title === '報告書分類一覧' ? (
                                <div className='text-sm text-yellow01 pb-4'>
                                    報告書分類情報はありません
                                </div>
                            ) : (
                                <div className='text-sm text-yellow01 pb-4'>情報はありません.</div>
                            )
                        ) : (
                            <InfiniteScroll
                                dataLength={listProducts.length ?? 0}
                                next={() => {
                                    loadMoreData();
                                }}
                                height={vhToPixels(100)}
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
                                    renderItem={(item) => (
                                        <List.Item key={item.key}>
                                            <List.Item>
                                                <div
                                                    role='button'
                                                    onClick={
                                                        () => {
                                                            handleSelectItem(item);
                                                            setDefaultValue('');
                                                        }
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
                                                        {companyName
                                                            ? `${item.companyName}`
                                                            : reportName
                                                            ? `${item.name}`
                                                            : `${item.name}`}
                                                        {isSite && (
                                                            <div>
                                                                <h2 className='text-gray68'>
                                                                    現場名 :{' '}
                                                                    <span className='text-black11'>
                                                                        {companyName
                                                                            ? item.companyName
                                                                            : item.name}
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
                </Spin>
            </div>
        </Modal>
    );
};

export default SelectValueModalDefault;
