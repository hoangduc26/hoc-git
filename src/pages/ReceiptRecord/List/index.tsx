/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
import { Button, Collapse, Input, Radio, Switch } from 'antd';
import Layout from 'components/templates/Layout';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';
import iconSearch from 'assets/icons/ic_search.svg';
import iconRedClear from 'assets/icons/ic_red_clear.svg';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import iconClock from 'assets/icons/ic_clock.svg';
import iconRedDelete from 'assets/icons/ic-red-delete.svg';
import React, { useEffect, useRef, useState } from 'react';
import FuncBlock from 'components/common/FuncBlock';
import { useForm, Controller } from 'react-hook-form';
import { CONSTANT_ROUTE } from 'utils/constants';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { setPreviousPage } from 'services/page';
import Calendar from 'components/common/Calendar';
import './index.scss';
import {
    saveCacheSearchConditionReceiptRecords,
    useLazyGetReceiptRecordsQuery,
} from 'services/receiptRecords';
import { ParamsReceiptRecords } from 'models';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';
import { FilterSvg } from 'components/icons/FilterSvg';
import { BuildingOfficeIcon } from 'components/icons/BuildingOfficeIcon';
import { DriverIcon } from 'components/icons/DriverIcon';
import { EyeIcon } from 'components/icons/EyeIcon';
import { WebsiteIcon } from 'components/icons/WebsiteIcon';
import { FastTruckIcon } from 'components/icons/FastTruckIcon';
import { RegisterIcon } from 'components/icons/RegisterIcon';
import ModalWorker from '../ModalWorker';

interface IFormSearchInput {
    workDate: string;
    isSearchWorker: boolean;
    workerCd: string;
    workerName: string;
    isSearchEct: boolean;
    etcType: number;
    etcSearchText?: string;
    pageNumber: number;
    pageSize: number;
}

const ReceiptRecordList: React.FC = () => {
    const pageSizeSystemSetting = useAppSelector(
        (state) => state.reducer.systemSetting?.systemSetting?.commonPageSize,
    );
    const pageSize = pageSizeSystemSetting || DEFAULT_SYSTEM_SETTING.commonPageSize;
    const [listReceiptRecord, setListReceiptRecord] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const [getReceiptRecordList, { data: receiptRecordData, isLoading, isFetching }] =
        useLazyGetReceiptRecordsQuery();

    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.RECEIPT_RECORD_LIST],
    );
    const cacheSearchCondition = useAppSelector(
        (state) => state.reducer.receiptRecords.cacheSearchCondition,
    );
    const location = useLocation();
    const dispatch = useAppDispatch();
    const defaultValues: IFormSearchInput = {
        workDate: dayjs(new Date()).format('YYYY-MM-DD'),
        isSearchWorker: true,
        workerCd: '',
        workerName: '',
        isSearchEct: true,
        etcType: 0,
        etcSearchText: '',
        pageNumber: 1,
        pageSize,
    };

    const { control, watch, setValue, getValues, handleSubmit, reset } = useForm<IFormSearchInput>({
        defaultValues: null,
    });

    useEffect(() => {
        let formValue = defaultValues;
        if (cacheSearchCondition) {
            formValue = cacheSearchCondition;
        }
        reset(formValue);
        handleGetData(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data: IFormSearchInput) => {
        handleGetData(true);
    };

    const handleSelectReceiptDate = (item: any) => {
        setValue('workDate', dayjs(item).format('YYYY-MM-DD'));
    };

    const handleLoadMore = () => {
        handleGetData(false);
    };

    const handleGetData = async (isSearch?) => {
        const formValue = getValues();
        const paramsRequest: ParamsReceiptRecords = {
            WorkDate: formValue.workDate,
            WorkerCd: formValue.isSearchWorker ? formValue.workerCd : '',
            EtcType: formValue.etcType,
            EtcSearchText: formValue.isSearchEct ? formValue.etcSearchText : '',
            PageNumber: isSearch ? 1 : formValue.pageNumber + 1,
            PageSize: formValue.pageSize,
        };

        const response = await getReceiptRecordList(paramsRequest).unwrap();
        if (response) {
            setValue('pageNumber', paramsRequest.PageNumber);
            if (isSearch) {
                setListReceiptRecord(response.items);
            } else {
                setListReceiptRecord([...listReceiptRecord, ...response.items]);
            }
        }
        dispatch(saveCacheSearchConditionReceiptRecords(formValue));
    };

    const handleOpenWeighinghInfo = () => {
        navigate(`/${CONSTANT_ROUTE.WEIGHING_INFORMATION_SELECTION}`);
    };

    const onEditReceiptRecord = (orderType, slipSystemId, seq) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.RECEIPT_RECORD_INPUT,
            }),
        );
        navigate(
            `/${CONSTANT_ROUTE.RECEIPT_RECORD_INPUT}?orderType=${orderType}&slipSystemId=${slipSystemId}&seq=${seq}`,
        );
    };

    const onDeleteReceiptRecord = (orderType, slipSystemId, seq) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.RECEIPT_RECORD_INPUT,
            }),
        );
        navigate(
            `/${CONSTANT_ROUTE.RECEIPT_RECORD_INPUT}?isDelete=true&orderType=${orderType}&slipSystemId=${slipSystemId}&seq=${seq}`,
        );
    };

    const handleSelectModal = (d) => {
        setValue('workerCd', d.cd);
        setValue('workerName', d.name);
        setOpenModal(false);
    };

    const handleClickRollBack = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    const [isOpenSearchConditions, setIsOpenSearchConditions] = useState(true);
    const fixedElementRef = useRef();
    const collapsedElementRef = useRef();
    const contentElementRef = useRef();
    const handleChangeCollapse = (tabActive) => {
        setTimeout(() => {
            if (tabActive?.length > 0) {
                setIsOpenSearchConditions(true);
                window.scrollTo(0, 0);
            } else {
                setIsOpenSearchConditions(false);
            }
        }, 0);
    };

    useEffect(() => {
        const functionHandleScroll = ($event) => {
            checkStyleElement();
        };

        window.addEventListener('scroll', functionHandleScroll);
        return () => {
            window.removeEventListener('scroll', functionHandleScroll);
        };
    }, []);

    useEffect(() => {
        checkStyleElement();
    }, [isOpenSearchConditions]);

    const checkStyleElement = () => {
        const { documentElement } = document;
        if (fixedElementRef.current && collapsedElementRef.current && contentElementRef.current) {
            const collapsed = collapsedElementRef.current as HTMLElement; // Collapse
            const elementFixedOnScroll = fixedElementRef.current as HTMLElement; // Element cần cố định khi scroll
            const content = contentElementRef.current as HTMLElement; // Danh sách || nội dung || dữ liệu trang

            if (collapsed.classList.contains('opening')) {
                // Collapse OPEN
                if (documentElement.scrollTop >= 421) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '159px';
                    elementFixedOnScroll.style.zIndex = '10';
                    elementFixedOnScroll.style.borderTop = '1px solid white';
                    content.style.marginTop = '48px';
                } else {
                    elementFixedOnScroll.style.position = 'unset';
                    elementFixedOnScroll.style.borderTop = 'none';
                    content.style.marginTop = 'unset';
                }
            } else {
                // Collapse CLOSE
                elementFixedOnScroll.style.position = 'fixed';
                elementFixedOnScroll.style.width = '100%';
                elementFixedOnScroll.style.top = '159px';
                elementFixedOnScroll.style.zIndex = '10';
                elementFixedOnScroll.style.borderTop = '1px solid white';
                content.style.marginTop = '206px';
            }
        }
    };

    return (
        <Layout
            title='受入実績一覧'
            isShowDate={false}
            isLoading={isLoading || isFetching}
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Collapse
                    defaultActiveKey='1'
                    expandIconPosition='end'
                    onChange={($event) => handleChangeCollapse($event)}
                    ref={collapsedElementRef}
                    className={`bg-green15 border !border-green15 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:top-header 
                    [&_.ant-collapse-header]:bg-green15 
                    [&_.ant-collapse-header]:w-full 
                    [&_.ant-collapse-header]:z-10
                    [&_.ant-collapse-header]:left-0
                    [&_.ant-collapse-header]:!transition-none
                    [&_.ant-collapse-content-box]:!p-0
                    [&_.ant-collapse-content]:!rounded-none
                    [&_.ant-collapse-header]:!rounded-none
                    ${
                        isOpenSearchConditions
                            ? `
                           opening 
                       [&_.ant-collapse-content]:mt-[157px]
                       `
                            : ``
                    }`}
                    expandIcon={({ isActive }) =>
                        isActive ? (
                            <div className='w-5 h-5'>
                                <img src={iconChevronUp} className='w-full h-full' alt='info' />
                            </div>
                        ) : (
                            <div className='w-5 h-5'>
                                <img src={iconChevronDown} className='w-full h-full' alt='info' />
                            </div>
                        )
                    }
                    items={[
                        {
                            key: '1',
                            label: (
                                <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                    検索条件
                                </h2>
                            ),
                            className: 'collapse-panel-custom',
                            children: isOpenSearchConditions && (
                                <div className='flex flex-col'>
                                    {/* Calendar */}
                                    <div className='border-b-[3px] border-grayE9'>
                                        <Calendar
                                            defaultDate={watch('workDate') || null}
                                            selectedDate={watch('workDate')}
                                            handleSelectDate={handleSelectReceiptDate}
                                        />
                                        <div className='flex items-center gap-2 border-t border-grayE9 p-4'>
                                            <div className='flex items-center gap-2'>
                                                <Controller
                                                    control={control}
                                                    name='isSearchWorker'
                                                    render={({ field: { value, onChange } }) => (
                                                        <Switch
                                                            onChange={onChange}
                                                            checked={value}
                                                        />
                                                    )}
                                                />
                                                <div className='text-md text-green1A whitespace-nowrap'>
                                                    作業者
                                                </div>
                                            </div>
                                            <Controller
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        size='middle'
                                                        className='!border-grayD4'
                                                        onChange={handleSubmit(onSubmit)}
                                                        prefix={
                                                            <div className='w-5 h-5'>
                                                                <img
                                                                    src={iconSearch}
                                                                    className='w-full h-full object-cover'
                                                                    alt='iconSearch'
                                                                />
                                                            </div>
                                                        }
                                                        suffix={
                                                            field.value && (
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        setValue('workerName', '');
                                                                        setValue('workerCd', '');
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={iconRedClear}
                                                                        alt='iconRedClear'
                                                                    />
                                                                </button>
                                                            )
                                                        }
                                                    />
                                                )}
                                                name='workerName'
                                                control={control}
                                                defaultValue=''
                                            />
                                            <Button
                                                onClick={() => setOpenModal(true)}
                                                className='border-green15 min-w-[40px]'
                                                icon={
                                                    <div className='w-6 h-6'>
                                                        <FilterSvg className='w-full h-full object-cover' />
                                                    </div>
                                                }
                                                size='large'
                                            />
                                        </div>
                                    </div>

                                    <div className='px-4 py-4'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <Controller
                                                control={control}
                                                name='isSearchEct'
                                                render={({ field: { value, onChange } }) => (
                                                    <Switch onChange={onChange} checked={value} />
                                                )}
                                            />
                                            <div className='text-md text-green1A'>
                                                以下の指定条件を検索に含める
                                            </div>
                                        </div>
                                        <Controller
                                            control={control}
                                            name='etcType'
                                            render={({ field }) => (
                                                <Radio.Group
                                                    {...field}
                                                    className='grid grid-rows-2 grid-cols-[auto_auto] md:grid-cols-4 md:grid-rows-1 gap-2 mb-2'
                                                    size='large'
                                                >
                                                    <Radio value={0} className='text-sm'>
                                                        業者名
                                                    </Radio>
                                                    <Radio value={1} className='text-sm'>
                                                        現場名
                                                    </Radio>
                                                    <Radio value={2} className='text-sm'>
                                                        運搬業者名
                                                    </Radio>
                                                    <Radio value={3} className='text-sm'>
                                                        品名
                                                    </Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                        <Controller
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    size='middle'
                                                    allowClear={{
                                                        clearIcon: (
                                                            <div className='w-5 h-5'>
                                                                <img
                                                                    className='w-full h-full object-cover'
                                                                    src={iconRedClear}
                                                                    alt='iconRedClear'
                                                                />
                                                            </div>
                                                        ),
                                                    }}
                                                    className='!border-grayD4'
                                                    placeholder={
                                                        watch('etcType') === 0
                                                            ? '業者名で検索する'
                                                            : watch('etcType') === 1
                                                            ? '現場名で検索する'
                                                            : watch('etcType') === 2
                                                            ? '運搬業者名で検索する'
                                                            : '品名で検索する'
                                                    }
                                                    onBlur={handleSubmit(onSubmit)}
                                                    prefix={
                                                        <div className='w-5 h-5'>
                                                            <img
                                                                src={iconSearch}
                                                                className='w-full h-full object-cover'
                                                                alt='iconSearch'
                                                            />
                                                        </div>
                                                    }
                                                />
                                            )}
                                            name='etcSearchText'
                                            control={control}
                                            defaultValue=''
                                        />
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />
                <div ref={fixedElementRef}>
                    <FuncBlock
                        leftChild={
                            <div className='flex items-center '>
                                <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                    受入実績一覧
                                </h2>
                                <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold'>
                                    {receiptRecordData ? receiptRecordData.totalRecords : 0}
                                </span>
                            </div>
                        }
                        isShowRightIcon
                        isShowIconRefresh
                        onClickRefresh={handleSubmit(onSubmit)}
                        onClickIcon={handleOpenWeighinghInfo}
                    />
                </div>
                <div ref={contentElementRef}>
                    {listReceiptRecord &&
                        receiptRecordData &&
                        receiptRecordData.totalRecords !== 0 &&
                        listReceiptRecord.length > 0 &&
                        listReceiptRecord.map((item, index) => (
                            <div className={`px-4 ${index === 0 ? 'pt-4' : ''}`} key={index}>
                                <div className='bg-white rounded-lg shadow-md w-full py-4 mb-4'>
                                    <div className='flex justify-between items-center px-4 pb-3 border-b-[2px] border-grayE9'>
                                        <div className='text-sm text-black11'>作業日: </div>
                                        <div className='flex items-center'>
                                            <div className='flex items-center pr-2 border-r-2 border-grayD4 text-md'>
                                                <img
                                                    src={iconCalendar}
                                                    alt='iconCalendar'
                                                    className='mr-2'
                                                />
                                                {dayjs(item.workDate).format('YYYY/MM/DD')}
                                            </div>
                                            <div className='flex items-center pl-2 text-md'>
                                                <img
                                                    src={iconClock}
                                                    alt='iconClock'
                                                    className='mr-2'
                                                />
                                                {item.workTime?.slice(0, 5)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* info */}
                                    <div className='flex items-center gap-3 relative p-3 border-b-[1px] border-grayE9 h-full'>
                                        <div className='w-full'>
                                            <div className='flex items-center gap-2 ml-2 mb-3'>
                                                <div>
                                                    <RegisterIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-black27 truncate'>
                                                    {item.workerName}
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 ml-2 mb-3'>
                                                <div>
                                                    <BuildingOfficeIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-black27 truncate'>
                                                    {item.companyName}
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 ml-2 mb-3'>
                                                <div>
                                                    <WebsiteIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-black27 truncate'>
                                                    {item.siteName}
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 ml-2 mb-3'>
                                                <div>
                                                    <DriverIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-black27 truncate'>
                                                    {item.carrierName}
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 ml-2'>
                                                <div>
                                                    <FastTruckIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-black27 truncate'>
                                                    {item.vehicleName}
                                                    {item.vehicleTypeName
                                                        ? '（' + item.vehicleTypeName + '）'
                                                        : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center mt-4 px-4'>
                                        <div
                                            className='w-1/2 border-r-2 border-grayD4'
                                            onClick={() =>
                                                onEditReceiptRecord(
                                                    item.orderType,
                                                    item.slipSystemId,
                                                    item.seq,
                                                )
                                            }
                                        >
                                            <div className='flex items-center gap-2'>
                                                <div className='w-6 h-6'>
                                                    <EyeIcon className='w-full h-full object-cover' />
                                                </div>
                                                <p className='text-ssm text-green15 font-zenMaru'>
                                                    詳細を見る
                                                </p>
                                            </div>
                                        </div>

                                        {/* Detail  */}
                                        <div
                                            className='w-1/2'
                                            onClick={() =>
                                                onDeleteReceiptRecord(
                                                    item.orderType,
                                                    item.slipSystemId,
                                                    item.seq,
                                                )
                                            }
                                        >
                                            <div className='flex items-center gap-2 justify-end'>
                                                <p className='text-ssm text-red2a font-zenMaru'>
                                                    削除
                                                </p>

                                                <div className='w-6 h-6'>
                                                    <img
                                                        className='w-full h-full object-cover'
                                                        src={iconRedDelete}
                                                        alt='iconRedDelete'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    {(listReceiptRecord.length === 0 ||
                        (receiptRecordData && receiptRecordData.totalRecords === 0)) && (
                        <div className='p-4'>
                            <div className='text-sm text-yellow01'>受入実績はありません.</div>
                        </div>
                    )}
                </div>
                {listReceiptRecord.length < receiptRecordData?.totalRecords && (
                    <div className='px-[100px] pb-2'>
                        <Button
                            className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center'
                            onClick={handleLoadMore}
                        >
                            もっと見る
                        </Button>
                    </div>
                )}
                {openModal && (
                    <ModalWorker
                        open={openModal}
                        setOpen={setOpenModal}
                        handleSelectItem={handleSelectModal}
                    />
                )}
            </form>
        </Layout>
    );
};
export default ReceiptRecordList;
