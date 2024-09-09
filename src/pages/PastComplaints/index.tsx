/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from 'components/templates/Layout';
import Container from 'components/organisms/container';
import { Button, Collapse, Radio, Skeleton } from 'antd';
import { CONSTANT_ROUTE, PAGE_SIZE } from 'utils/constants';
import { useAppSelector } from 'store/hooks';
import { useLazyGetPastComplaintsQuery } from 'services/pastComplaints';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';
import { IParamsRequestGetPastComplaint, IPastComplaint } from 'models/pastComplaint';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { useDispatch } from 'react-redux';
import { setPreviousPage } from 'services/page';
import { SkylineIcon } from 'components/icons/SkylineIcon';
import { RefreshBorderIcon } from 'components/icons/RefreshBorderIcon';

dayjs.locale('ja');

const PastComplaints = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [completionType, setcompletionType] = useState(0);
    const [getPastComplaint, responseGetPastComplaint] = useLazyGetPastComplaintsQuery();
    const [companyName, setCompanyName] = useState('');
    const [siteName, setSiteName] = useState('');
    const location = useLocation();
    const dispatch = useDispatch();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.PAST_COMPLAINTS],
    );
    const [data, setData] = useState<IPastComplaint[]>([]);

    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        setSiteName(searchParams.get('siteName') || '');
        setCompanyName(searchParams.get('companyName') || '');
    }, []);

    useEffect(() => {
        handleSearch();
    }, [completionType]);

    const handleRadioGroupChange = (e) => {
        setcompletionType(e.target.value);
    };

    const handleRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.FACILITY_INFORMATION}`);
    };

    const handleRefresh = () => {
        handleSearch();
    };

    const handleSearch = () => {
        const params: IParamsRequestGetPastComplaint = {
            CompanyCd: searchParams.get('companyCd'),
            SiteCd: searchParams.get('siteCd'),
            CompletionType: completionType,
            PageNumber: 1,
            PageSize: paging.PageSize,
        };
        handleGetData(params, true);
    };

    const loadMoreData = async () => {
        const params: IParamsRequestGetPastComplaint = {
            CompanyCd: searchParams.get('companyCd'),
            SiteCd: searchParams.get('siteCd'),
            CompletionType: completionType,
            PageNumber: paging.PageNumber + 1,
            PageSize: paging.PageSize,
        };
        handleGetData(params);
    };

    const handleGetData = async (params, isSearch?) => {
        const response = await getPastComplaint(params).unwrap();
        if (response) {
            setPaging({
                ...paging,
                PageNumber: params.PageNumber,
                totalRecords: response.totalRecords,
            });
            if (isSearch) {
                setData(response.items);
            } else {
                setData([...data, ...response.items]);
            }
        }
    };

    const viewDetail = (e: IPastComplaint) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.PAST_COMPLAINT_DETAIL,
            }),
        );

        navigate({
            pathname: `/${CONSTANT_ROUTE.PAST_COMPLAINT_DETAIL}`,
            search: `?siteName=${e?.siteName || ''}
            &systemId=${e?.systemId || ''}
            &companyName=${e?.companyName || ''}
            &seqNo=${e?.seq || ''}`,
        });
    };

    const renderData = useMemo(() => {
        if (data.length > 0) {
            return (
                <div>
                    <div
                        id='pastComplaintsContainer'
                        className='overflow-auto h-[calc(100vh_-_220px)]'
                    >
                        <InfiniteScroll
                            dataLength={data.length ?? 0}
                            next={loadMoreData}
                            hasMore={data.length < paging.totalRecords}
                            loader={<Skeleton paragraph={{ rows: 1 }} active />}
                            scrollableTarget='pastComplaintsContainer'
                        >
                            {data.map((d, index) => (
                                <div
                                    key={index}
                                    role='button'
                                    onClick={($event) => viewDetail(d)}
                                    className={`shadow-md rounded-lg bg-white py-3 mb-3 relative `}
                                >
                                    <div className='grid grid-cols-[auto_15px] mb-2 px-4'>
                                        <span className='text-green1A text-md font-semibold break-all pr-2'>
                                            {d.titleName}
                                        </span>
                                    </div>
                                    <div className='absolute left-0 bg-green1A w-[6px] bottom-0 rounded-e-xl h-[60px] top-1/2 -translate-y-1/2' />
                                    <div>
                                        <div className='text-ssm mb-1 px-4 flex'>
                                            <span className='text-gray93 whitespace-nowrap min-w-[48px]'>
                                                受付日
                                            </span>
                                            <span className='text-gray93'>：</span>
                                            <span className='text-black52  whitespace-nowrap overflow-hidden text-ellipsis'>
                                                {d.receptionDate &&
                                                    dayjs(new Date(d.receptionDate)).format(
                                                        'YYYY/MM/DD(dd)',
                                                    )}
                                            </span>
                                        </div>

                                        <div className='text-ssm mb-1 px-4 flex'>
                                            <span className='text-gray93 whitespace-nowrap min-w-[48px]'>
                                                完了日
                                            </span>
                                            <span className='text-gray93'>：</span>
                                            <span className='text-black52  whitespace-nowrap overflow-hidden text-ellipsis'>
                                                {d.responseCompletedDate &&
                                                    dayjs(new Date(d.responseCompletedDate)).format(
                                                        'YYYY/MM/DD(dd)',
                                                    )}
                                            </span>
                                        </div>
                                        <div className='text-ssm px-4 flex items-start'>
                                            <span className='text-gray93 whitespace-nowrap min-w-[48px]'>
                                                內 容
                                            </span>
                                            <span className='text-gray93'>：</span>
                                            <div>
                                                <span className='text-black52 mb-2 block'>
                                                    {d.content1}
                                                </span>
                                                <span className='text-black52 mb-2 block'>
                                                    {d.content2}
                                                </span>
                                                <span className='text-black52 mb-2 block'>
                                                    {d.content3}
                                                </span>
                                                <span className='text-black52 mb-2 block'>
                                                    {d.content4}
                                                </span>
                                                <span className='text-black52 mb-2 block'>
                                                    {d.content5}
                                                </span>
                                                <span className='text-black52 mb-2 block'>
                                                    {d.content6}
                                                </span>
                                                <span className='text-black52 mb-2 block'>
                                                    {d.content7}
                                                </span>
                                                <span className='text-black52 mb-2 block'>
                                                    {d.content8}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </InfiniteScroll>
                    </div>
                </div>
            );
        }
        return (
            <div className=''>
                <span className='text-yellow01 text-sm'>過去クレームはありません</span>
            </div>
        );
    }, [data]);

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
                if (boundingClientRect.top <= 159 && documentElement.scrollTop >= 50) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '159px';
                    elementFixedOnScroll.style.zIndex = '10';
                    elementFixedOnScroll.style.borderTop = '1px solid white';
                    content.style.marginTop = '50px';
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
                content.style.marginTop = '208px';
            }
        }
    };
    return (
        <Layout
            title='過去クレーム一覧'
            isShowRollback
            isLoading={responseGetPastComplaint.isLoading || responseGetPastComplaint.isFetching}
            onClickRollback={handleRollback}
            fixedHeader
        >
            <Collapse
                onChange={($event) => handleChangeCollapse($event)}
                defaultActiveKey='1'
                ref={collapsedElementRef}
                expandIconPosition='end'
                className={`bg-green15 border !border-green15 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:top-header 
                    [&_.ant-collapse-header]:bg-green15 
                    [&_.ant-collapse-header]:w-full 
                    [&_.ant-collapse-header]:!rounded-none
                    [&_.ant-collapse-header]:z-10
                    [&_.ant-collapse-header]:left-0
                    [&_.ant-collapse-header]:!transition-none
                    [&_.ant-collapse-content-box]:!p-0
                     ${
                         isOpenSearchConditions
                             ? `
                            opening 
                        [&_.ant-collapse-content]:mt-[166px]
                        `
                             : ``
                     }`}
                // eslint-disable-next-line react/no-unstable-nested-components
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
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>検索条件</h2>
                        ),
                        className:
                            '[&>.ant-collapse-content]:!rounded-none [&>.ant-collapse-header]:!rounded-none [&>.ant-collapse-header]:!items-center [&>.ant-collapse-header]:!p-[8px_16px] !rounded-none [&_.ant-collapse-content-box]:!p-[0px]',
                        children: (
                            <div className='bg-white py-3 text-md'>
                                <Container>
                                    <Radio.Group
                                        className='[&_span]:text-ssm flex text-ssm flex flex-wrap gap-y-3'
                                        onChange={(e) => handleRadioGroupChange(e)}
                                        value={completionType}
                                    >
                                        <Radio value={0} className='whitespace-nowrap'>
                                            未完了
                                        </Radio>
                                        <Radio value={1} className='whitespace-nowrap'>
                                            完了
                                        </Radio>
                                        <Radio value={undefined} className='whitespace-nowrap'>
                                            全て表示
                                        </Radio>
                                    </Radio.Group>
                                </Container>
                            </div>
                        ),
                    },
                ]}
            />
            <div className='bg-green15 py-2' ref={fixedElementRef}>
                <Container classnames='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                            クレーム一覧
                        </span>
                        <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold'>
                            {paging.totalRecords || 0}
                        </span>
                    </div>
                    <div role='button' onClick={() => handleRefresh()}>
                        <RefreshBorderIcon />
                    </div>
                </Container>
            </div>
            <div>
                <div className='py-5' ref={contentElementRef}>
                    <Container>{renderData}</Container>
                </div>
            </div>
        </Layout>
    );
};

export default PastComplaints;
