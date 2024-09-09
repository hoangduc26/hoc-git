// eslint-disable-line @typescript-eslint/no-explicit-any
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-template */
import { Button, Collapse, Input, Radio, Space, Switch } from 'antd';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import iconRedBorder from 'assets/icons/ic_red_border.svg';
import iconLink from 'assets/icons/ic_link.svg';
import iconSearch from 'assets/icons/ic_search.svg';
import iconRedClear from 'assets/icons/ic_red_clear.svg';
import iconClock from 'assets/icons/ic_clock.svg';
import iconRedDelete from 'assets/icons/ic-red-delete.svg';
import FuncBlock from 'components/common/FuncBlock';
import Layout from 'components/templates/Layout';
import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import { saveSiteNotes, useLazyPostSearchQuery } from 'services/siteNotes';
import { ParamsQuerySearch, ParamsSiteNotes } from 'models';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { CONSTANT_ROUTE, SOURCE_CONST } from 'utils/constants';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setPreviousPage } from 'services/page';
import { useLazyGetSitesByCompanyQuery } from 'services/sites';
import { useLazyGetInfoCollectionQuery } from 'services/collection';
import SiteNoteModal from 'components/common/Modal/SiteNoteModal';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';
import { FilterSvg } from 'components/icons/FilterSvg';
import { BuildingOfficeIcon } from 'components/icons/BuildingOfficeIcon';
import { EyeIcon } from 'components/icons/EyeIcon';
import { WebsiteIcon } from 'components/icons/WebsiteIcon';
import { CpuIcon } from 'components/icons/CpuIcon';
import { DisplayIcon } from 'components/icons/DisplayIcon';
import { RegisterIcon } from 'components/icons/RegisterIcon';

interface IFormSearchInput {
    isHidden: boolean;
    customerCd: string;
    customerName: string;
    includeEmptyCustomer: boolean;
    companyCd: string;
    companyName: string;
    includeEmptyCompany: boolean;
    siteCd: string;
    siteName: string;
    includeEmptySite: boolean;
    siteNoteTypeCd: string;
    siteNoteTypeName: string;
    registeredBy: string;
    registeredName: string;
    sourceCd: string;
    sourceName: string;
    sourceNumber: number;
    sourceDetailNumber: number;
    includeFreeSearchText: boolean;
    freeSearchField: number;
    freeSearchText: string;
    pageNumber: number;
    pageSize: number;
}

const SiteMemoList: React.FC = () => {
    const pageSizeSystemSetting = useAppSelector(
        (state) => state.reducer.systemSetting?.systemSetting?.commonPageSize,
    );
    const pageSize = pageSizeSystemSetting || DEFAULT_SYSTEM_SETTING.commonPageSize;
    const [openFilter, setOpenFilter] = useState(false);
    const [titleModal, settitleModal] = useState('取引先');
    const [defaultValue, setDefaultValue] = useState('');
    const [valueHiddenSourcesModal, setValueHiddenSourcesModal] = useState('');
    const [typeModal, setTypeModal] = useState(1); // 1: customer, 2: company, 3: sites, 4: types, 5: employees, 6: sources

    const [listCollection, setListCollection] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.SITE_NOTES],
    );
    const dispatchStatus = useAppSelector((state) => state.reducer.dispatchStatus.dispatchStatus);
    const cacheSearchCondition = useAppSelector((state) => state.reducer.siteNotes.siteNotes);
    const [searchParams] = useSearchParams();
    const isDispatchStatus = searchParams.get('dispatchStatus');
    const companyCD = searchParams.get('companyCd');
    const siteCD = searchParams.get('siteCd');
    const seqNo = searchParams.get('seqNo');

    const defaultValues = {
        isHidden: false,
        customerCd: null,
        includeEmptyCustomer: false,
        companyCd: null,
        includeEmptyCompany: false,
        siteCd: null,
        includeEmptySite: false,
        siteNoteTypeCd: null,
        registeredBy: null,
        sourceCd: null,
        sourceNumber: null,
        sourceDetailNumber: null,
        includeFreeSearchText: true,
        freeSearchField: 2,
        freeSearchText: null,
        pageNumber: 1,
        pageSize,
    };

    const { control, watch, setValue, getValues, handleSubmit, reset } =
        useForm<IFormSearchInput>({
            defaultValues: null,
        });

    const onSubmit = async (data: IFormSearchInput) => {
        handleGetData(true);
    };

    const [getSiteNotes, { data: siteNoteData, isLoading, isFetching }] = useLazyPostSearchQuery();
    const [getSitesByCompany, { isLoading: isLoadingSiteByCompany }] =
        useLazyGetSitesByCompanyQuery();
    const [getInfoCollection, { isLoading: isLoadingGetInfoCollection }] =
        useLazyGetInfoCollectionQuery();

    useEffect(() => {
        if (isDispatchStatus) {
            if (dispatchStatus && companyCD && siteCD) {
                getSiteNoteWithDispatchStatus(dispatchStatus, companyCD, siteCD);
            }
        } else if (seqNo) {
            GetCollectionInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatchStatus]);

    const getSiteNoteWithDispatchStatus = async (
        dataDispatchStatus,
        companyCd: string,
        siteCd: string,
    ) => {
        try {
            const response = await getSitesByCompany({ companyCd, siteCd }).unwrap();
            if (dataDispatchStatus && response) {
                const paramPage: ParamsQuerySearch = {
                    PageNumber: 1,
                    PageSize: pageSize,
                };

                let sourceCd;
                if (dataDispatchStatus.slipTypeCd === 100) {
                    sourceCd = 2;
                } else if (dataDispatchStatus.slipTypeCd === 2) {
                    sourceCd = 3;
                }

                setValue('customerCd', response.customerCd);
                setValue('customerName', response.customerName);
                setValue('companyCd', dataDispatchStatus.companyCd);
                setValue('companyName', dataDispatchStatus.companyName);
                setValue('siteCd', dataDispatchStatus.siteCd);
                setValue('siteName', dataDispatchStatus.siteName);
                setValue('sourceCd', sourceCd ? sourceCd.toString() : null);
                setValue('sourceName', sourceCd ? SOURCE_CONST[sourceCd].name : null);
                setValue('sourceNumber', dataDispatchStatus.dispatchSlipNo);
                handleGetData(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const GetCollectionInfo = async () => {
        try {
            const response = await getInfoCollection({ seqNo: +seqNo }).unwrap();
            // get data
            if (response) {
                const paramPage: ParamsQuerySearch = {
                    PageNumber: 1,
                    PageSize: pageSize,
                };

                let sourceCD = '';
                if (response?.receptionType === 1) {
                    sourceCD = '2';
                } else if (response?.receptionType === 2) {
                    sourceCD = '3';
                } else {
                    sourceCD = '5';
                }

                // setValue('customerCd', response.customerCD);
                // setValue('customerName', response.customerName);
                // setValue('companyCd', response.companyCD);
                // setValue('companyName', response.companyName);
                // setValue('siteCd', response.siteCD);
                // setValue('siteName', response.siteName);
                setValue('sourceCd', sourceCD);
                setValue('sourceName', sourceCD ? SOURCE_CONST[sourceCD].name : '');
                setValue('sourceNumber', response.sourceNumber);
                handleGetData(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let formValue = defaultValues;
        if (cacheSearchCondition) {
            formValue = cacheSearchCondition;
        }
        reset(formValue);
        handleGetData(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = () => {
        handleGetData(false);
    };

    const handleGetData = async (isSearch?) => {
        const formValue = getValues();
        const paramPage: ParamsQuerySearch = {
            PageNumber: isSearch ? 1 : formValue.pageNumber + 1,
            PageSize: formValue.pageSize,
        };
        const paramsRequest: ParamsSiteNotes = {
            params: paramPage,
            isHidden: formValue.isHidden,
            customerCd: formValue.customerCd,
            includeEmptyCustomer: formValue.includeEmptyCustomer,
            companyCd: formValue.companyCd,
            includeEmptyCompany: formValue.includeEmptyCompany,
            siteCd: formValue.siteCd,
            includeEmptySite: formValue.includeEmptySite,
            siteNoteTypeCd: formValue.siteNoteTypeCd,
            registeredBy: formValue.registeredBy,
            sourceCd: formValue.sourceCd,
            sourceNumber: formValue.sourceNumber?.toString() ? formValue.sourceNumber : null,
            sourceDetailNumber: formValue.sourceDetailNumber,
            includeFreeSearchText: formValue.includeFreeSearchText,
            freeSearchField: formValue.freeSearchField,
            freeSearchText: formValue.freeSearchText,
        };

        const response = await getSiteNotes(paramsRequest).unwrap();
        if (response) {
            setValue('pageNumber', paramsRequest.params.PageNumber);
            if (isSearch) {
                setListCollection(response.items);
            } else {
                setListCollection([...listCollection, ...response.items]);
            }
        }
        if (!isDispatchStatus) {
            dispatch(saveSiteNotes(formValue));
        }
    };

    const handleSelectItem = (item: any, type: number) => {
        setDefaultValue('');
        setOpenFilter(false);
        if (type === 1) {
            setValue('customerCd', item.cd);
            setValue('customerName', item.name);
        } else if (type === 2) {
            setValue('companyCd', item.cd);
            setValue('companyName', item.name);
        } else if (type === 3) {
            setValue('siteCd', item.cd);
            setValue('siteName', item.name);
            setValue('companyCd', item.companyCd);
            setValue('companyName', item.companyName);
        } else if (type === 4) {
            setValue('siteNoteTypeCd', item.cd);
            setValue('siteNoteTypeName', item.name);
        } else if (type === 5) {
            setValue('registeredBy', item.cd);
            setValue('registeredName', item.name);
        } else if (type === 6) {
            setValue('sourceCd', item.cd);
            setValue('sourceName', item.name);
            setValue('sourceNumber', null);
            setValue('sourceDetailNumber', null);
        }
    };

    const onDeleteSiteNote = async (systemId) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.SITE_NOTE_INPUT,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.SITE_NOTE_INPUT}?isDelete=true&systemId=${systemId}`);
    };

    const onAddSiteNote = () => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.SITE_NOTE_INPUT,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.SITE_NOTE_INPUT}`);
    };

    const onEditSiteNote = (systemId) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.SITE_NOTE_INPUT,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.SITE_NOTE_INPUT}?systemId=${systemId}`);
    };

    const handleClickRollBack = () => {
        if (isDispatchStatus || seqNo) {
            navigate(previousUrl || `/${CONSTANT_ROUTE.MAIN_MENU}`);
        } else {
            navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
        }
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
                if (documentElement.scrollTop >= 845) {
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

    return (
        <Layout
            title='現場メモ一覧'
            isShowDate={false}
            isLoading={
                isLoading || isFetching || isLoadingSiteByCompany || isLoadingGetInfoCollection
            }
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Collapse
                    onChange={($event)=>handleChangeCollapse($event)}
                    defaultActiveKey='1'
                    ref={collapsedElementRef}
                    expandIconPosition='end'
                    className={`bg-green15 border !border-green15 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:top-header 
                    [&_.ant-collapse-header]:bg-green15 
                    [&_.ant-collapse-header]:w-full 
                    [&_.ant-collapse-header]:z-10
                    [&_.ant-collapse-header]:left-0
                    [&_.ant-collapse-header]:!transition-none
                    sitenote-collapse ${
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
                            className: 'collapse-panel-custom-site-note',
                            children: isOpenSearchConditions && (
                                <div className='flex flex-col'>
                                    <div className='flex gap-2 border-b-[6px] border-grayE9 px-4 pb-4'>
                                        <div className='text-md text-green1A whitespace-nowrap md:min-w-[112px]'>
                                            表示区分
                                        </div>
                                        <Controller
                                            control={control}
                                            name='isHidden'
                                            render={({ field }) => (
                                                <Radio.Group
                                                    className='flex flex-wrap gap-y-2 justify-between items-center w-full'
                                                    size='large'
                                                    defaultValue={false}
                                                    {...field}
                                                >
                                                    <Radio
                                                        value={false}
                                                        className='text-ssm whitespace-nowrap mr-0'
                                                    >
                                                        表示
                                                    </Radio>
                                                    <Radio
                                                        value={true}
                                                        className='text-ssm whitespace-nowrap mr-0'
                                                    >
                                                        非表示
                                                    </Radio>
                                                    <Radio
                                                        value=''
                                                        className='text-ssm whitespace-nowrap mr-0'
                                                    >
                                                        全て
                                                    </Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                    </div>
                                    <div className='border-b-[6px] border-grayE9 p-4'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <div className='flex items-center gap-2 min-w-[80px]'>
                                                <div className='text-md text-green1A whitespace-nowrap'>
                                                    取引先
                                                </div>
                                            </div>

                                            <Controller
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        size='middle'
                                                        className='!border-grayD4'
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
                                                                        setValue('customerName', null);
                                                                        setValue('customerCd', null);
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
                                                name='customerName'
                                                control={control}
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
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setOpenFilter(true);
                                                    settitleModal('取引先');
                                                    setTypeModal(1);
                                                }}
                                            />
                                        </div>
                                        <div className='flex items-center justify-end gap-2'>
                                            <div className='text-ssm text-[#525252]'>
                                                取引先指定無しも含めて検索
                                            </div>
                                            <Controller
                                                control={control}
                                                name='includeEmptyCustomer'
                                                render={({ field: { value, onChange } }) => (
                                                    <Switch onChange={onChange} checked={value} />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='border-b-[6px] border-grayE9 p-4'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <div className='flex items-center gap-2 min-w-[80px]'>
                                                <div className='text-md text-green1A whitespace-nowrap'>
                                                    業者名
                                                </div>
                                            </div>
                                            <Controller
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        size='middle'
                                                        className='!border-grayD4'
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
                                                                        setValue('companyName', null);
                                                                        setValue('companyCd', null);
                                                                        setValue('siteName', null);
                                                                        setValue('siteCd', null);
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
                                                name='companyName'
                                                control={control}
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
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setOpenFilter(true);
                                                    settitleModal('業者');
                                                    setTypeModal(2);
                                                }}
                                            />
                                        </div>
                                        <div className='flex items-center justify-end gap-2'>
                                            <div className='text-ssm text-[#525252]'>
                                                業者指定無しも含めて検索
                                            </div>
                                            <Controller
                                                control={control}
                                                name='includeEmptyCompany'
                                                render={({ field: { value, onChange } }) => (
                                                    <Switch onChange={onChange} checked={value} />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='border-b-[6px] border-grayE9 p-4'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <div className='flex items-center gap-2 min-w-[80px]'>
                                                <div className='text-md text-green1A whitespace-nowrap'>
                                                    現場名
                                                </div>
                                            </div>
                                            <Controller
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        size='middle'
                                                        className='!border-grayD4'
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
                                                                        setValue('siteName', null);
                                                                        setValue('siteCd', null);
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
                                                name='siteName'
                                                control={control}
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
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setOpenFilter(true);
                                                    settitleModal('現場');
                                                    setDefaultValue(getValues('companyName'));
                                                    setTypeModal(3);
                                                }}
                                            />
                                        </div>
                                        <div className='flex items-center justify-end gap-2'>
                                            <div className='text-ssm text-[#525252]'>
                                                現場指定無しも含めて検索
                                            </div>
                                            <Controller
                                                control={control}
                                                name='includeEmptySite'
                                                render={({ field: { value, onChange } }) => (
                                                    <Switch onChange={onChange} checked={value} />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 border-b-[6px] border-grayE9 p-4'>
                                        <div className='flex items-center gap-2 min-w-[80px]'>
                                            <div className='text-md text-green1A'>分類</div>
                                        </div>
                                        <Controller
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    size='middle'
                                                    className='!border-grayD4'
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
                                                                    setValue('siteNoteTypeName', null);
                                                                    setValue('siteNoteTypeCd', null);
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
                                            name='siteNoteTypeName'
                                            control={control}
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
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setOpenFilter(true);
                                                settitleModal('分類');
                                                setTypeModal(4);
                                            }}
                                        />
                                    </div>
                                    <div className='flex items-center gap-2 border-b-[6px] border-grayE9 p-4'>
                                        <div className='flex items-center gap-2 min-w-[80px]'>
                                            <div className='text-md text-green1A whitespace-nowrap'>
                                                登録者
                                            </div>
                                        </div>
                                        <Controller
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    size='middle'
                                                    className='!border-grayD4'
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
                                                                    setValue('registeredName', null);
                                                                    setValue('registeredBy', null);
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
                                            name='registeredName'
                                            control={control}
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
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setOpenFilter(true);
                                                settitleModal('登録者');
                                                setTypeModal(5);
                                            }}
                                        />
                                    </div>
                                    <div className='border-b-[6px] border-grayE9 p-4'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <div className='flex items-center gap-2 min-w-[80px]'>
                                                <div className='text-md text-green1A whitespace-nowrap'>
                                                    発生元
                                                </div>
                                            </div>
                                            <Controller
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        size='middle'
                                                        className='!border-grayD4'
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
                                                                        setValue('sourceCd', null);
                                                                        setValue('sourceName', null);
                                                                        setValue('sourceNumber', null);
                                                                        setValue('sourceDetailNumber', null);
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
                                                name='sourceName'
                                                control={control}
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
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setOpenFilter(true);
                                                    settitleModal('発生元');
                                                    setTypeModal(6);
                                                    setValueHiddenSourcesModal('4');
                                                }}
                                            />
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='text-md text-green1A whitespace-nowrap'>
                                                伝票番号
                                            </div>
                                            <Controller
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        size='large'
                                                        className='!border-grayD4'
                                                        disabled={
                                                            watch('sourceCd') === null ||
                                                            watch('sourceCd') === '0' ||
                                                            watch('sourceCd') === '1'
                                                        }
                                                    />
                                                )}
                                                name='sourceNumber'
                                                control={control}
                                            />
                                        </div>
                                    </div>
                                    <div className='px-4 pt-4'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <div className='text-ssm text-[#525252]'>
                                                指定したキーワードを検索に含める
                                            </div>
                                        </div>
                                        <Controller
                                            control={control}
                                            name='freeSearchField'
                                            render={({ field: { onChange, ...props } }) => (
                                                <Radio.Group
                                                    className='flex justify-between mb-2'
                                                    size='large'
                                                    defaultValue={2}
                                                >
                                                    <Radio value={0} className='text-sm'>
                                                        表題
                                                    </Radio>
                                                    <Radio value={1} className='text-sm'>
                                                        内容
                                                    </Radio>
                                                    <Radio value={2} className='text-sm'>
                                                        全て
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
                                                    placeholder='フリーワードで検索する'
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
                                            name='freeSearchText'
                                            control={control}
                                            defaultValue=''
                                        />
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />
                <div  className='bg-green15 py-2' ref={fixedElementRef}>
                <FuncBlock
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                現場メモ一覧
                            </h2>
                            <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                                {siteNoteData ? siteNoteData.totalRecords : 0}
                            </div>
                        </div>
                    }
                    isShowRightIcon
                    isShowIconRefresh
                    onClickRefresh={handleSubmit(onSubmit)}
                    onClickIcon={onAddSiteNote}
                />
                </div>
                
                <div  ref={contentElementRef}>
                {listCollection &&
                    siteNoteData &&
                    siteNoteData.totalRecords !== 0 &&
                    listCollection.length > 0 &&
                    listCollection.map((item, index) => (
                        <div className={`px-4 ${index === 0 ? 'pt-4' : ''}`} key={item.systemId}>
                            <div className='bg-white rounded-lg shadow-md w-full py-4 mb-4'>
                                <div className='flex justify-between items-center px-4 pb-3 mb-4 border-b-[2px] border-grayE9'>
                                    <div className='text-sm'>登録日:</div>
                                    <div className='flex items-center'>
                                        <div className='flex items-center pr-2 border-r-2 border-grayD4'>
                                            <img
                                                src={iconCalendar}
                                                alt='iconCalendar'
                                                className='mr-2'
                                            />
                                            {dayjs(item.registeredDate).format('YYYY/MM/DD')}
                                        </div>
                                        <div className='flex items-center pl-2'>
                                            <img src={iconClock} alt='iconClock' className='mr-2' />
                                            {dayjs(item.registeredDate).format('HH:mm')}
                                        </div>
                                    </div>
                                </div>

                                {/* title */}
                                <div className='pb-3'>
                                    <div className='flex items-center gap-3 h-[54px] relative'>
                                        <div className='w-2 h-[60px] absolute top-[-3px] left-0'>
                                            <img
                                                src={iconRedBorder}
                                                className='w-full h-full'
                                                alt='info'
                                            />
                                        </div>
                                        <div className='w-4/5 ml-6 pt-2'>
                                            <div className='flex items-center justify-between mb-2'>
                                                <div className='text-sm'>表題</div>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <div className='text-xl text-green1A truncate'>
                                                    {item.title}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* info */}
                                <div className='flex items-center gap-3 relative py-3 mt-3 border-y-[1px] border-grayE9 px-4 h-full'>
                                    <div className='w-full'>
                                        <div className='flex items-center justify-between ml-2 mb-2'>
                                            <h2 className='text-xl font-semibold truncate'>
                                                {item.customerName}
                                            </h2>
                                            {item?.isExistsAttachedFile && (
                                                <div>
                                                    <img
                                                        src={iconLink}
                                                        alt='iconLink'
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-2 ml-2 mb-2'>
                                            <div>
                                                <BuildingOfficeIcon className='' />
                                            </div>
                                            <div className='text-sm text-[#7D7D7D] truncate'>
                                                {item.companyName}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 ml-2 mb-2'>
                                            <div>
                                                <WebsiteIcon className='' />
                                            </div>
                                            <div className='text-sm text-[#7D7D7D] truncate'>
                                                {item.siteName}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 ml-2 mb-2'>
                                            <div>
                                                <RegisterIcon className='' />
                                            </div>
                                            <div className='text-sm text-[#7D7D7D] truncate'>
                                                {item.registeredBy}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 ml-2 mb-2'>
                                            <div>
                                                <CpuIcon className='' />
                                            </div>
                                            <div className='text-sm text-[#7D7D7D] truncate'>
                                                {item.sourceName}
                                                {item.sourceCd === '2' ||
                                                    item.sourceCd === '3' ||
                                                    item.sourceCd === '4'
                                                    ? '（受付番号：' + item.sourceNumber + '）'
                                                    : item.sourceCd === '5'
                                                        ? '（配車番号：' +
                                                        item.sourceNumber +
                                                        '　行：' +
                                                        item.sourceDetailNumber +
                                                        '）'
                                                        : ''}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 ml-2 mb-2'>
                                            <div>
                                                <DisplayIcon className='' />
                                            </div>
                                            <div className='text-sm text-[#7D7D7D] truncate'>
                                                {item.siteNoteTypeName}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex items-center mt-4 px-4'>
                                    <div
                                        className='w-1/2 border-r-2 border-grayD4'
                                        onClick={() => onEditSiteNote(item.systemId)}
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
                                        onClick={() => onDeleteSiteNote(item.systemId)}
                                    >
                                        <div className='flex items-center gap-2 justify-end'>
                                            <p className='text-ssm text-red2a font-zenMaru'>削除</p>

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
                {(listCollection.length === 0 ||
                    (siteNoteData && siteNoteData.totalRecords === 0)) && (
                        <div className='p-4'>
                            <div className='text-sm text-yellow01'>現場メモ情報はありません.</div>
                        </div>
                    )}
                {listCollection.length < siteNoteData?.totalRecords && (
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
                {/* Modal  */}
                {openFilter && (
                    <SiteNoteModal
                        open={openFilter}
                        setOpen={setOpenFilter}
                        handleSelectItem={handleSelectItem}
                        title={titleModal}
                        defaultValue={defaultValue}
                        setDefaultValue={setDefaultValue}
                        type={typeModal}
                        valueHiddenSources={valueHiddenSourcesModal}
                    />
                )}
            </form>
        </Layout>
    );
};
export default SiteMemoList;
