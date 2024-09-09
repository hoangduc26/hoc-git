/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable eqeqeq */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-empty */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Collapse, Input, Radio, Skeleton, Spin, Switch } from 'antd';
import iconInfo from 'assets/icons/ic_info_blue_has_border.svg';
import iconNote from 'assets/icons/ic_note.svg';
import iconNotePin from 'assets/icons/ic_note_pin.svg';
import { ModalSelectOption } from 'components/common/Modal';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import Container from 'components/organisms/container';
import iconGrayClock from 'assets/icons/ic_gray_clock.svg';
import Layout from 'components/templates/Layout';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import {
    clearCacheCollectedQuantityInput,
    setIsDisplayUnregisteredContainer,
    setSearchConditions,
    useLazyGetCollectionsQuery,
} from 'services/collection';
import { setPreviousPage } from 'services/page';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
    COLLECTION_RESULT_INPUT_SETTING,
    CONSTANT_ROUTE,
    DISPATCH_TYPES,
    DROPDOWN_ORDER_BY,
    PAGE_SIZE,
    ROLES,
    SORT_TYPE,
} from 'utils/constants';
import { CollectionStatus } from 'utils/enums';
import { useLazyGetStatusAuthQuery } from 'services/auth';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';
import { FilterSvg } from 'components/icons/FilterSvg';
import { ArrowRightIcon } from 'components/icons/ArrowRightIcon';
import FuncBlock from 'components/common/FuncBlock';
import { ICollection, IParamsRequestCollections } from 'models';
import { cleanSiteNotes } from 'services/siteNotes';

const CollectionRecordInput: React.FC = () => {
    const KEY_COLLAPSE = 1;
    const [activeKey, setActiveKey] = useState(KEY_COLLAPSE);
    const [isOpenModalSelectOption, setIsOpenModalSelectOption] = useState(false);

    const isDisplayUnregisteredContainer = useAppSelector(
        (state) => state.reducer.collection.filter?.isDisplayUnregisteredContainer,
    );

    const cacheSearchCondition = useAppSelector(
        (state) => state.reducer.collection.filter?.searchConditions,
    );

    const [dropdownOptionModal, setDropdownOptionModal] = useState([]);
    const [titleSelectOptionModal, setTitleSelectOptionModal] = useState('');
    const [fieldNameSelected, setFieldNameSelected] = useState<any>('');
    const user = useAppSelector((state) => state.reducer.user);
    const AuthMenu = user?.user?.authorizedMenu;
    const vehicle = useAppSelector((state) => state.reducer.vehicle);
    const [searchParams, setSearchParams] = useSearchParams();
    const isViewOnly = searchParams.get('viewOnly') == 'true' ? true : false;
    const previousPage = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.COLLECTION_RECORD_INPUT],
    );

    const fixedElementRef = useRef();
    const collapsedElementRef = useRef();
    const contentElementRef = useRef();
    const infiniteScrollRef = useRef();

    const cacheWorkingDate = useAppSelector((state) => state.reducer.workingDate.workingDate);
    const workingDate = (isViewOnly && searchParams.get('workingDate')) || cacheWorkingDate;
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);
    const sysPrioritize = systemSetting?.collectionResultInputSetting.prioritize;
    const sysDispatchType = systemSetting?.collectionResultInputSetting.dispatchType;
    // NOTE: isPrioritizeQuantityInput = true thì navigate đến trang 回収数量入力,
    // NOTE: isPrioritizeQuantityInput = false thì navigate đến trang 作業選択 - work selection
    const isPrioritizeQuantityInput =
        sysPrioritize === COLLECTION_RESULT_INPUT_SETTING.PRIORITIZE.QUANTITY_INPUT;

    const pageSize = systemSetting?.commonPageSize || DEFAULT_SYSTEM_SETTING.commonPageSize;
    const location = useLocation();
    const dispatch = useAppDispatch();
    const intervalId = useRef<NodeJS.Timeout | null>();
    const [getAuthenStatus] = useLazyGetStatusAuthQuery();
    const [getCollections, responseGetCollections] = useLazyGetCollectionsQuery();
    const [data, setData] = useState<ICollection[]>([]);
    const navigate = useNavigate();
    const ref = useRef(true);
    const firstRender = ref.current;

    const form = useForm({
        mode: 'all',
        defaultValues: {
            dispatchType: sysDispatchType,
            SearchText: '',
            driverCd: null,
            vehicleCd: null,
            workingDate: null,
            status: [0, 1, 2], 
            orderType: 0,
            orderBy: 0,
            PageNumber: 1,
            PageSize: 0,
        },
    });

    const orderType = useWatch({ control: form.control, name: 'orderType' });
    const orderBy = useWatch({ control: form.control, name: 'orderBy' });

    useEffect(() => {
        if (firstRender) {
            ref.current = false;
        }
    });

    useEffect(() => {
        let driverCd = '';
        let companyCd = '';
        let vehicleCd = '';
        if (isViewOnly) {
            driverCd = searchParams.get('driverCd') || null;
            companyCd = searchParams.get('companyCd') || null;
            vehicleCd = searchParams.get('vehicleCd') || null;
        } else {
            driverCd = user.user.employeeCd;
            companyCd = vehicle?.selectedVehicle.companyCd;
            vehicleCd = vehicle?.selectedVehicle.vehicleCd;
        }

        if (user?.user && vehicle?.selectedVehicle?.vehicleCd && workingDate) {
            if (cacheSearchCondition && !isViewOnly) {
                form.reset({
                    ...cacheSearchCondition,
                    PageNumber: 1,
                    status: cacheSearchCondition.status ? cacheSearchCondition.status : [0, 1, 2],
                    workingDate,
                });
            } else {
                form.setValue('driverCd', driverCd);
                form.setValue('vehicleCd', vehicleCd);
                form.setValue('workingDate', workingDate);
                form.setValue('PageSize', pageSize);
            }

            const params = {
                ...form.getValues(),
                displayUnregisteredContainer: isDisplayUnregisteredContainer,
            };

            handleGetCollections(params, true);
        }
    }, [user, vehicle, cacheWorkingDate]);

    useEffect(() => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
        }
        // eslint-disable-next-line no-unsafe-optional-chaining
        const time = systemSetting?.screenDisplay?.intervalAutoUpdate * 1000;
        if (time) {
            intervalId.current = setInterval(async () => {
                const response = await getAuthenStatus();
                if (response.isSuccess) {
                    const params = {
                        ...form.getValues(),
                        PageNumber: 1,
                        PageSize: data.length,
                        displayUnregisteredContainer: isDisplayUnregisteredContainer,
                    };
                    handleGetCollections(params, true);
                }
            }, time);
        }

        return (): void => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [systemSetting, data]);

    const handleReloadPageData = () => {
        const params = {
            ...form.getValues(),
            PageNumber: 1,
            displayUnregisteredContainer: isDisplayUnregisteredContainer,
        };
        handleGetCollections(params, true);
    };

    const openModalSelectOrderBy = () => {
        setIsOpenModalSelectOption(true);
        setFieldNameSelected('orderBy');
        setTitleSelectOptionModal('並べ替え');
        setDropdownOptionModal(DROPDOWN_ORDER_BY);
    };

    const handleSelectOption = (value) => {
        form.setValue(fieldNameSelected, value);
    };

    const handleChangeSwitchDisplayUnregistered = () => {
        dispatch(setIsDisplayUnregisteredContainer(!isDisplayUnregisteredContainer));
    };

    const renderOrderBy = useMemo(() => DROPDOWN_ORDER_BY[orderBy].label, [orderBy]);

    const handleClickItem = (e, seqNo?) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
            if (isPrioritizeQuantityInput || isViewOnly) {
                navigateToCollectedSummary(seqNo);
            } else {
                navigateToWorkSelection(seqNo);
            }
        }
    };

    const navigateToCollectedSummary = (seqNo) => {
        dispatch(
            setPreviousPage({
                previousUrl: null,
                previousUrlOfPage: CONSTANT_ROUTE.WORK_SELECTION,
            }),
        );
        dispatch(clearCacheCollectedQuantityInput());
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.COLLECTED_SUMMARY,
            }),
        );
        let queryParams = `?seqNo=${seqNo}`;
        if (isViewOnly) {
            queryParams += `&viewOnly=true`;
        }
        navigate(`/${CONSTANT_ROUTE.COLLECTED_SUMMARY}${queryParams}`);
    };

    const navigateToWorkSelection = (seqNo) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.WORK_SELECTION,
            }),
        );

        let queryParams = `?seqNo=${seqNo}`;
        if (isViewOnly) {
            queryParams += `&viewOnly=true`;
        }

        navigate(`/${CONSTANT_ROUTE.WORK_SELECTION}${queryParams}`);
    };

    const navigateToPageSiteNotes = (e: ICollection) => {
        dispatch(cleanSiteNotes());
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.SITE_NOTES,
            }),
        );
        navigate({
            pathname: `/${CONSTANT_ROUTE.SITE_NOTES}`,
            search: `?companyCd=${e.companyCd}&siteCd=${e.siteCd}&seqNo=${e.seqNo}`,
        });
    };

    const navigateToCollectionSiteInformation = (e: ICollection) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.COLLECTION_SITE_INFORMATION,
            }),
        );
        navigate({
            pathname: `/${CONSTANT_ROUTE.COLLECTION_SITE_INFORMATION}`,
            search: `?companyCd=${e.companyCd}&siteCd=${e.siteCd}&seqNo=${e.seqNo}`,
        });
    };

    const loadMore = async () => {
        const params = {
            ...form.getValues(),
            PageNumber: form.getValues('PageNumber') + 1,
            displayUnregisteredContainer: isDisplayUnregisteredContainer,
        };
        handleGetCollections(params, false);
    };

    const handleGetCollections = async (params: IParamsRequestCollections, isSearch) => {
        const response = await getCollections(params).unwrap();
        if (response) {
            form.setValue('PageNumber', params.PageNumber);
            if (isSearch) {
                setData(response.items);
            } else {
                setData([...data, ...response.items]);
            }

            dispatch(setSearchConditions(form.getValues()));
        }
    };

    const toggleCollapse = () => {
        if (activeKey === KEY_COLLAPSE) {
            setActiveKey(null);
        } else {
            setActiveKey(KEY_COLLAPSE);
            if (infiniteScrollRef?.current) {
                (infiniteScrollRef.current as any)?.el.scrollTo(0, 0);
            }
        }
    };

    const renderData = useMemo(() => {
        if (data.length > 0) {
            return (
                <div>
                    <div className='overflow-auto'>
                        {data.map((e, index) => (
                            <div
                                key={e.seqNo}
                                onClick={($event) => handleClickItem($event, e.seqNo)}
                                role='button'
                                className={`shadow-md rounded-lg bg-white p-4 relative ${
                                    index + 1 !== responseGetCollections?.data?.totalRecords
                                        ? 'mb-3'
                                        : ''
                                }`}
                            >
                                {e.isExclusion ? (
                                    <div>
                                        <div className='absolute left-0 w-[6px] h-[100px] bottom-0 top-5 rounded-e-xl bg-[#EDB401]' />
                                        <div className='flex justify-between items-center'>
                                            <span className='text-ssm w-[80px] h-[30px] flex justify-center items-center rounded  text-[#EDB401] bg-[#FFF9DC]'>
                                                作業なし
                                            </span>
                                            <button
                                                type='button'
                                                onClick={($event) =>
                                                    navigateToCollectionSiteInformation(e)
                                                }
                                            >
                                                <img
                                                    src={iconInfo}
                                                    alt='info'
                                                    className='pointer-events-none relative'
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ) : e.status === '0' ? (
                                    <div>
                                        <div
                                            className='absolute left-0 bg-green1A w-[6px] h-[100px] bottom-0 top-5 rounded-e-xl'
                                            style={{
                                                backgroundColor: `#2D9CB5`,
                                            }}
                                        />
                                        <div className='flex justify-between items-center'>
                                            <span
                                                style={{
                                                    backgroundColor: `#EBF8FB`,
                                                    color: `#2D9CB5`,
                                                }}
                                                className='text-ssm w-[80px] h-[30px] flex justify-center items-center rounded'
                                            >
                                                未回収
                                            </span>
                                            <button
                                                type='button'
                                                onClick={($event) =>
                                                    navigateToCollectionSiteInformation(e)
                                                }
                                            >
                                                <img
                                                    src={iconInfo}
                                                    alt='info'
                                                    className='pointer-events-none relative'
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div
                                            className='absolute left-0 bg-green1A w-[6px] h-[100px] bottom-0 top-5 rounded-e-xl'
                                            style={{
                                                backgroundColor: `#22701a`,
                                            }}
                                        />
                                        <div className='flex justify-between items-center'>
                                            <span
                                                style={{
                                                    backgroundColor: `#E8F6E6`,
                                                    color: `#22701a`,
                                                }}
                                                className='text-ssm w-[80px] h-[30px] flex justify-center items-center rounded'
                                            >
                                                回収済
                                            </span>
                                            <button
                                                type='button'
                                                onClick={($event) =>
                                                    navigateToCollectionSiteInformation(e)
                                                }
                                            >
                                                <img
                                                    src={iconInfo}
                                                    alt='info'
                                                    className='pointer-events-none relative'
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {user.user?.isSystemLimit === false && (
                                    <div className='grid grid-cols-[auto_32px] my-3'>
                                        <span className='text-black11 text-xl font-semibold break-all pr-2'>
                                            {e.companyName}
                                        </span>
                                        {AuthMenu?.includes(ROLES.MOBILE003) &&
                                            (e.isExistsSiteNote ? (
                                                <button
                                                    type='button'
                                                    onClick={() => navigateToPageSiteNotes(e)}
                                                >
                                                    <img
                                                        src={iconNotePin}
                                                        alt='note pin'
                                                        className='pointer-events-none'
                                                    />
                                                </button>
                                            ) : (
                                                <button
                                                    type='button'
                                                    onClick={() => navigateToPageSiteNotes(e)}
                                                >
                                                    <img
                                                        src={iconNote}
                                                        alt='note'
                                                        className='ml-[2px] pointer-events-none'
                                                    />
                                                </button>
                                            ))}
                                    </div>
                                )}

                                <div className='text-md mb-3'>
                                    <span className='text-gray93'>現場名：</span>
                                    <span className='text-black52'>{e.siteName}</span>
                                </div>

                                {e.dispatchType === 0 ? (
                                    <div className='mb-3'>
                                        <span className='text-md text-gray93'>コース名：</span>
                                        <span className='text-md text-black52'>{e.courseName}</span>
                                    </div>
                                ) : (
                                    <div className='mb-3'>
                                        <span className='text-md text-gray93'>作業：</span>
                                        <span className='text-md text-black52'>
                                            {e.collectionNote}
                                        </span>
                                        {e.isExistsContainer ? (
                                            e.isExistsContainerUnregistered ? (
                                                <span className='text-ssm'>
                                                    コンテナ作業　
                                                    <span className=' text-red2a'>未登録 </span>
                                                </span>
                                            ) : (
                                                <span className='text-ssm  ml-2'>
                                                    コンテナ作業　登録済
                                                </span>
                                            )
                                        ) : (
                                            <div />
                                        )}
                                    </div>
                                )}

                                <div className='border-t border-t-grayE9'>
                                    <div className='pt-4 pb-1 flex'>
                                        <div className='w-1/2 flex items-center text-black52'>
                                            <img src={iconGrayClock} alt='icon clock' />

                                            {e.arrivalTime && (
                                                <div className='ml-3 text-ssm'>
                                                    <span className='mr-2'>
                                                        {e.arrivalTimeName}
                                                    </span>{' '}
                                                    {dayjs(`1/1/1 ${e.arrivalTime}`).format(
                                                        'HH:mm',
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {!isViewOnly && (
                                            <div className='w-1/2  border-l-2 border-l-grayD4'>
                                                <Button
                                                    htmlType='button'
                                                    onClick={() => navigateToWorkSelection(e.seqNo)}
                                                    className='text-sm text-green15 flex items-center ml-auto justify-end border-0 shadow-none'
                                                >
                                                    <span className='mr-3 pointer-events-none'>
                                                        作業選択
                                                    </span>
                                                    <ArrowRightIcon className='pointer-events-none' />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return (
            <div className=''>
                <span className='text-yellow01 text-sm'>回収現場はありません</span>
            </div>
        );
    }, [data]);

    useEffect(() => {
        const functionHandleScroll = ($event) => {
            checkStyleElement();
        };
        const infiniteScrollComponent = document.getElementsByClassName(
            'infinite-scroll-component',
        )?.[0];

        infiniteScrollComponent.addEventListener('scroll', functionHandleScroll);
        return () => {
            infiniteScrollComponent.removeEventListener('scroll', functionHandleScroll);
        };
    }, []);

    useEffect(() => {
        checkStyleElement();
    }, [activeKey]);

    const checkStyleElement = () => {
        if (
            fixedElementRef.current &&
            collapsedElementRef.current &&
            contentElementRef.current &&
            infiniteScrollRef.current
        ) {
            const collapsed = collapsedElementRef.current as HTMLElement; // Collapse
            const elementFixedOnScroll = fixedElementRef.current as HTMLElement; // Element cần cố định khi scroll
            const content = contentElementRef.current as HTMLElement; // Danh sách || nội dung || dữ liệu trang
            const infiniteScroll = (infiniteScrollRef.current as any)?.el as HTMLElement;
            if (collapsed.classList.contains('opening')) {
                // Collapse OPEN
                if (infiniteScroll.scrollTop >= 289) {
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

    const updateStatus = (checked, statusId) => {
        const status = [...form.watch('status')];
        if (checked) {
            const ind = status.findIndex((e) => e === statusId);
            if (ind === -1) {
                form.setValue('status', [...status, statusId]);
            }
        } else {
            const ind = status.findIndex((e) => e === statusId);
            if (ind !== -1) {
                status.splice(ind, 1);
                form.setValue('status', status);
            }
        }
    };

    const navigateToMainMenu = () => {
        navigate(previousPage || `/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    return (
        // TODO: chưa check isSystemLimit page newMessageIchiran.jsp
        <Layout
            title='回収現場一覧'
            isLoading={responseGetCollections.isLoading || responseGetCollections.isFetching}
            isShowRollback
            isShowDate
            fixedHeader
            onClickRollback={navigateToMainMenu}
        >
            <InfiniteScroll
                ref={infiniteScrollRef}
                dataLength={data.length ?? 0}
                next={loadMore}
                hasMore={data.length < responseGetCollections?.data?.totalRecords}
                loader={<Skeleton paragraph={{ rows: 1 }} active />}
                height={window.innerHeight - 62}
                // onScroll={($event) => checkStyleElement($event)}
            >
                <Collapse
                    activeKey={activeKey}
                    bordered={false}
                    accordion
                    ref={collapsedElementRef}
                    className={`bg-grayE9  !border-0 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:!p-0
                    [&_.ant-collapse-header]:top-header
                    [&_.ant-collapse-header]:bg-green15 
                    [&_.ant-collapse-header]:w-full 
                    [&_.ant-collapse-header]:!rounded-none
                    [&_.ant-collapse-header]:z-10
                    [&_.ant-collapse-header]:left-0
                    [&_.ant-collapse-header]:!transition-none
                    [&_.ant-collapse-content-box]:!p-0
                    [&_.ant-collapse-content]:!rounded-none
                    [&_.ant-collapse-content-box]:bg-grayE9
                   
                     ${
                         activeKey === KEY_COLLAPSE
                             ? `
                            opening 
                        [&_.ant-collapse-content]:mt-[159px]
                        `
                             : `[&_.ant-collapse-item]:!h-[0px] !border-b-[0px]`
                     }`}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    expandIcon={({ isActive }) => (
                        <Container>
                            {' '}
                            <button
                                onClick={() => toggleCollapse()}
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
                        </Container>
                    )}
                    expandIconPosition='end'
                    items={[
                        {
                            key: KEY_COLLAPSE,
                            label: (
                                <div
                                    className='bg-green15 py-2'
                                    onClick={() => toggleCollapse()}
                                    role='button'
                                >
                                    <Container classnames='flex justify-between items-center'>
                                        <div className='flex items-center'>
                                            <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                                検索条件
                                            </span>
                                        </div>
                                    </Container>
                                </div>
                            ),
                            children: activeKey === KEY_COLLAPSE && (
                                <div className='py-5 bg-white'>
                                    <div className='pl-4 pb-4 border-b-2 border-b-grayE9'>
                                        <Controller
                                            control={form.control}
                                            name='dispatchType'
                                            render={({ field }) => (
                                                <Radio.Group
                                                    {...field}
                                                    className='[&_span]:text-ssm flex gap-y-2 flex-wrap'
                                                >
                                                    {DISPATCH_TYPES.map((e) => (
                                                        <Radio
                                                            key={e.value}
                                                            value={e.value}
                                                            className='whitespace-nowrap [&_span]:!pr-0'
                                                        >
                                                            {e.label}
                                                        </Radio>
                                                    ))}
                                                </Radio.Group>
                                            )}
                                        />
                                    </div>
                                    <div className='p-4 border-b-2 border-b-grayE9'>
                                        <span className='text-md text-green1A block'>回収状況</span>
                                        <div className='flex flex-wrap gap-y-2 mt-3'>
                                            <div className='flex items-center'>
                                                <Switch
                                                    checked={form.watch('status')?.includes(0)}
                                                    onChange={(checked) => {
                                                        updateStatus(checked, 0);
                                                    }}
                                                />
                                                <span className='block mx-2 text-ssm'>未回収</span>
                                            </div>
                                            <div className='flex items-center'>
                                                <Switch
                                                    checked={form.watch('status')?.includes(1)}
                                                    onChange={(checked) => {
                                                        updateStatus(checked, 1);
                                                    }}
                                                />
                                                <span className='block mx-2 text-ssm'>回収済</span>
                                            </div>
                                            <div className='flex items-center'>
                                                <Switch
                                                    checked={form.watch('status')?.includes(2)}
                                                    onChange={(checked) => {
                                                        updateStatus(checked, 2);
                                                    }}
                                                />
                                                <span className='block mx-2 text-ssm'>作業なし</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Container>
                                        <div className='flex items-center py-4'>
                                            <Switch
                                                checked={isDisplayUnregisteredContainer}
                                                onChange={() =>
                                                    handleChangeSwitchDisplayUnregistered()
                                                }
                                            />
                                            <span className='block ml-3 text-ssm'>
                                                コンテナ作業未登録分を常に表示
                                            </span>
                                        </div>
                                        <div className='flex items-center'>
                                            <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[70px]'>
                                                並び順
                                            </span>
                                            <Input
                                                className='h-[44px] disabled-bg-white mr-2 text-ssm'
                                                disabled
                                                value={renderOrderBy}
                                            />
                                            <button
                                                type='button'
                                                className='rounded border border-green15 h-[44px] min-w-[44px] mr-2 text-center bg-green1A'
                                                onClick={() => openModalSelectOrderBy()}
                                            >
                                                <svg
                                                    width='31'
                                                    height='25'
                                                    className='m-auto'
                                                    viewBox='0 0 31 25'
                                                    fill='white'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <rect
                                                        x='1.26282'
                                                        y='4.00195'
                                                        width='28'
                                                        height='3'
                                                        rx='1.5'
                                                        transform='rotate(0.036622 1.26282 4.00195)'
                                                    />
                                                    <rect
                                                        x='5.2583'
                                                        y='11.0039'
                                                        width='20'
                                                        height='3'
                                                        rx='1.5'
                                                        transform='rotate(0.036622 5.2583 11.0039)'
                                                    />
                                                    <rect
                                                        x='9.25385'
                                                        y='18.0059'
                                                        width='12'
                                                        height='3'
                                                        rx='1.5'
                                                        transform='rotate(0.036622 9.25385 18.0059)'
                                                    />
                                                </svg>
                                            </button>

                                            <button
                                                type='button'
                                                className='rounded border border-green15 h-[44px] min-w-[44px] mr-2 text-center bg-white'
                                                onClick={() =>
                                                    form.setValue('orderType', SORT_TYPE.ASCENDING)
                                                }
                                            >
                                                <svg
                                                    width='30'
                                                    height='24'
                                                    viewBox='0 0 30 24'
                                                    className={`m-auto ${
                                                        orderType === SORT_TYPE.ASCENDING
                                                            ? 'fill-green1A'
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
                                                className='rounded border border-green15 h-[44px] min-w-[44px] text-center bg-white'
                                                onClick={() =>
                                                    form.setValue('orderType', SORT_TYPE.DESCENDING)
                                                }
                                            >
                                                <svg
                                                    width='30'
                                                    height='24'
                                                    viewBox='0 0 30 24'
                                                    className={`m-auto
                                            ${
                                                orderType === SORT_TYPE.DESCENDING
                                                    ? 'fill-green1A'
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
                                    </Container>
                                </div>
                            ),
                        },
                    ]}
                />
                <div className='bg-green15 py-2' ref={fixedElementRef}>
                    <FuncBlock
                        leftChild={
                            <div className='flex items-center '>
                                <span className='font-semibold text-white text-md mb-0 mr-3'>
                                    現場一覧
                                </span>
                                <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                                    {responseGetCollections?.data?.totalRecords || 0}
                                </div>
                            </div>
                        }
                        isShowIconRefresh
                        onClickRefresh={() => handleReloadPageData()}
                    />
                </div>

                <div className='py-5' ref={contentElementRef}>
                    <Container>{renderData}</Container>
                </div>
            </InfiniteScroll>

            <ModalSelectOption
                open={isOpenModalSelectOption}
                setOpen={setIsOpenModalSelectOption}
                dropdown={dropdownOptionModal}
                handleSelect={handleSelectOption}
                title={titleSelectOptionModal}
                defaultValue={form.watch(fieldNameSelected)}
            />
        </Layout>
    );
};
export default CollectionRecordInput;
