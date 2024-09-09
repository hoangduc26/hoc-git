/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable arrow-body-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Collapse, Form, Input, Radio, Switch, RadioChangeEvent, Empty, Spin } from 'antd';
import FuncBlock from 'components/common/FuncBlock';
import Layout from 'components/templates/Layout';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import iconLink from 'assets/icons/ic_link.svg';
import iconClose from 'assets/icons/ic_close_bg_none.svg';
import './index.scss';
import Container from 'components/organisms/container';
import Calendar from 'components/common/Calendar';
import SelectValueModalDefault from 'components/common/Modal/SelectValueModalDefault';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    useLazyGetCompaniesQuery,
    useLazyGetSitesQuery,
    useLazyGetProductsQuery,
    useLazyGetReportClassificationsQuery,
    useLazyGetSubmitQuery,
} from 'services/contracts';
import { SitesInformation, CompanieContract } from 'models';
import { useAppSelector } from 'store/hooks';
import dayjs from 'dayjs';
import { convertDate } from 'utils/dates';
import { CONSTANT_ROUTE } from 'utils/constants';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';
import { SearchIcon } from 'components/icons/SearchIcon';
import { FilterBorderSvg } from 'components/icons/FilterBorderSvg';

const FUNNEL_TYPE = {
    COMPANY: 'company',
    SITE: 'site',
    NOTE_TYPE: 'note_type',
    TITLE: 'title',
    PRODUCTREPORTCLASSIFICATIONTYPE: 'ProductReportClassificationType',
    PRODUCT: 'product',
    REPORT: 'report',
};

const defaultChecker = {
    showDate: true,
    showClassification: true,
    radioProd: true,
    radioReport: false,
};

const defaultdata = {
    items: [],
    totalRecords: 0,
};

const listRadios: { id: number; text: string }[] = [
    { id: 0, text: '業者名' },
    { id: 1, text: '現場名' },
    { id: 2, text: '住所' },
    { id: 3, text: '全て' },
];

const URL = '/contract-detail';

const Contracts: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const pageSizeSystemSetting = useAppSelector(
        (state) => state.reducer.systemSetting?.systemSetting?.commonPageSize,
    );
    const pageSize = pageSizeSystemSetting || DEFAULT_SYSTEM_SETTING.commonPageSize;
    const initPaginations = {
        SearchText: '',
        PageNumber: 1,
        // PageSize: pageSize,
        PageSize: 25,
    };
    const initPagination = {
        PageNumber: 1,
        PageSize: pageSize,
        ProductReportClassificationType: 0,
    };
    const KEY_COLLAPSE_COURSE = 1;
    const [checker, setChecker] = useState(defaultChecker);
    const [activeKey, setActiveKey] = useState(KEY_COLLAPSE_COURSE);
    const [resetPages, setResetPages] = useState(false);
    const [saveData, setSavedata] = useState();
    const [dataSubmitList, setdataSubmitList] = useState(defaultdata);
    const [open, setOpen] = useState<boolean>(false);
    const [funnelType, setFunnelType] = useState('');
    const [formState, setFormState] = useState<any>(initPagination);
    const [paginations, setPaginations] = useState(initPaginations);
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchCompany, setSearchCompany] = useState('');
    const [listCompanyState, setListCompanyState] = useState<CompanieContract[]>([]);
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.CONTRACTS],
    );
    const [
        getCompanies,
        {
            data: companiesList,
            isLoading: isLoadingGetCompanies,
            isFetching: isFetchingGetCompanies,
        },
    ] = useLazyGetCompaniesQuery();
    const [searchSite, setSearchSite] = useState('');
    const [listSiteState, setListSiteState] = useState<any>([]);
    const [
        getSites,
        { data: sitesList, isLoading: isLoadingGetSites, isFetching: isFetchingGetSites },
    ] = useLazyGetSitesQuery();
    const [classification, setClassification] = useState('');
    const [listProductsState, setListProductsState] = useState<any>([]);
    const [listReportState, setListReportState] = useState<any>([]);
    const [getProducts, { data: productsList, isLoading: isLoadingProductsGetSites }] =
        useLazyGetProductsQuery();
    const [getReportClassifications, { data: reportList, isLoading: isLoadingReportGetSites }] =
        useLazyGetReportClassificationsQuery();
    const [
        getSubmit,
        {
            data: dataSubmitLists,
            isLoading: isLoadingSubmitGetSites,
            isFetching: isFetchingSubmitGetSites,
        },
    ] = useLazyGetSubmitQuery();

    const urlParams = new URLSearchParams(window?.location?.search);
    const showDate = urlParams?.has('showDate') ? urlParams?.get('showDate') : 'true';
    const DesignatedDate = urlParams?.has('DesignatedDate') ? urlParams?.get('DesignatedDate') : '';
    const showReportProduct = urlParams?.has('showClassification')
        ? urlParams?.get('showClassification')
        : 'true';
    const showClassification = urlParams?.has('ProductReportClassificationType')
        ? urlParams?.get('ProductReportClassificationType')
        : '';

    useEffect(() => {
        if (Array.isArray(dataSubmitLists?.items)) {
            if (resetPages) {
                setdataSubmitList((prev) => ({
                    ...prev,
                    totalRecords: dataSubmitLists?.totalRecords,
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    items: [...dataSubmitLists?.items],
                }));
            } else {
                setdataSubmitList((prev) => ({
                    ...prev,
                    totalRecords: dataSubmitLists?.totalRecords,
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    items: [...prev?.items, ...dataSubmitLists?.items],
                }));
            }
        }
    }, [dataSubmitLists]);

    useEffect(() => {
        if (open) {
            getApiFunnel();
        }
    }, [open, searchCompany, searchSite, classification]);

    useEffect(() => {
        if (companiesList) {
            setListCompanyState(companiesList.items);
        }
        if (sitesList) {
            setListSiteState(sitesList.items);
        }
        if (reportList) {
            setListReportState(reportList.items);
        }
        if (productsList) {
            setListProductsState(productsList.items);
        }
    }, [companiesList, sitesList, productsList, reportList]);

    useEffect(() => {
        updateURL(formState);
    }, [formState]);

    const handleCheckShowDate = (data: boolean) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('showDate', data.toString());
        navigate({ search: searchParams.toString() });
        setChecker((prev) => ({
            ...prev,
            showDate: data,
        }));
    };

    const handleCheckShowClass = (data: boolean, type?: string) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('showClassification', data.toString());
        navigate({ search: searchParams.toString() });

        setChecker((prev) => ({
            ...prev,
            showClassification: data,
        }));
    };

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            DesignatedDate: dayjs(selectedDate).format(),
        }));
    }, [selectedDate]);

    useEffect(() => {
        const searchParams: any = new URLSearchParams(window?.location?.search);
        const paramsObj: any = {};
        for (const [key, value] of searchParams) {
            if (value !== 'null') {
                paramsObj[key] = value;
            }
        }

        if (paramsObj?.showClassification === 'false') {
            handleSubmit(true);
        } else {
            getKeyAndValue(paramsObj);
        }

        if (urlParams?.get('radioProd') === 'false') {
            setChecker((prev) => ({
                ...prev,
                radioReport: true,
                radioProd: false,
            }));
        }
    }, []);

    const updateURL = (queryParamsObj: any) => {
        const searchParams = new URLSearchParams(location?.search);
        // eslint-disable-next-line no-restricted-syntax
        for (const key in queryParamsObj) {
            if (Object.hasOwnProperty.call(queryParamsObj, key)) {
                const value = queryParamsObj[key];
                if (value !== 'null') {
                    searchParams.set(key, value);
                }
            }
        }
        navigate({ search: searchParams.toString() });
    };

    const getKeyAndValue = (obj: any) => {
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (key === 'PageNumber' || key === 'PageSize') {
                    setFormState((prev) => ({
                        ...prev,
                        [key]: parseInt(value),
                    }));
                } else {
                    setFormState((prev) => ({
                        ...prev,
                        [key]: value,
                    }));
                }

                form.setFieldsValue({
                    [key]: value,
                });

                apiSubmitFunc(obj, getSubmit);
            }
        }
    };

    const toggleCollapseCourse = () => {
        if (activeKey === KEY_COLLAPSE_COURSE) {
            setActiveKey(null);
        } else {
            setActiveKey(KEY_COLLAPSE_COURSE);
            window.scrollTo(0, 0);
        }
    };

    const fixedElementRef = useRef();
    const collapsedElementRef = useRef();
    const contentElementRef = useRef();

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
    }, [activeKey]);

    const checkStyleElement = () => {
        const { documentElement } = document;
        if (fixedElementRef.current && collapsedElementRef.current && contentElementRef.current) {
            const collapsed = collapsedElementRef.current as HTMLElement; // Collapse
            const elementFixedOnScroll = fixedElementRef.current as HTMLElement; // Element cần cố định khi scroll
            const content = contentElementRef.current as HTMLElement; // Danh sách || nội dung || dữ liệu trang
            if (collapsed.classList.contains('opening')) {
                // Collapse OPEN
                if (documentElement.scrollTop >= 593) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '159px';
                    elementFixedOnScroll.style.zIndex = '10';
                    elementFixedOnScroll.style.borderTop = '1px solid white';
                    content.style.marginTop = '65px';
                } else {
                    elementFixedOnScroll.style.position = 'unset';
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

    const handleSelectDate = (date) => {
        setSelectedDate(date);
    };

    const handleFunnel = (type: string) => {
        setOpen(!open);
        setFunnelType(type);
    };

    const renderCalendar = useMemo(
        () => <Calendar selectedDate={selectedDate} handleSelectDate={handleSelectDate} />,
        [selectedDate],
    );

    const selectItemFunc = (
        field_state_code: string,
        field_state_name: string,
        code_val: string,
        name_val: string,
    ): void => {
        setFormState((prev) => ({
            ...prev,
            [field_state_name]: name_val,
            [field_state_code]: code_val,
        }));

        form.setFieldsValue({
            [field_state_name]: name_val,
        });
    };

    const handleChangeRadioGroup = (number: number) => {
        const searchParams = new URLSearchParams(location.search);
        if (number === 0) {
            searchParams.set('radioProd', 'true');
            navigate({ search: searchParams.toString() });
            setFormState((prev) => ({
                ...prev,
                ProductReportClassificationType: 0,
                showDate: showDate === 'true',
                showClassification: showReportProduct === 'true',
                radioProd: 'true',
            }));
            if (formState.radioProd !== 'true') {
                clearInputFunc(
                    setClassification,
                    'ProductReportClassificationCd',
                    'ProductReportClassificationText',
                );
            }
        } else if (number === 1) {
            searchParams.set('radioProd', 'false');
            navigate({ search: searchParams.toString() });
            setFormState((prev) => ({
                ...prev,
                ProductReportClassificationType: 1,
                showDate: showDate === 'true',
                showClassification: showReportProduct === 'true',
                radioProd: 'false',
            }));
            if (formState.radioProd !== 'false') {
                clearInputFunc(
                    setClassification,
                    'ProductReportClassificationCd',
                    'ProductReportClassificationText',
                );
            }
        }
    };

    const clearInputFunc = (cb, code: string, name: string) => {
        cb('');

        setFormState((prev) => ({
            ...prev,
            [name]: null,
            [code]: null,
        }));

        form.setFieldsValue({
            [name]: null,
        });
    };

    const handleClearInput = (type: string) => {
        switch (type) {
            case FUNNEL_TYPE.COMPANY:
                clearInputFunc(setSearchCompany, 'companyCd', 'companyName');
                clearInputFunc(setSearchSite, 'siteCd', 'siteName');
                break;
            case FUNNEL_TYPE.SITE:
                clearInputFunc(setSearchSite, 'siteCd', 'siteName');
                break;
            case FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE:
                clearInputFunc(
                    setClassification,
                    'ProductReportClassificationCd',
                    'ProductReportClassificationText',
                );
                break;
            default:
                break;
        }
    };

    const apifunnelFunc = (search: string, cb: any, field = 0): void => {
        const pagination = {
            SearchText: search,
            PageNumber: 1,
            PageSize: 25,
        };

        cb(pagination).unwrap();
    };

    const getApiFunnel = (): void => {
        try {
            switch (funnelType) {
                case FUNNEL_TYPE.SITE:
                    apifunnelFunc(searchSite, getSites);
                    break;
                case FUNNEL_TYPE.COMPANY:
                    apifunnelFunc(searchCompany, getCompanies);
                    break;
                case FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE:
                    if (formState.radioProd !== 'false') {
                        apifunnelFunc(classification, getProducts);
                    } else {
                        apifunnelFunc(classification, getReportClassifications);
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            //
        }
    };

    const handleInputChange = (event: any, type: string) => {
        if (type) {
            switch (type) {
                case FUNNEL_TYPE.COMPANY:
                    setSearchCompany(event?.target?.value || event || '');
                    break;
                case FUNNEL_TYPE.SITE:
                    setSearchSite(event?.target?.value || event || '');
                    break;
                case FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE:
                    setClassification(event?.target?.value || event || '');
                    break;
                default:
                    break;
            }
        }
    };

    const handleSelectItem = async (item: any, type: string) => {
        setOpen(false);
        switch (type) {
            case FUNNEL_TYPE.COMPANY:
                await selectItemFunc('companyCd', 'companyName', item.companyCd, item.companyName);
                break;
            case FUNNEL_TYPE.SITE:
                await selectItemFunc('siteCd', 'siteName', item.key, item.name);
                break;
            case FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE:
                await selectItemFunc(
                    'ProductReportClassificationCd',
                    'ProductReportClassificationText',
                    item.key,
                    item.name,
                );
                break;

            default:
                break;
        }

        if (type === FUNNEL_TYPE.COMPANY) {
            setSearchSite(item.companyName);

            setFormState((prev) => ({
                ...prev,
                siteName: null,
                siteCd: null,
            }));

            form.setFieldsValue({
                siteName: null,
            });
        }

        if (type === FUNNEL_TYPE.SITE) {
            setFormState((prev) => ({
                ...prev,
                companyName: item.companyName,
                companyCd: item.companyCd,
            }));

            form.setFieldsValue({
                companyName: item.companyName,
            });
        }
    };

    const moreDataFunc = async (
        pagination: any,
        cb_1: any,
        cb_2: any,
        list_state: any,
    ): Promise<void> => {
        const response = await cb_1(pagination).unwrap();
        if (response) {
            cb_2([...list_state, ...response.items]);
        }
    };

    const loadMoreData = async (type: any) => {
        let newPaginations: any = {};

        if (type === saveData) {
            newPaginations = {
                ...paginations,
                page: paginations.PageNumber + 1,
                PageNumber: paginations.PageNumber + 1,
            };
            setPaginations({ ...paginations, PageNumber: paginations.PageNumber + 1 });
        } else {
            newPaginations = { ...paginations, page: 2, PageNumber: 2 };
            setPaginations({ ...paginations, PageNumber: 2 });
            setSavedata(type);
        }

        try {
            switch (type) {
                case FUNNEL_TYPE.COMPANY:
                    moreDataFunc(
                        newPaginations,
                        getCompanies,
                        setListCompanyState,
                        listCompanyState,
                    );
                    break;
                case FUNNEL_TYPE.SITE:
                    moreDataFunc(newPaginations, getSites, setListSiteState, listSiteState);
                    break;
                case FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE:
                    if (formState.radioProd !== 'false') {
                        moreDataFunc(
                            newPaginations,
                            getProducts,
                            setListProductsState,
                            listProductsState,
                        );
                    } else {
                        moreDataFunc(
                            newPaginations,
                            getReportClassifications,
                            setListReportState,
                            listReportState,
                        );
                    }
                    break;

                default:
                    break;
            }
        } catch (err) {
            //
        }
    };

    const handleChangeRadio = (event: RadioChangeEvent, type: string) => {
        if (type === FUNNEL_TYPE.SITE) {
            const pagination = {
                SearchText: searchSite,
                SearchType: event.target.value,
                PageNumber: 1,
                PageSize: 25,
            };
            getSites(pagination).unwrap();
        }
    };

    const apiSubmitFunc = (data: any, cb: any): void => {
        const isNullOrUndefinedOrEmpty = (value) =>
            value === null || value === undefined || value === '';

        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => !isNullOrUndefinedOrEmpty(value)),
        );
        delete filteredData.showDate;
        delete filteredData.radioProd;
        delete filteredData.showClassification;

        if (!checker.showDate || showDate === 'false') {
            delete filteredData.DesignatedDate;
        } else if (checker.showDate && filteredData.DesignatedDate === undefined) {
            filteredData.DesignatedDate = dayjs(selectedDate).format();
        }
        cb(filteredData).unwrap();
    };

    const handleSubmit = (pagination) => {
        const pamramReq = { ...formState };
        delete pamramReq?.radioProd;
        if (
            showClassification === 'false' ||
            showReportProduct === 'false' ||
            checker.showClassification === false
        ) {
            delete pamramReq.ProductReportClassificationCd;
            delete pamramReq.ProductReportClassificationText;
            delete pamramReq.ProductReportClassificationType;
        }

        if (showDate === 'false') {
            delete pamramReq.DesignatedDate;
        }

        if (pagination) {
            pamramReq.PageNumber += 1;
        } else {
            pamramReq.PageNumber = 1;
        }
        apiSubmitFunc(pamramReq, getSubmit);
    };

    const convertData = (pagi) => {
        handleSubmit(pagi);
        setResetPages(true);
    };

    const handleLoadMore = () => {
        setFormState((prev) => ({
            ...prev,
            PageNumber: prev.PageNumber + 1,
        }));
        handleSubmit(true);
        setResetPages(false);
    };
    const renderCourses = () => {
        return [
            <div className='form-activeStatus'>
                <div className='flex bg-white py-4 px-4 gap-2 items-center'>
                    {showDate ? (
                        <Switch
                            className='bg-grayE9'
                            checked={showDate === 'true' && checker.showDate === true}
                            onChange={() => handleCheckShowDate(!(showDate === 'true'))}
                        />
                    ) : (
                        <Switch
                            className='bg-grayE9'
                            checked={checker.showDate}
                            onChange={() => handleCheckShowDate(!checker.showDate)}
                        />
                    )}

                    <p className='text-md text-green1A tracking-wider'>
                        指定日が、有効期限内のもののみ 表示
                    </p>
                </div>
                {renderCalendar}
                <div className='flex flex-col bg-white pt-4 pb-[10px] gap-3 border-t-[1px]'>
                    <div className='flex gap-2 items-center px-4 '>
                        {showReportProduct ? (
                            <Switch
                                className='bg-grayE9'
                                checked={
                                    showReportProduct === 'true' &&
                                    checker.showClassification === true
                                }
                                onChange={() =>
                                    handleCheckShowClass(!(showReportProduct === 'true'))
                                }
                            />
                        ) : (
                            <Switch
                                className='bg-grayE9'
                                checked={checker.showClassification}
                                onChange={() => handleCheckShowClass(!checker.showClassification)}
                            />
                        )}

                        <p className='text-md text-green1A tracking-wider'>
                            指定した分類、又は品名を含むもののみ表示
                        </p>
                    </div>

                    <Form
                        name='basic'
                        initialValues={{ remember: true }}
                        autoComplete='off'
                        className='form-activeStatus'
                        form={form}
                    >
                        {/* companyName */}
                        <div className='border-t-2 border-b-2 border-t-grayE9 px-4 py-2'>
                            <div className='flex items-center bg-white gap-3'>
                                <h3 className='text-md font-medium leading-[100%] tracking-wide text-green1A py-1 whitespace-nowrap'>
                                    業者名
                                </h3>
                                <div className='flex relative items-center justify-center h-[40px] w-full rounded-md border border-grayE9 '>
                                    <Form.Item name='companyName'>
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            addonAfter={
                                                formState?.companyName && (
                                                    <img
                                                        onClick={() => {
                                                            handleClearInput(FUNNEL_TYPE.COMPANY);
                                                        }}
                                                        src={iconClose}
                                                        alt='search'
                                                        className='absolute right-1 translate-y-[-50%] z-50 bg-[#fff] px-[2px]'
                                                    />
                                                )
                                            }
                                            readOnly
                                        />
                                    </Form.Item>
                                </div>
                                <button
                                    type='button'
                                    className='w-[56px]'
                                    onClick={() => handleFunnel(FUNNEL_TYPE.COMPANY)}
                                >
                                    <FilterBorderSvg className='max-w-none' />
                                </button>
                            </div>
                        </div>

                        {/* siteName */}
                        <div className='border-b-2 border-t-grayE9 px-4 py-2'>
                            <div className='flex items-center bg-white gap-3'>
                                <h3 className='text-md font-medium leading-[100%] tracking-wide text-green1A py-1 whitespace-nowrap'>
                                    現場名
                                </h3>
                                <div className='flex relative items-center justify-center h-[40px] w-full rounded-md border border-grayE9 '>
                                    <Form.Item name='siteName'>
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            // disabled
                                            addonAfter={
                                                formState?.siteName && (
                                                    <img
                                                        onClick={() => {
                                                            handleClearInput(FUNNEL_TYPE.SITE);
                                                        }}
                                                        src={iconClose}
                                                        alt='search'
                                                        className='absolute right-1 translate-y-[-50%] z-50 bg-[#fff] px-[2px]'
                                                    />
                                                )
                                            }
                                            readOnly
                                        />
                                    </Form.Item>
                                </div>
                                <button
                                    type='button'
                                    className='w-[56px]'
                                    onClick={() => handleFunnel(FUNNEL_TYPE.SITE)}
                                >
                                    <FilterBorderSvg className='max-w-none' />
                                </button>
                            </div>
                        </div>
                    </Form>
                    <Radio.Group className='flex w-full px-4 ' size='large' defaultValue>
                        <Radio
                            value={checker?.radioProd}
                            className='text-ssm whitespace-nowrap'
                            onClick={() => handleChangeRadioGroup(0)}
                        >
                            品名
                        </Radio>
                        <Radio
                            value={checker?.radioReport}
                            className='text-ssm whitespace-nowrap'
                            onClick={() => handleChangeRadioGroup(1)}
                        >
                            報告書分類
                        </Radio>
                    </Radio.Group>
                </div>
                <div className='flex items-center bg-white px-4 pb-4 gap-3 justify-between'>
                    <Form
                        initialValues={{ remember: true }}
                        autoComplete='off'
                        form={form}
                        className='flex-1'
                    >
                        <Form.Item name='ProductReportClassificationText'>
                            <Input
                                prefix={<SearchIcon className='searchSvg' />}
                                addonAfter={
                                    formState?.ProductReportClassificationText && (
                                        <img
                                            onClick={() => {
                                                handleClearInput(
                                                    FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE,
                                                );
                                            }}
                                            src={iconClose}
                                            alt='search'
                                            className='absolute right-1 translate-y-[-50%] z-50 bg-[#fff] px-[2px]'
                                        />
                                    )
                                }
                                readOnly
                            />
                        </Form.Item>
                    </Form>
                    <button
                        type='button'
                        className='w-[56px]'
                        onClick={() => handleFunnel(FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE)}
                    >
                        <FilterBorderSvg />
                    </button>
                </div>
            </div>,
        ];
    };
    const handleRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.MAIN_MENU}`);
    };
    return (
        <Layout
            isHiddenPageHeader
            isShowDate
            title=''
            // isRefresh={false}
            isShowRollback
            onClickRollback={handleRollback}
            isLoading={isLoadingSubmitGetSites}
            fixedHeader
        >
            <div className='fixed top-[66px] w-full z-10'>
                <FuncBlock
                    bgColor='bg-green1A'
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                委託契約情報一覧
                            </h2>
                        </div>
                    }
                />
            </div>

            {funnelType === FUNNEL_TYPE.SITE && (
                <SelectValueModalDefault
                    open={open}
                    setOpen={setOpen}
                    handleInputChange={(e) => handleInputChange(e, FUNNEL_TYPE.SITE)}
                    handleSelectItem={(data) => handleSelectItem(data, FUNNEL_TYPE.SITE)}
                    listProducts={listSiteState}
                    isLoading={isFetchingGetSites}
                    loadMoreData={async () => {
                        loadMoreData(FUNNEL_TYPE.SITE);
                    }}
                    products={sitesList}
                    title='現場一覧'
                    searchValue={searchSite}
                    handleChangeRadio={(e) => handleChangeRadio(e, FUNNEL_TYPE.SITE)}
                    radioItems={listRadios}
                    isSite
                    placeholder='検索する 一覧'
                />
            )}
            {funnelType === FUNNEL_TYPE.COMPANY && (
                <SelectValueModalDefault
                    open={open}
                    setOpen={setOpen}
                    handleInputChange={(e) => handleInputChange(e, FUNNEL_TYPE.COMPANY)}
                    handleSelectItem={(data) => handleSelectItem(data, FUNNEL_TYPE.COMPANY)}
                    listProducts={listCompanyState}
                    isLoading={isFetchingGetCompanies}
                    loadMoreData={async () => {
                        loadMoreData(FUNNEL_TYPE.COMPANY);
                    }}
                    products={companiesList}
                    title='業者一覧'
                    companyName
                    placeholder='検索する 一覧'
                />
            )}
            {funnelType === FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE && (
                <SelectValueModalDefault
                    open={open}
                    setOpen={setOpen}
                    handleInputChange={(e) =>
                        handleInputChange(e, FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE)
                    }
                    handleSelectItem={(data) =>
                        handleSelectItem(data, FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE)
                    }
                    listProducts={
                        formState.radioProd !== 'false' ? listProductsState : listReportState
                    }
                    isLoading={
                        formState.radioProd !== 'false'
                            ? isLoadingProductsGetSites
                            : isLoadingReportGetSites
                    }
                    loadMoreData={async () => {
                        loadMoreData(FUNNEL_TYPE.PRODUCTREPORTCLASSIFICATIONTYPE);
                    }}
                    products={formState.radioProd !== 'false' ? productsList : reportList}
                    title={formState.radioProd !== 'false' ? '品名一覧' : '報告書分類一覧'}
                    placeholder='検索する 一覧'
                    setSavedata={setSavedata}
                    reportName
                />
            )}
            {/* {renderCalendar} */}
            <Collapse
                activeKey={activeKey}
                bordered={false}
                accordion
                ref={collapsedElementRef}
                className={`bg-green15 border !border-green15 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:top-header 
                    [&_.ant-collapse-header]:bg-green15 
                    [&_.ant-collapse-header]:w-full 
                    [&_.ant-collapse-header]:z-10
                    [&_.ant-collapse-header]:left-0
                    [&_.ant-collapse-header]:!p-[8px_16px]
                    [&_.ant-collapse-header]:!transition-none
                    [&_.ant-collapse-content-box]:!pt-0
                    ${
                        activeKey === KEY_COLLAPSE_COURSE
                            ? `
                           opening 
                       [&_.ant-collapse-content]:mt-[157px]
                       `
                            : ``
                    }`}
                expandIcon={({ isActive }) => (
                    <div>
                        {' '}
                        <button
                            onClick={() => toggleCollapseCourse()}
                            type='button'
                            className={`transition-all ${isActive ? '' : '-rotate-180'}`}
                        >
                            <svg
                                width='20'
                                height='12'
                                viewBox='0 0 20 12'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M1.5 1.75L10 10.25L18.5 1.75'
                                    stroke='white'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </button>
                    </div>
                )}
                expandIconPosition='end'
                items={[
                    {
                        key: '1',
                        className: 'collapse-panel-custom-contracts',
                        label: (
                            <div
                                className='bg-green15'
                                onClick={() => toggleCollapseCourse()}
                                role='button'
                            >
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                            検索条件
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ),
                        children: activeKey === KEY_COLLAPSE_COURSE && renderCourses(),
                    },
                ]}
            />
            <div className='bg-green15 py-2' ref={fixedElementRef}>
                <FuncBlock
                    isShowIconRefresh
                    onClickRefresh={() => convertData(false)}
                    leftChild={
                        <div className='flex items-center'>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                委託契約情報一覧
                            </h2>
                            <div className='min-w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center px-1'>
                                {dataSubmitList?.totalRecords || 0}
                            </div>
                        </div>
                    }
                />
            </div>
            <div ref={contentElementRef} className='px-4 pt-4'>
                <Spin spinning={isFetchingSubmitGetSites} className='px-4 py-4 flex flex-col gap-3'>
                    {dataSubmitList?.items?.length > 0 ? (
                        dataSubmitList?.items?.map((value, index) => (
                            <div
                                key={value?.systemId}
                                className='active-status-wrapper green hover:opacity-90 cursor-pointer mb-4'
                            >
                                <Link className='w-full' to={`${URL}?systemId=${value?.systemId}`}>
                                    <div className='w-full flex items-center justify-between '>
                                        <span className='text-gray68 text-sm flex gap-1'>
                                            <p className='whitespace-nowrap'>契約状況 :</p>
                                            <span className='text-black27'>
                                                {value?.contractStatus}
                                            </span>
                                        </span>
                                        {value?.fileExistsFlg && (
                                            <div>
                                                <img
                                                    src={iconLink}
                                                    alt='iconLink'
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <span className='text-gray68 text-sm flex gap-1'>
                                        <p className='whitespace-nowrap'>契約種類 :</p>
                                        <span className='text-black27'>
                                            {value?.contractForm} - {value?.contractType}{' '}
                                            {value?.individualDesignationFlg ? '(個別)' : ''}
                                        </span>
                                    </span>
                                    <span className='text-gray68 text-sm flex gap-1'>
                                        <p className='whitespace-nowrap'>契約番号 : </p>
                                        <span className='text-black27'>{value?.contractNo}</span>
                                    </span>
                                    <span className='text-gray68 text-sm flex gap-1'>
                                        <p className='whitespace-nowrap'>契約日付 : </p>
                                        <span className='text-black27'>
                                            {value?.contractDate &&
                                                `${`${dayjs(value?.contractDate).format(
                                                    `YYYY/MM/DD`,
                                                )} (${convertDate(value?.contractDate)})`}
                                        `}
                                        </span>
                                    </span>
                                    <span className='text-gray68 text-sm flex gap-1'>
                                        <p className='whitespace-nowrap'>有効期限 :</p>
                                        <span className='text-black27'>
                                            {value?.validBeginDate &&
                                                `${`${dayjs(value?.validBeginDate).format(
                                                    `YYYY/MM/DD`,
                                                )} (${convertDate(value?.validBeginDate)})`}
                                        `}
                                            ~
                                            {value?.validEndDate &&
                                                `${` ${dayjs(value?.validEndDate).format(
                                                    `YYYY/MM/DD`,
                                                )} (${convertDate(value?.validEndDate)})`}
                                        `}
                                        </span>
                                    </span>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className='pb-4'>
                            <div className='text-sm text-yellow01'>委託契約書情報はありません.</div>
                        </div>
                    )}
                    {dataSubmitList?.items?.length < dataSubmitList?.totalRecords && (
                        <div className='mx-4 mt-5 mb-6'>
                            <Button
                                className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center py-5'
                                onClick={() => handleLoadMore()}
                            >
                                続きを見る
                            </Button>
                        </div>
                    )}
                </Spin>
            </div>
        </Layout>
    );
};

export default Contracts;
