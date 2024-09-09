/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
import { Button, Collapse, Input, Radio, Switch } from 'antd';
import Layout from 'components/templates/Layout';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';
import iconSearch from 'assets/icons/ic_search.svg';
import iconRedClear from 'assets/icons/ic_red_clear.svg';
import iconRedBorder from 'assets/icons/ic_red_border.svg';
import iconRedDelete from 'assets/icons/ic-red-delete.svg';
import React, { useEffect, useRef, useState } from 'react';
import FuncBlock from 'components/common/FuncBlock';
import { useForm, Controller } from 'react-hook-form';
import { CONSTANT_ROUTE, WEEKDAYLIST } from 'utils/constants';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from 'components/common/Calendar';
import './index.scss';
import {
    saveCacheSearchConditionWeighingInfos,
    useLazyGetScalingsQuery,
} from 'services/receiptRecords';
import { ParamsScalings } from 'models';
import { setPreviousPage } from 'services/page';
import { openConfirm } from 'utils/functions';
import ModalWorker from 'pages/ReceiptRecord/ModalWorker';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';
import { FilterSvg } from 'components/icons/FilterSvg';
import { BorderLeftIcon } from 'components/icons/BorderLeftIcon';
import { EyeIcon } from 'components/icons/EyeIcon';

interface IFormSearchInput {
    receiptDate: string;
    recordType?: number;
    workerCd?: string;
    workerName?: string;
    etcType: number;
    etcSearchText?: string;
    pageNumber: number;
    pageSize: number;
}

const WeighingInformation: React.FC = () => {
    const pageSizeSystemSetting = useAppSelector(
        (state) => state.reducer.systemSetting?.systemSetting?.commonPageSize,
    );
    const pageSize = pageSizeSystemSetting || DEFAULT_SYSTEM_SETTING.commonPageSize;
    const [listWeighingInformation, setListWeighingInformation] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [getWeighingInformation, { data: weighingInformationData, isLoading, isFetching }] =
        useLazyGetScalingsQuery();
    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) =>
            state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.WEIGHING_INFORMATION_SELECTION],
    );
    const location = useLocation();
    const dispatch = useAppDispatch();
    const defaultValues: IFormSearchInput = {
        receiptDate: dayjs(new Date()).format('YYYY-MM-DD'),
        recordType: 0,
        workerCd: '',
        workerName: '',
        etcType: 0,
        etcSearchText: '',
        pageNumber: 1,
        pageSize,
    };

    const { control, watch, setValue, getValues, handleSubmit, reset } = useForm<IFormSearchInput>({
        defaultValues: null,
    });

    const cacheSearchCondition = useAppSelector(
        (state) => state.reducer.receiptRecords.cacheSearchConditionScaling,
    );

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
        setValue('receiptDate', dayjs(item).format('YYYY-MM-DD'));
    };

    const handleLoadMore = () => {
        handleGetData(false);
    };

    const handleGetData = async (isSearch?) => {
        const formValue = getValues();
        const paramsRequest: ParamsScalings = {
            ReceiptDate: formValue.receiptDate,
            RecordType: formValue.recordType,
            WorkerCd: formValue.workerCd,
            EtcType: formValue.etcType,
            EtcSearchText: formValue.etcSearchText,
            PageNumber: isSearch ? 1 : formValue.pageNumber + 1,
            PageSize: formValue.pageSize,
        };

        const response = await getWeighingInformation(paramsRequest).unwrap();
        if (response) {
            setValue('pageNumber', paramsRequest.PageNumber);
            if (isSearch) {
                setListWeighingInformation(response.items);
            } else {
                setListWeighingInformation([...listWeighingInformation, ...response.items]);
            }
        }
        dispatch(saveCacheSearchConditionWeighingInfos(formValue));
    };

    const handelSelect = (orderType, slipSystemId, receiptRecordSeq) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.RECEIPT_RECORD_INPUT,
            }),
        );
        if (receiptRecordSeq) {
            openConfirm({
                content: (
                    <div className='flex justify-center items-center mt-3 text-xl font-semibold text-red2a text-center w-full mb-4'>
                        <div>
                            実績登録済の受入情報です。
                            <br />
                            登録済の実績を表示しますか？
                        </div>
                    </div>
                ),
                onOk: () => {
                    navigate(
                        `/${CONSTANT_ROUTE.RECEIPT_RECORD_INPUT}?orderType=${orderType}&slipSystemId=${slipSystemId}&seq=${receiptRecordSeq}`,
                    );
                },
            });
        } else {
            navigate(
                `/${CONSTANT_ROUTE.RECEIPT_RECORD_INPUT}?orderType=${orderType}&slipSystemId=${slipSystemId}`,
            );
        }
    };

    const handleSelectModal = (d) => {
        setValue('workerCd', d.cd);
        setValue('workerName', d.name);
        setOpenModal(false);
    };

    const onDeleteReceiptRecord = (orderType, slipSystemId, receiptRecordSeq) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.RECEIPT_RECORD_INPUT,
            }),
        );
        navigate(
            `/${CONSTANT_ROUTE.RECEIPT_RECORD_INPUT}?isDelete=true&orderType=${orderType}&slipSystemId=${slipSystemId}&seq=${receiptRecordSeq}`,
        );
    };

    const onEditReceiptRecord = (orderType, slipSystemId, receiptRecordSeq) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.RECEIPT_RECORD_INPUT,
            }),
        );
        navigate(
            receiptRecordSeq
                ? `/${CONSTANT_ROUTE.RECEIPT_RECORD_INPUT}?orderType=${orderType}&slipSystemId=${slipSystemId}&seq=${receiptRecordSeq}`
                : `/${CONSTANT_ROUTE.RECEIPT_RECORD_INPUT}?orderType=${orderType}&slipSystemId=${slipSystemId}`,
        );
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
            const boundingClientRect = elementFixedOnScroll.getBoundingClientRect();

            if (collapsed.classList.contains('opening')) {
                // Collapse OPEN
                if (boundingClientRect.top <= 159 && documentElement.scrollTop >= 452) {
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
                elementFixedOnScroll.style.borderTop = '1px solid white';
                content.style.marginTop = '206px';
            }
        }
    };

    const handleClickRollBack = () => {
        navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    return (
        <Layout
            title='受入情報選択'
            isShowDate={false}
            isLoading={isLoading || isFetching}
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Collapse
                    onChange={($event) => handleChangeCollapse($event)}
                    ref={collapsedElementRef}
                    defaultActiveKey='1'
                    expandIconPosition='end'
                    className={`bg-green15 border !border-green15 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:top-header 
                    [&_.ant-collapse-header]:!p-[8px_16px]
                    [&_.ant-collapse-header]:bg-green15 
                    [&_.ant-collapse-header]:w-full 
                    [&_.ant-collapse-header]:z-10
                    [&_.ant-collapse-header]:left-0
                    [&_.ant-collapse-header]:!transition-none
                    [&_.ant-collapse-content-box]:!p-[0_0_16px]
                    [&_.ant-collapse-expand-icon]:!p-0
                    [&_.ant-collapse-expand-icon]:!m-0
                    ${
                        isOpenSearchConditions
                            ? `
                           opening 
                       [&_.ant-collapse-content]:mt-[159px]
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
                            className: 'collapse-panel-custom-weighing-info',
                            children: isOpenSearchConditions && (
                                <div className='flex flex-col'>
                                    {/* Calendar */}
                                    <div className='border-b-[6px] mt-[1px] border-grayE9'>
                                        <Calendar
                                            defaultDate={watch('receiptDate') || null}
                                            selectedDate={watch('receiptDate')}
                                            handleSelectDate={handleSelectReceiptDate}
                                        />
                                        <div className='flex items-center gap-2 border-t border-grayE9 px-4 py-4'>
                                            <div className='text-md text-green1A whitespace-nowrap min-w-[60px] md:min-w-[112px]'>
                                                実 績
                                            </div>
                                            <Controller
                                                control={control}
                                                name='recordType'
                                                render={({ field }) => (
                                                    <Radio.Group
                                                        className='flex justify-between w-full'
                                                        size='large'
                                                        defaultValue={false}
                                                        {...field}
                                                    >
                                                        <Radio
                                                            value={0}
                                                            className='text-ssm whitespace-nowrap'
                                                        >
                                                            未登録
                                                        </Radio>
                                                        <Radio
                                                            value={1}
                                                            className='text-ssm whitespace-nowrap'
                                                        >
                                                            登録済
                                                        </Radio>
                                                        <Radio
                                                            value=''
                                                            className='text-ssm whitespace-nowrap'
                                                        >
                                                            全て
                                                        </Radio>
                                                    </Radio.Group>
                                                )}
                                            />
                                        </div>
                                        <div className='flex items-center gap-2 border-t border-grayE9 p-4'>
                                            <div className='flex items-center gap-2'>
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

                                    <div className='px-4 pt-4'>
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
                                                        車輌名
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
                                                            : '車輌名で検索する'
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
                                    受入情報一覧
                                </h2>
                                <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold'>
                                    {weighingInformationData
                                        ? weighingInformationData.totalRecords
                                        : 0}
                                </span>
                            </div>
                        }
                        isShowIconRefresh
                        onClickRefresh={handleSubmit(onSubmit)}
                    />
                </div>
                <div ref={contentElementRef}>
                    {listWeighingInformation &&
                        weighingInformationData &&
                        weighingInformationData.totalRecords !== 0 &&
                        listWeighingInformation.length > 0 &&
                        listWeighingInformation.map((item, index) => (
                            <div className={`px-4 ${index === 0 ? 'pt-4' : ''}`} key={index}>
                                <div className='bg-white rounded-lg shadow-md w-full py-4 mb-4'>
                                    {/* title */}
                                    <div>
                                        <div className='flex items-center gap-3 relative'>
                                            <div className='h-[42px] absolute left-0'>
                                                {item.receiptRecordSeq ? (
                                                    <BorderLeftIcon className='h-full object-cover' />
                                                ) : (
                                                    <img
                                                        src={iconRedBorder}
                                                        className='w-full h-full object-cover'
                                                        alt='info'
                                                    />
                                                )}
                                            </div>
                                            <div className='w-full ml-6 pt-1'>
                                                <div className='flex items-center justify-between mb-2'>
                                                    <div
                                                        className={`text-md ${
                                                            item.receiptRecordSeq
                                                                ? 'text-green1A'
                                                                : 'text-red2a'
                                                        }`}
                                                    >
                                                        {item.receiptRecordSeq
                                                            ? '登録済'
                                                            : '未登録'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* info */}
                                    <div className='flex items-center gap-3 relative py-2 px-4 h-full border-b-[1px] border-grayE9'>
                                        <div className='w-full'>
                                            <div className='grid grid-cols-[75px_auto] ml-2 mb-2'>
                                                <div className='text-gray68 text-sm'>受入日：</div>
                                                <div className='text-sm text-black27 truncate w-full'>
                                                    {dayjs(item.slipDate).format('YYYY/MM/DD')}(
                                                    {WEEKDAYLIST[dayjs(item.slipDate).format('d')]})
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-[75px_auto] ml-2 mb-2'>
                                                <div className='text-gray68 text-sm'>業者名：</div>
                                                <div className='text-sm text-black27 truncate w-full'>
                                                    {item.companyName}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-[75px_auto] ml-2 mb-2'>
                                                <div className='text-gray68 text-sm'>現場名：</div>
                                                <div className='text-sm text-black27 truncate w-full'>
                                                    {item.siteName}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-[75px_auto] ml-2 mb-2'>
                                                <div className='text-gray68 text-sm'>運搬者：</div>
                                                <div className='text-sm text-black27 truncate w-full'>
                                                    {item.carrierName}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-[75px_auto] ml-2 mb-2'>
                                                <div className='text-gray68 text-sm'>車輌　：</div>
                                                <div className='text-sm text-black27 truncate w-full'>
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
                                                    item.receiptRecordSeq,
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
                                        {item.receiptRecordSeq && (
                                            <div
                                                className='w-1/2'
                                                onClick={() =>
                                                    onDeleteReceiptRecord(
                                                        item.orderType,
                                                        item.slipSystemId,
                                                        item.receiptRecordSeq,
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
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    {(listWeighingInformation.length === 0 ||
                        (weighingInformationData &&
                            weighingInformationData.totalRecords === 0)) && (
                        <div className='p-4'>
                            <div className='text-sm text-[#EDB401]'>受入情報選択はありません.</div>
                        </div>
                    )}
                    {listWeighingInformation.length < weighingInformationData?.totalRecords && (
                        <div className='px-[100px]'>
                            <Button
                                className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center'
                                onClick={handleLoadMore}
                            >
                                もっと見る
                            </Button>
                        </div>
                    )}
                </div>
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
export default WeighingInformation;
