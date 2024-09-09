/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable prefer-template */
/* eslint-disable no-unneeded-ternary */
import { Button, Checkbox, Collapse, DatePicker, Input, Radio, RadioChangeEvent, Space, Switch } from 'antd';
import Layout from 'components/templates/Layout';
import iconChevronsDown from 'assets/icons/ic_chevrons_down.svg';
import iconChevronsUp from 'assets/icons/ic_chevrons_up.svg';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';
import iconSearch from 'assets/icons/ic_search.svg';
import iconRedClear from 'assets/icons/ic_red_clear.svg';
//
import iconNote from 'assets/icons/ic_note.svg';
import iconNotePin from 'assets/icons/ic_note_pin.svg';
import iconNoteAdd from 'assets/icons/ic-note-add.svg';
import iconCalendar from 'assets/icons/ic-calendar-white.svg';
import iconEdit from 'assets/icons/ic-edit-white.svg';
import './index.scss';
import React, { useEffect, useRef, useState } from 'react';
import FuncBlock from 'components/common/FuncBlock';
import { useForm, Controller, useWatch } from 'react-hook-form';
import {
    CONSTANT_ROUTE,
    SETTING_SEARCH_DISPATCH_STATUS,
    SORT_TYPE,
    SPOT_WORK_DATE_TYPE,
    WEEKDAYLIST,
} from 'utils/constants';
import {
    saveCacheSearchConditionDispatchStatus,
    saveDispatchStatus,
    useLazyGetSearchDispatchStatusQuery,
} from 'services/dispatchStatus';
import { ParamsDispatchStatus } from 'models/dispatchStatus';
import dayjs from 'dayjs';
import ModalSelectBranch from 'components/common/Modal/ModalSelectBranch';
import ModalSelectSalePerson from 'components/common/Modal/ModalSelectSalePerson';
import ModalSelectDriver from 'components/common/Modal/ModalSelectDriver';
import ModalSelectVehicleType from 'components/common/Modal/ModalSelectVehicleType';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { openInformation } from 'utils/functions';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalSelectSortOrderFields from 'components/common/Modal/ModalSelectSortOrderFields';
import { setPreviousPage } from 'services/page';
import Calendar from 'components/common/Calendar';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';
import { FilterSvg } from 'components/icons/FilterSvg';
import { BoxIcon } from 'components/icons/BoxIcon';
import { TagIcon } from 'components/icons/TagIcon';
import { BuildingOfficeIcon } from 'components/icons/BuildingOfficeIcon';
import { RefreshIcon } from 'components/icons/RefreshIcon';
import { RefreshBorderIcon } from 'components/icons/RefreshBorderIcon';
import { WebsiteIcon } from 'components/icons/WebsiteIcon';
import { DriverIcon2 } from 'components/icons/DriverIcon2';
import { FastTruckIcon } from 'components/icons/FastTruckIcon';
import { ScheduleDateTimeIcon } from 'components/icons/ScheduleDateTimeIcon';
import locale from 'antd/es/date-picker/locale/ja_JP';
import 'dayjs/locale/ja';
import { RangePickerProps } from 'antd/es/date-picker';
import RangeCalendarModal from 'components/common/Modal/RangeCalendarModal';
import { CalendarGreenNotClockIcon } from 'components/icons/CalendarGreenNotClockIcon';

interface IFormSearchInput {
    dispatchType: number;
    isSearchWorkDate: boolean;
    dateCompareType?: number;
    workDateFrom?: string;
    workDateTo?: string;
    spotStatus?: number[];
    dispatchStatusIsReceived: boolean;
    dispatchStatusIsDispatch: boolean;
    dispatchStatusIsRecorded: boolean;
    dispatchStatusIsCancel: boolean;
    dispatchStatusIsNoCollection: boolean;
    branchCd?: number;
    branchName?: string;
    salesPersonCd?: string;
    salesPersonName?: string;
    driverCd?: string;
    driverName?: string;
    vehicleTypeCd?: string;
    vehicleTypeName?: string;
    collectionPlaceType?: number;
    collectionPlace?: string;
    sortOrder: number
    pageNumber: number;
    pageSize: number;
}

const ModalName = {
    branch: 'branch',
    salePerson: 'salePerson',
    driver: 'driver',
    vehicleType: 'vehicleType',
    sortOrderPriority: 'sortOrderPriority',
};

const dateFormat = 'YYYY年MM月DD日';
const date = new Date();

const DispatchStatus: React.FC = () => {
    const pageSizeSystemSetting = useAppSelector(
        (state) => state.reducer.systemSetting?.systemSetting?.commonPageSize,
    );
    const pageSize = pageSizeSystemSetting || DEFAULT_SYSTEM_SETTING.commonPageSize;
    const [listDispatchStatus, setListDispatchStatus] = useState([]);
    const [openModal, setOpenModal] = useState(null);
    const [openModalCalendar, setOpenModalCalendar] = useState(false);
    const [fieldNameSelected, setFieldNameSelected] = useState<any>('');
    const [fieldCdSelected, setFieldCdSelected] = useState<any>('');
    const [isSwitchAll, setIsSwitchAll] = useState(false);
    const [getDispatchStatus, { data: dispatchStatusData, isLoading, isFetching }] =
        useLazyGetSearchDispatchStatusQuery();
    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.DISPATCH_STATUS],
    );
    const location = useLocation();
    const dispatch = useAppDispatch();
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);

    const isPrioritizePreviousSearch = useAppSelector(
        (state) =>
            state.reducer.systemSetting?.systemSetting?.searchDispatchStatusDefault?.settingSearch ===
            SETTING_SEARCH_DISPATCH_STATUS.PRIORITIZE_PREVIOUS_SEARCH,
    );

    const cacheSearchCondition = useAppSelector(
        (state) => state.reducer.dispatchStatus.cacheSearchCondition,
    );

    const defaultValues: IFormSearchInput = {
        ...systemSetting?.searchDispatchStatusDefault,
        workDateFrom: systemSetting?.searchDispatchStatusDefault.isSearchWorkDate ? dayjs(new Date()).format('YYYY/MM/DD') : '',
        workDateTo: systemSetting?.searchDispatchStatusDefault.isSearchWorkDate ? dayjs(new Date()).format('YYYY/MM/DD') : '',
        pageNumber: 1,
        pageSize,
    };

    const { control, watch, setValue, getValues, handleSubmit, reset } = useForm<IFormSearchInput>({
        defaultValues: null,
    });

    const dispatchStatusIsReceived = useWatch({ control, name: 'dispatchStatusIsReceived' });
    const dispatchStatusIsDispatch = useWatch({ control, name: 'dispatchStatusIsDispatch' });
    const dispatchStatusIsRecorded = useWatch({ control, name: 'dispatchStatusIsRecorded' });
    const dispatchStatusIsCancel = useWatch({ control, name: 'dispatchStatusIsCancel' });
    const dispatchStatusIsNoCollection = useWatch({ control, name: 'dispatchStatusIsNoCollection' });

    useEffect(() => {
        let formValue = defaultValues;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (isPrioritizePreviousSearch && cacheSearchCondition) {
            formValue = cacheSearchCondition;
        }
        reset(formValue);
        handleGetData(true, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data: IFormSearchInput) => {
        handleGetData(true, true);
    };

    const handleOpenModal = (modalName, fieldCd?, fieldName?, title?) => {
        setOpenModal(modalName);
        if (fieldCd) {
            setFieldCdSelected(fieldCd);
        }

        if (fieldName) {
            setFieldNameSelected(fieldName);
        }
    };

    const handleSelectModal = (d) => {
        const fieldName: any = fieldNameSelected;
        const fieldCd: any = fieldCdSelected;
        setValue(fieldCd, d.cd);
        setValue(fieldName, d.name);
        setOpenModal(null);
    };

    const handleSelectSortOrderPriority = (d) => {
        const fieldCd: any = fieldCdSelected;
        const fieldName: any = fieldNameSelected;
        setValue(fieldCd, d.cd);
        setValue(fieldName, d.name);
        setOpenModal(null);
    };

    const handleLoadMore = () => {
        handleGetData(false, true);
    };

    const handleGetData = async (isSearch?, isSaveCondition?) => {
        const formValue = getValues();
        const spotStatus: number[] = [];
        if (formValue.dispatchStatusIsReceived) {
            spotStatus.push(1);
        }
        if (formValue.dispatchStatusIsDispatch) {
            spotStatus.push(2);
        }
        if (formValue.dispatchStatusIsRecorded) {
            spotStatus.push(3);
        }
        if (formValue.dispatchStatusIsCancel) {
            spotStatus.push(4);
        }
        if (formValue.dispatchStatusIsNoCollection) {
            spotStatus.push(5);
        }
        const paramsRequest: ParamsDispatchStatus = {
            dispatchType: formValue.dispatchType,
            dateCompareType: formValue.isSearchWorkDate
                ? formValue.dateCompareType
                : SPOT_WORK_DATE_TYPE.ALL,
            workDateFrom: (formValue.isSearchWorkDate && formValue.workDateFrom && dayjs(formValue.workDateFrom).format('YYYY/MM/DD')) || undefined,
            workDateTo: (formValue.isSearchWorkDate && formValue.workDateTo && dayjs(formValue.workDateTo).format('YYYY/MM/DD')) || undefined,
            spotStatus: (formValue.dispatchType !== 2 && spotStatus) || undefined,
            branchCd: formValue.branchCd || undefined,
            salesPersonCd: (formValue.dispatchType !== 2 && formValue.salesPersonCd) || undefined,
            driverCd: formValue.driverCd || undefined,
            vehicleTypeCd: formValue.vehicleTypeCd || undefined,
            collectionPlaceType: formValue.collectionPlaceType
                ? formValue.collectionPlaceType
                : 0,
            collectionPlace: (formValue.dispatchType !== 2 && formValue.collectionPlace) ? formValue.collectionPlace : undefined,
            sortOrder: formValue.sortOrder,
            pageNumber: isSearch ? 1 : formValue.pageNumber + 1,
            pageSize: formValue.pageSize,
        };

        const response = await getDispatchStatus(paramsRequest).unwrap();
        if (response) {
            setValue('pageNumber', paramsRequest.pageNumber);
            if (isSearch) {
                setListDispatchStatus(response.items);
            } else {
                setListDispatchStatus([...listDispatchStatus, ...response.items]);
            }
        }
        if (isSaveCondition) {
            dispatch(saveCacheSearchConditionDispatchStatus(formValue));
        }
    };

    useEffect(() => {
        if (dispatchStatusIsReceived && dispatchStatusIsDispatch && dispatchStatusIsRecorded && dispatchStatusIsCancel && dispatchStatusIsNoCollection) {
            setIsSwitchAll(true);
        } else {
            setIsSwitchAll(false);
        }
    }, [dispatchStatusIsReceived, dispatchStatusIsDispatch, dispatchStatusIsRecorded, dispatchStatusIsCancel, dispatchStatusIsNoCollection]);


    const handelSwitchAllSpotStaus = (checked: boolean) => {
        if (checked) {
            setValue('dispatchStatusIsReceived', true);
            setValue('dispatchStatusIsDispatch', true);
            setValue('dispatchStatusIsRecorded', true);
            setValue('dispatchStatusIsCancel', true);
            setValue('dispatchStatusIsNoCollection', true);
        } else {
            setValue('dispatchStatusIsReceived', false);
            setValue('dispatchStatusIsDispatch', false);
            setValue('dispatchStatusIsRecorded', false);
            setValue('dispatchStatusIsCancel', false);
            setValue('dispatchStatusIsNoCollection', false);
        }
    };

    const handleClickRollBack = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    const handleClickSiteNoteList = (item) => {
        dispatch(saveDispatchStatus(item));
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.SITE_NOTES,
            }),
        );
        navigate(
            `/${CONSTANT_ROUTE.SITE_NOTES}?dispatchStatus=true&companyCd=${item.companyCd}&siteCd=${item.siteCd}`,
        );
    };

    const handleClickSiteNoteInput = (item) => {
        dispatch(saveDispatchStatus(item));
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.SITE_NOTE_INPUT,
            }),
        );

        navigate(
            `/${CONSTANT_ROUTE.SITE_NOTE_INPUT}?dispatchStatus=true&companyCd=${item.companyCd}&siteCd=${item.siteCd}`,
        );
    };

    const handelSwitchWorkDate = (checked: boolean) => {
        if (checked) {
            setValue('isSearchWorkDate', true);

            setValue('workDateFrom', dayjs(date).format('YYYY/MM/DD'));
            setValue('workDateTo', dayjs(date).format('YYYY/MM/DD'));
        } else {
            setValue('isSearchWorkDate', false);
            setValue('workDateFrom', '');
            setValue('workDateTo', '');
        }
    };

    const changeDispatchType = ({ target: { value } }: RadioChangeEvent) => {
        setValue('dispatchType', value);
        if (value === 2) {
            setValue('dateCompareType', 1);
            setValue('dispatchStatusIsReceived', false);
            setValue('dispatchStatusIsDispatch', false);
            setValue('dispatchStatusIsRecorded', false);
            setValue('dispatchStatusIsCancel', false);
            setValue('dispatchStatusIsNoCollection', false);
            setValue('collectionPlace', undefined);
            setValue('salesPersonCd', undefined);
            setValue('salesPersonName', '');
        }
    };

    const disabledDateTo: RangePickerProps['disabledDate'] = (current) => (
        (current && current > dayjs(watch('workDateTo')).endOf('day'))
    );

    const disabledDateFrom: RangePickerProps['disabledDate'] = (current) => (
        (current && current < dayjs(watch('workDateFrom')).startOf('day'))
    );


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
                if (documentElement.scrollTop >= 941) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '159px';
                    elementFixedOnScroll.style.zIndex = '10';
                    elementFixedOnScroll.style.borderTop = '1px solid white';
                    content.style.marginTop = '65px';
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
                content.style.marginTop = '222px';
            }
        }
    };

    const handleSelectModalCalendar = (d) => {
        setValue('workDateFrom', d.workDateFrom);
        setValue('workDateTo', d.workDateTo);
        setOpenModalCalendar(false);
    };

    return (
        <Layout
            title='配車状況一覧'
            isShowDate={false}
            isLoading={isLoading || isFetching}
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Collapse
                    onChange={($event) => handleChangeCollapse($event)}
                    defaultActiveKey='1'
                    expandIconPosition='end'
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
                    subchildren ${isOpenSearchConditions
                            ? `
                           opening 
                       [&_.ant-collapse-content]:mt-[157px]
                       `
                            : ``
                        }`}
                    expandIcon={({ isActive }) =>
                        isActive ? (
                            <div className='w-5 h-5'>
                                <img
                                    src={iconChevronUp}
                                    className='w-full h-full'
                                    alt='info'
                                />
                            </div>
                        ) : (
                            <div className='w-5 h-5'>
                                <img
                                    src={iconChevronDown}
                                    className='w-full h-full'
                                    alt='info'
                                />
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
                            className: 'collapse-panel-custom-dispath-status',
                            children: isOpenSearchConditions && (
                                <div className='flex flex-col'>
                                    <div
                                        className='px-4 border-b-[6px] border-grayE9 pb-4'>
                                        <Controller
                                            control={
                                                control
                                            }
                                            name='dispatchType'
                                            render={({
                                                field,
                                            }) => (
                                                <Radio.Group
                                                    className='flex justify-between dispatch-radio dispatch-type'
                                                    size='large'
                                                    {...field}
                                                    onChange={changeDispatchType}
                                                >
                                                    <Radio
                                                        value={
                                                            1
                                                        }
                                                        className='text-ssm'
                                                    >
                                                        スポットのみ
                                                    </Radio>
                                                    <Radio
                                                        value={
                                                            2
                                                        }
                                                        className='text-ssm'
                                                    >
                                                        コースのみ
                                                    </Radio>
                                                    <Radio
                                                        value={
                                                            0
                                                        }
                                                        className='text-ssm'
                                                    >
                                                        全て
                                                    </Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                    </div>
                                    <div className='p-4 pb-0'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <Controller
                                                control={
                                                    control
                                                }
                                                name='isSearchWorkDate'
                                                render={({
                                                    field,
                                                }) => (
                                                    <Switch
                                                        {...field}
                                                        onChange={
                                                            handelSwitchWorkDate
                                                        }
                                                        checked={
                                                            field.value
                                                        }
                                                    />
                                                )}
                                            />
                                            <div className='text-md text-green1A'>
                                                作業日
                                            </div>
                                        </div>
                                        <Controller
                                            control={
                                                control
                                            }
                                            name='dateCompareType'
                                            render={({
                                                field,
                                            }) => (
                                                <Radio.Group
                                                    className='flex justify-between mb-1 dispatch-radio'
                                                    size='large'
                                                    {...field}
                                                    disabled={!watch('isSearchWorkDate')}
                                                >
                                                    <Radio
                                                        value={
                                                            0
                                                        }
                                                        className='text-ssm'
                                                        disabled={!watch('isSearchWorkDate') || watch('dispatchType') === 2}
                                                    >
                                                        一致
                                                    </Radio>
                                                    <Radio
                                                        value={
                                                            1
                                                        }
                                                        className='text-ssm'
                                                    >
                                                        未指定
                                                    </Radio>
                                                    <Radio
                                                        value={
                                                            2
                                                        }
                                                        className='text-ssm'
                                                    >
                                                        一致+未指定
                                                    </Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                        {/* Calendar */}
                                        {/* <div className='bg-success'>test</div> */}
                                        {/* <div className='mt-2 flex items-center'>
                                            <Controller
                                                control={control}
                                                name='workDateFrom'
                                                render={({ field }) => (
                                                    <DatePicker
                                                        size='large'
                                                        locale={locale}
                                                        format={dateFormat}
                                                        disabled={!watch('isSearchWorkDate')}
                                                        disabledDate={disabledDateTo}
                                                        placeholder='開始日付'
                                                        ref={field.ref}
                                                        name={field.name}
                                                        onBlur={field.onBlur}
                                                        value={field.value ? dayjs(field.value) : null}
                                                        onChange={(d) => {
                                                            field.onChange(d ? d.valueOf() : null);
                                                        }}
                                                    />
                                                )}
                                            />
                                            <span className='mx-1'>～</span>
                                            <Controller
                                                control={control}
                                                name='workDateTo'
                                                render={({ field }) => (
                                                    <DatePicker
                                                        disabled={!watch('isSearchWorkDate')}
                                                        disabledDate={disabledDateFrom}
                                                        placeholder='終了日付'
                                                        size='large'
                                                        locale={locale}
                                                        format={dateFormat}
                                                        ref={field.ref}
                                                        name={field.name}
                                                        onBlur={field.onBlur}
                                                        value={field.value ? dayjs(field.value) : null}
                                                        onChange={(d) => {
                                                            field.onChange(d ? d.valueOf() : null);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div> */}
                                    </div>
                                    {/* Calendar */}
                                    <div className='border-b-[6px] border-grayE9 p-4 pt-0'>
                                        <div className='text-green1A text-md mb-1'>作業日</div>
                                        <div className='flex justify-between items-center'>
                                            <div className='pe-1'>
                                                <Controller
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Input
                                                            {...field}
                                                            readOnly
                                                            size='middle'
                                                            className='!border-grayD4'
                                                            prefix={
                                                                <div className='w-5 h-5'>
                                                                    <CalendarGreenNotClockIcon className='w-full h-full object-cover' />
                                                                </div>
                                                            }
                                                            disabled={!watch('isSearchWorkDate')}
                                                            onClick={() => setOpenModalCalendar(true)}
                                                        />
                                                    )}
                                                    name='workDateFrom'
                                                    control={
                                                        control
                                                    }
                                                    defaultValue=''
                                                />
                                            </div>
                                            <div>～</div>
                                            <div className='ps-1'>
                                                <Controller
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Input
                                                            {...field}
                                                            readOnly
                                                            size='middle'
                                                            className='!border-grayD4'
                                                            prefix={
                                                                <div className='w-5 h-5'>
                                                                    <CalendarGreenNotClockIcon className='w-full h-full object-cover' />
                                                                </div>
                                                            }
                                                            disabled={!watch('isSearchWorkDate')}
                                                            onClick={() => setOpenModalCalendar(true)}
                                                        />
                                                    )}
                                                    name='workDateTo'
                                                    control={
                                                        control
                                                    }
                                                    defaultValue=''
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='border-b-[6px] border-grayE9 p-4'>
                                        <div className='flex gap-2 text-md mb-2'>
                                            <div className='text-green1A min-w-[112px]'>
                                                配車状況
                                            </div>
                                            <div>
                                                <span className='mr-2'>
                                                    すべて
                                                </span>
                                                <Switch
                                                    checked={isSwitchAll}
                                                    onChange={handelSwitchAllSpotStaus}
                                                    disabled={watch('dispatchType') === 2}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex w-full flex-wrap gap-2 gap-x-6 px-3'>
                                            <div className='flex items-center text-sm gap-x-2'>
                                                <Controller
                                                    control={
                                                        control
                                                    }
                                                    name='dispatchStatusIsReceived'
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Switch
                                                            {...field}
                                                            disabled={watch('dispatchType') === 2}
                                                            checked={
                                                                field.value
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span>
                                                    受注
                                                </span>
                                            </div>
                                            <div className='flex items-center text-sm gap-x-2'>
                                                <Controller
                                                    control={
                                                        control
                                                    }
                                                    name='dispatchStatusIsDispatch'
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Switch
                                                            {...field}
                                                            disabled={watch('dispatchType') === 2}
                                                            checked={
                                                                field.value
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span>
                                                    配車
                                                </span>
                                            </div>
                                            <div className='flex items-center text-sm gap-x-2'>
                                                <Controller
                                                    control={
                                                        control
                                                    }
                                                    name='dispatchStatusIsRecorded'
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Switch
                                                            {...field}
                                                            disabled={watch('dispatchType') === 2}
                                                            checked={
                                                                field.value
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span>
                                                    計上
                                                </span>
                                            </div>
                                            {/*  */}
                                            <div className='flex items-center text-sm gap-x-2'>
                                                <Controller
                                                    control={
                                                        control
                                                    }
                                                    name='dispatchStatusIsNoCollection'
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Switch
                                                            {...field}
                                                            disabled={watch('dispatchType') === 2}
                                                            checked={
                                                                field.value
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span>
                                                    回収無し
                                                </span>
                                            </div>
                                            {/*  */}
                                            <div className='flex items-center text-sm gap-x-2'>
                                                <Controller
                                                    control={
                                                        control
                                                    }
                                                    name='dispatchStatusIsCancel'
                                                    render={({
                                                        field,
                                                    }) => (
                                                        <Switch
                                                            {...field}
                                                            disabled={watch('dispatchType') === 2}
                                                            checked={
                                                                field.value
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span>
                                                    キャンセル
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2 border-b-[6px] border-grayE9 p-4'>
                                        <div className='text-md text-green1A whitespace-nowrap min-w-[60px]'>
                                            拠点
                                        </div>
                                        <Controller
                                            render={({
                                                field,
                                            }) => (
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    size='middle'
                                                    className='!border-grayD4'
                                                    onChange={handleSubmit(
                                                        onSubmit,
                                                    )}
                                                    prefix={
                                                        <div className='w-5 h-5'>
                                                            <img
                                                                src={
                                                                    iconSearch
                                                                }
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
                                                                    setValue(
                                                                        'branchName',
                                                                        null,
                                                                    );
                                                                    setValue(
                                                                        'branchCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        iconRedClear
                                                                    }
                                                                    alt='iconRedClear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                            name='branchName'
                                            control={
                                                control
                                            }
                                            defaultValue=''
                                        />
                                        <Button
                                            className='border-green15 min-w-[40px]'
                                            icon={
                                                <div className='w-6 h-6'>
                                                    <FilterSvg className='w-full h-full object-cover' />
                                                </div>
                                            }
                                            size='large'
                                            onClick={() =>
                                                handleOpenModal(
                                                    ModalName.branch,
                                                    'branchCd',
                                                    'branchName',
                                                )
                                            }
                                        />
                                    </div>
                                    <div className='flex items-center gap-2 border-b-[6px] border-grayE9 p-4'>
                                        <div className='text-md text-green1A whitespace-nowrap'>
                                            営業者
                                        </div>
                                        <Controller
                                            render={({
                                                field,
                                            }) => (
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    size='middle'
                                                    className='!border-grayD4'
                                                    disabled={watch('dispatchType') === 2}
                                                    onChange={handleSubmit(
                                                        onSubmit,
                                                    )}
                                                    prefix={
                                                        <div className='w-5 h-5'>
                                                            <img
                                                                src={
                                                                    iconSearch
                                                                }
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
                                                                    setValue(
                                                                        'salesPersonName',
                                                                        null,
                                                                    );
                                                                    setValue(
                                                                        'salesPersonCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        iconRedClear
                                                                    }
                                                                    alt='iconRedClear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                            name='salesPersonName'
                                            control={
                                                control
                                            }
                                            defaultValue=''
                                        />
                                        <Button
                                            className='border-green15 min-w-[40px]'
                                            disabled={watch('dispatchType') === 2}
                                            icon={
                                                <div className='w-6 h-6'>
                                                    <FilterSvg className='w-full h-full object-cover' />
                                                </div>
                                            }
                                            size='large'
                                            onClick={() =>
                                                handleOpenModal(
                                                    ModalName.salePerson,
                                                    'salesPersonCd',
                                                    'salesPersonName',
                                                )
                                            }
                                        />
                                    </div>
                                    <div className='flex items-center gap-2 border-b-[6px] border-grayE9 p-4'>
                                        <div className='text-md text-green1A whitespace-nowrap'>
                                            運転者
                                        </div>
                                        <Controller
                                            render={({
                                                field,
                                            }) => (
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    size='middle'
                                                    className='!border-grayD4'
                                                    onChange={handleSubmit(
                                                        onSubmit,
                                                    )}
                                                    prefix={
                                                        <div className='w-5 h-5'>
                                                            <img
                                                                src={
                                                                    iconSearch
                                                                }
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
                                                                    setValue(
                                                                        'driverName',
                                                                        null,
                                                                    );
                                                                    setValue(
                                                                        'driverCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        iconRedClear
                                                                    }
                                                                    alt='iconRedClear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                            name='driverName'
                                            control={
                                                control
                                            }
                                            defaultValue=''
                                        />
                                        <Button
                                            className='border-green15 min-w-[40px]'
                                            icon={
                                                <div className='w-6 h-6'>
                                                    <FilterSvg className='w-full h-full object-cover' />
                                                </div>
                                            }
                                            size='large'
                                            onClick={() =>
                                                handleOpenModal(
                                                    ModalName.driver,
                                                    'driverCd',
                                                    'driverName',
                                                )
                                            }
                                        />
                                    </div>
                                    <div className='flex items-center gap-2 border-b-[6px] border-grayE9 p-4'>
                                        <div className='text-md text-green1A whitespace-nowrap min-w-[60px]'>
                                            車種
                                        </div>
                                        <Controller
                                            render={({
                                                field,
                                            }) => (
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    size='middle'
                                                    className='!border-grayD4'
                                                    onChange={handleSubmit(
                                                        onSubmit,
                                                    )}
                                                    prefix={
                                                        <div className='w-5 h-5'>
                                                            <img
                                                                src={
                                                                    iconSearch
                                                                }
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
                                                                    setValue(
                                                                        'vehicleTypeName',
                                                                        null,
                                                                    );
                                                                    setValue(
                                                                        'vehicleTypeCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        iconRedClear
                                                                    }
                                                                    alt='iconRedClear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                            name='vehicleTypeName'
                                            control={
                                                control
                                            }
                                            defaultValue=''
                                        />
                                        <Button
                                            className='border-green15 min-w-[40px]'
                                            icon={
                                                <div className='w-6 h-6'>
                                                    <FilterSvg className='w-full h-full object-cover' />
                                                </div>
                                            }
                                            size='large'
                                            onClick={() =>
                                                handleOpenModal(
                                                    ModalName.vehicleType,
                                                    'vehicleTypeCd',
                                                    'vehicleTypeName',
                                                )
                                            }
                                        />
                                    </div>
                                    <div className='p-4 border-b-[6px] border-grayE9'>
                                        <div className='text-md text-green1A mb-1'>
                                            回収場所
                                        </div>
                                        <Controller
                                            control={
                                                control
                                            }
                                            name='collectionPlaceType'
                                            render={({
                                                field,
                                            }) => (
                                                <Radio.Group
                                                    {...field}
                                                    className='flex justify-between mb-2'
                                                    size='large'
                                                    disabled={watch('dispatchType') === 2}
                                                >
                                                    <Radio
                                                        value={
                                                            0
                                                        }
                                                        className='text-sm'
                                                    >
                                                        業者名
                                                    </Radio>
                                                    <Radio
                                                        value={
                                                            1
                                                        }
                                                        className='text-sm'
                                                    >
                                                        現場名
                                                    </Radio>
                                                    <Radio
                                                        value={
                                                            2
                                                        }
                                                        className='text-sm'
                                                    >
                                                        住所
                                                    </Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                        <Controller
                                            render={({
                                                field,
                                            }) => (
                                                <Input
                                                    {...field}
                                                    size='middle'
                                                    allowClear={{
                                                        clearIcon:
                                                            (
                                                                <div className='w-5 h-5'>
                                                                    <img
                                                                        className='w-full h-full object-cover'
                                                                        src={
                                                                            iconRedClear
                                                                        }
                                                                        alt='iconRedClear'
                                                                    />
                                                                </div>
                                                            ),
                                                    }}
                                                    className='!border-grayD4'
                                                    placeholder='回収場所の条件を入力'
                                                    disabled={watch('dispatchType') === 2}
                                                    onBlur={handleSubmit(
                                                        onSubmit,
                                                    )}
                                                    prefix={
                                                        <div className='w-5 h-5'>
                                                            <img
                                                                src={
                                                                    iconSearch
                                                                }
                                                                className='w-full h-full object-cover'
                                                                alt='iconSearch'
                                                            />
                                                        </div>
                                                    }
                                                />
                                            )}
                                            name='collectionPlace'
                                            control={
                                                control
                                            }
                                            defaultValue=''
                                        />
                                    </div>
                                    <div className='flex items-center gap-2 px-4 pt-4'>
                                        <div className='text-md text-green1A whitespace-nowrap'>
                                            並び順
                                        </div>
                                        <Input
                                            readOnly
                                            size='middle'
                                            className='!border-grayD4 h-[43.14px]'
                                            onChange={handleSubmit(
                                                onSubmit,
                                            )}
                                            value='作業日'
                                        />
                                        <div className='flex items-center'>
                                            <button
                                                type='button'
                                                className={`rounded border ${watch(
                                                    'sortOrder',
                                                ) ===
                                                    SORT_TYPE.ASCENDING
                                                    ? 'border-green15'
                                                    : 'border-gray93'
                                                    } h-[44px] min-w-[44px] mr-2 text-center bg-white`}
                                                onClick={() =>
                                                    setValue(
                                                        'sortOrder',
                                                        SORT_TYPE.ASCENDING,
                                                    )
                                                }
                                            >
                                                <svg
                                                    width='30'
                                                    height='24'
                                                    viewBox='0 0 30 24'
                                                    className={`m-auto ${watch(
                                                        'sortOrder',
                                                    ) ===
                                                        SORT_TYPE.ASCENDING
                                                        ? 'fill-green15'
                                                        : 'fill-gray93'
                                                        }`}
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <g clipPath='url(#clip0_1267_31520)'>
                                                        <path d='M21.9439 21.613C22.5993 21.613 23.1317 22.1481 23.1317 22.8066C23.1317 23.4652 22.5993 24.0002 21.9439 24.0002L1.43775 23.9752C0.782422 23.9752 0.25 23.4401 0.25 22.7816C0.25 22.123 0.782422 21.588 1.43775 21.588L21.9439 21.613ZM16.7913 8.01331C16.3433 8.46525 15.6132 8.46809 15.1635 8.01786C14.7137 7.56763 14.7109 6.83394 15.1589 6.38201L21.1691 0.340596C21.6171 -0.111343 22.3466 -0.114189 22.7964 0.336043L28.9124 6.4782C29.3627 6.93014 29.3627 7.6661 28.9124 8.11804C28.4627 8.57055 27.7303 8.57055 27.2806 8.11804L23.139 3.95668L23.1572 15.7048C23.1572 16.3423 22.6417 16.8603 22.0074 16.8603C21.373 16.8603 20.8581 16.3423 20.8581 15.7048L20.84 3.94358L16.7913 8.01331ZM9.97066 2.31057C10.626 2.31057 11.1584 2.84618 11.1584 3.50474C11.1584 4.16272 10.626 4.69833 9.97066 4.69833L1.43775 4.68923C0.782422 4.68923 0.25 4.15362 0.25 3.49506C0.25 2.83707 0.782422 2.30146 1.43775 2.30146L9.97066 2.31057ZM12.3116 12.0273C12.967 12.0273 13.4994 12.5623 13.4994 13.2209C13.4994 13.8794 12.967 14.4144 12.3116 14.4144L1.43775 14.4014C0.782422 14.4014 0.25 13.8663 0.25 13.2078C0.25 12.5498 0.782422 12.0142 1.43775 12.0142L12.3116 12.0273Z' />
                                                    </g>
                                                    <defs>
                                                        <clipPath id='clip0_1267_31520'>
                                                            <rect
                                                                width='29'
                                                                height='24'
                                                                fill='white'
                                                                transform='translate(0.25)'
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </button>

                                            <button
                                                type='button'
                                                className={`rounded border ${watch(
                                                    'sortOrder',
                                                ) ===
                                                    SORT_TYPE.DESCENDING
                                                    ? 'border-green15'
                                                    : 'border-gray93'
                                                    } h-[44px] min-w-[44px] text-center bg-white`}
                                                onClick={() =>
                                                    setValue(
                                                        'sortOrder',
                                                        SORT_TYPE.DESCENDING,
                                                    )
                                                }
                                            >
                                                <svg
                                                    width='30'
                                                    height='24'
                                                    viewBox='0 0 30 24'
                                                    className={`m-auto ${watch(
                                                        'sortOrder',
                                                    ) ===
                                                        SORT_TYPE.DESCENDING
                                                        ? 'fill-green15'
                                                        : 'fill-gray93'
                                                        }`}
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <g clipPath='url(#clip0_1267_31532)'>
                                                        <path d='M7.55608 2.38697C6.90074 2.38697 6.36832 1.85193 6.36832 1.19338C6.36832 0.53482 6.90074 -0.000221299 7.55608 -0.000221242L28.0622 0.0248259C28.7176 0.024826 29.25 0.559866 29.25 1.21842C29.25 1.87698 28.7176 2.41202 28.0622 2.41202L7.55608 2.38697ZM12.7087 15.9867C13.1567 15.5347 13.8868 15.5319 14.3365 15.9821C14.7863 16.4324 14.7891 17.1661 14.3411 17.618L8.33092 23.6594C7.88289 24.1113 7.15336 24.1142 6.70363 23.664L0.587578 17.5218C0.137286 17.0699 0.137286 16.3339 0.587579 15.882C1.0373 15.4294 1.76967 15.4294 2.2194 15.882L6.36096 20.0433L6.34283 8.29519C6.34283 7.65769 6.85826 7.13973 7.49264 7.13973C8.12701 7.13973 8.64188 7.65769 8.64188 8.29519L8.66 20.0564L12.7087 15.9867ZM19.5293 21.6894C18.874 21.6894 18.3416 21.1538 18.3416 20.4953C18.3416 19.8373 18.874 19.3017 19.5293 19.3017L28.0622 19.3108C28.7176 19.3108 29.25 19.8464 29.25 20.5049C29.25 21.1629 28.7176 21.6985 28.0622 21.6985L19.5293 21.6894ZM17.1884 11.9727C16.533 11.9727 16.0006 11.4377 16.0006 10.7791C16.0006 10.1206 16.533 9.58555 17.1884 9.58555L28.0622 9.59864C28.7176 9.59864 29.25 10.1337 29.25 10.7922C29.25 11.4502 28.7176 11.9858 28.0622 11.9858L17.1884 11.9727Z' />
                                                    </g>
                                                    <defs>
                                                        <clipPath id='clip0_1267_31532'>
                                                            <rect
                                                                width='29'
                                                                height='24'
                                                                fill='white'
                                                                transform='translate(29.25 24) rotate(-180)'
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />
                <div className='bg-green15 py-2' ref={fixedElementRef}>
                    <FuncBlock
                        leftChild={
                            <div className='flex items-center '>
                                <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                    配車状況一覧
                                </h2>
                                <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold'>
                                    {dispatchStatusData ? dispatchStatusData.totalRecords : 0}
                                </span>
                            </div>
                        }
                        isShowIconRefresh
                        onClickRefresh={handleSubmit(onSubmit)}
                    />
                </div>

                <div ref={contentElementRef}>
                    {listDispatchStatus &&
                        dispatchStatusData &&
                        dispatchStatusData.totalRecords !== 0 &&
                        listDispatchStatus.length > 0 &&
                        listDispatchStatus.map((item, index) => (
                            <div className={`px-4 ${index === 0 ? 'pt-4' : ''}`} key={index}>
                                <div className='bg-white rounded-lg shadow-md w-full py-4 mb-4'>
                                    <div className='flex justify-between items-center px-4 pb-3 mb-4 border-b-[2px] border-grayE9'>
                                        <div className='text-green1A text-sm'>
                                            {item.slipType === '収集'
                                                ? 'スポット(収集)'
                                                : item.slipType === '出荷'
                                                    ? 'スポット(出荷)'
                                                    : 'コース'}
                                        </div>
                                        <div className='flex items-center'>
                                            {!item.mobileDispatchSlipNo && (
                                                <span className='text-green1A'>
                                                    (回収状況：)
                                                </span>
                                            )}
                                            {item.slipType && item.mobileDispatchSlipNo && (
                                                <span className='text-green1A'>
                                                    (回収状況：{item.isExclusion ? '作業なし' : item.collectionStatus === '0' ? '未回収' : '回収済'})
                                                </span>
                                            )}
                                            {!item.slipType && item.mobileDispatchSlipNo && (
                                                <span className='text-green1A'>
                                                    (回収状況：未 {item.unclosedCnt} 済{' '}
                                                    {item.closedCnt} 無 {item.excludeCnt})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* <div className='text-green1A text-sm px-4 pb-3 mb-4 border-b-[2px] border-grayE9'>
                                        {item.slipType === '収集' ? '[スポット(収集)]' : item.slipType === '出荷' ? '[スポット(出荷)]' : '[コース]'}
                                    </div> */}

                                    {/* title */}
                                    <div className='pb-3'>
                                        <div className='flex items-center gap-3 h-[54px] relative'>
                                            <div className='w-full ml-6 pt-1'>
                                                <div className='flex items-center justify-between mb-2'>
                                                    <div className='text-md'>{item.branchName}</div>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='text-xl truncate'>
                                                        {item.slipType
                                                            ? item.dispatchStatusName +
                                                            '　　伝票番号：' +
                                                            item.dispatchSlipNo
                                                            : '伝票番号：' + item.dispatchSlipNo}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* info */}
                                    <div className='flex items-center gap-3 relative py-3 mt-3 border-t-[1px] border-grayE9 px-4 h-full'>
                                        <div className='w-full'>
                                            {item.slipType && (
                                                <>
                                                    <div className='flex items-center gap-2 ml-2 mb-2'>
                                                        <div className='w-6 h-6'>
                                                            <BuildingOfficeIcon className='w-full h-full object-cover' />
                                                        </div>
                                                        <div className='text-sm text-[#3C3C3C] truncate w-3/4'>
                                                            {item.companyName}
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2 ml-2 mb-2'>
                                                        <div className='w-6 h-6'>
                                                            <WebsiteIcon className='w-full h-full object-cover' />
                                                        </div>
                                                        <div className='text-sm text-[#3C3C3C] truncate w-3/4'>
                                                            {item.siteName}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {!item.slipType && (
                                                <div className='flex items-center gap-2 ml-2 mb-2'>
                                                    <div className='w-6 h-6'>
                                                        <BuildingOfficeIcon className='w-full h-full object-cover' />
                                                    </div>
                                                    <div className='text-sm text-[#3C3C3C] truncate'>
                                                        {item.courseName}
                                                    </div>
                                                </div>
                                            )}
                                            <div className='flex items-start gap-2 ml-2 mb-2'>
                                                <div className='w-6 h-6'>
                                                    <ScheduleDateTimeIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-[#3C3C3C] truncate'>
                                                    {item.workDate
                                                        ? dayjs(item.workDate).format('YYYY/MM/DD') +
                                                        '(' +
                                                        WEEKDAYLIST[
                                                        dayjs(item.workDate).format('d')
                                                        ] +
                                                        ')'
                                                        : ''}
                                                    {item.slipType !== '' &&
                                                        item.arrivalTimeName &&
                                                        item.arrivalTime && (
                                                            <span>
                                                                <br />
                                                                {item.arrivalTimeName}
                                                                <span> </span>
                                                                {item.arrivalTime.slice(
                                                                    0,
                                                                    item.arrivalTime.length - 3,
                                                                )}
                                                            </span>
                                                        )}
                                                    {item.slipType === '' &&
                                                        !(!item.startTime && !item.endTime) && (
                                                            <span>
                                                                <br />
                                                                {item.startTime}～{item.endTime}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 ml-2 mb-2'>
                                                <div className='w-6 h-6'>
                                                    <DriverIcon2 className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-[#3C3C3C] truncate'>
                                                    {item.driverName && <span>{item.driverName}</span>}
                                                </div>
                                            </div>
                                            <div
                                                className={`flex items-center gap-2 ml-2 ${item.slipType ? 'mb-2' : ''
                                                    }`}
                                            >
                                                <div className='w-6 h-6'>
                                                    <FastTruckIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-[#3C3C3C] truncate'>
                                                    {item.vehicleName}
                                                </div>
                                            </div>
                                            {item.slipType && (
                                                <>
                                                    <div className='flex items-center gap-2 ml-2 mb-2'>
                                                        <div className='w-6 h-6'>
                                                            <TagIcon className='w-full h-full object-cover' />
                                                        </div>
                                                        <div className='text-sm text-[#3C3C3C] truncate'>
                                                            {item.productList && (
                                                                <span>
                                                                    {item.productList?.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2 ml-2'>
                                                        <div className='w-6 h-6'>
                                                            <BoxIcon className='w-full h-full object-cover' />
                                                        </div>
                                                        <div className='text-sm text-[#3C3C3C] truncate'>
                                                            {item.containerSetCnt !== 0 && (
                                                                <span>
                                                                    設置（{item.containerSetCnt}）
                                                                </span>
                                                            )}
                                                            {item.containerAgeCnt !== 0 && (
                                                                <span>
                                                                    引揚（{item.containerAgeCnt}）
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {item.slipType && (<div className='absolute top-0 right-0 py-3 px-4'>
                                            <div
                                                className='w-8 h-8 mb-1'
                                                onClick={() => handleClickSiteNoteList(item)}
                                            >
                                                <img
                                                    src={
                                                        item.siteNoteExistsFlg ? iconNotePin : iconNote
                                                    }
                                                    alt={
                                                        item.siteNoteExistsFlg
                                                            ? 'iconNotePin'
                                                            : 'iconNote'
                                                    }
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                            <div
                                                className='w-8 h-8'
                                                onClick={() => handleClickSiteNoteInput(item)}
                                            >
                                                <img
                                                    src={iconNoteAdd}
                                                    alt='iconNoteAdd'
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                        </div>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    {(listDispatchStatus.length === 0 ||
                        (dispatchStatusData && dispatchStatusData.totalRecords === 0)) && (
                            <div className='p-4'>
                                <div className='text-sm text-[#EDB401]'>配車状況はありません.</div>
                            </div>
                        )}
                    {listDispatchStatus.length < dispatchStatusData?.totalRecords && (
                        <div className='px-[100px] pb-2'>
                            <Button
                                className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center'
                                onClick={handleLoadMore}
                            >
                                もっと見る
                            </Button>
                        </div>
                    )}
                </div>
                {openModal === ModalName.branch && (
                    <ModalSelectBranch
                        open={openModal === ModalName.branch}
                        setOpen={setOpenModal}
                        handleSelectItem={handleSelectModal}
                    />
                )}

                {openModal === ModalName.salePerson && (
                    <ModalSelectSalePerson
                        open={openModal === ModalName.salePerson}
                        setOpen={setOpenModal}
                        handleSelectItem={handleSelectModal}
                    />
                )}

                {openModal === ModalName.driver && (
                    <ModalSelectDriver
                        open={openModal === ModalName.driver}
                        setOpen={setOpenModal}
                        handleSelectItem={handleSelectModal}
                    />
                )}

                {openModal === ModalName.vehicleType && (
                    <ModalSelectVehicleType
                        open={openModal === ModalName.vehicleType}
                        setOpen={setOpenModal}
                        handleSelectItem={handleSelectModal}
                    />
                )}

                <ModalSelectSortOrderFields
                    open={openModal === ModalName.sortOrderPriority}
                    setOpen={setOpenModal}
                    handleSelectItem={handleSelectSortOrderPriority}
                />

                {openModalCalendar && (
                    <RangeCalendarModal
                        workDateFrom={watch('workDateFrom')}
                        workDateTo={watch('workDateTo')}
                        open={openModalCalendar}
                        setOpen={setOpenModalCalendar}
                        handleSelectItem={handleSelectModalCalendar}
                    />
                )}
            </form>
        </Layout>
    );
};
export default DispatchStatus;
