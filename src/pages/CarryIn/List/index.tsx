/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import Layout from 'components/templates/Layout';
import Container from 'components/organisms/container';
import iconInfo from 'assets/icons/ic_info_blue_has_border.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CONSTANT_ROUTE, PAGE_SIZE } from 'utils/constants';
import iconRedDelete from 'assets/icons/ic-red-delete.svg';
import {
    useLazyGetDeliveryRecordsQuery,
} from 'services/deliveryRecord';
import { IDeliveryRecord, IParamsRequestGetDeliveryRecord } from 'models/deliveryRecord';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Modal, Skeleton } from 'antd';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { setPreviousPage } from 'services/page';
import { AddIcon } from 'components/icons/AddIcon';
import { EditIcon } from 'components/icons/EditIcon';

dayjs.locale('ja');

const CarryInList = () => {
    const vehicle = useAppSelector((state) => state.reducer.vehicle);
    const navigate = useNavigate();
    const location = useLocation();
    const workingDate = useAppSelector((state) => state.reducer.workingDate.workingDate);
    const [getData, responseData] = useLazyGetDeliveryRecordsQuery();
    const dispatch = useDispatch();
    const [data, setData] = useState<IDeliveryRecord[]>([]);
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    useEffect(() => {
        reloadData();
    }, []);

    const reloadData = () => {
        const params: IParamsRequestGetDeliveryRecord = {
            VehicleCd: vehicle.selectedVehicle?.vehicleCd || null,
            CarrierCd: vehicle.selectedVehicle?.companyCd || null,
            WorkDate: workingDate,
            PageNumber: 1,
            PageSize: paging.PageSize,
        };
        handleGetData(params, true);
    };

    const loadMore = () => {
        const params: IParamsRequestGetDeliveryRecord = {
            VehicleCd: vehicle.selectedVehicle?.vehicleCd || null,
            CarrierCd: vehicle.selectedVehicle?.companyCd || null,
            WorkDate: workingDate,
            PageNumber: paging.PageNumber + 1,
            PageSize: paging.PageSize,
        };
        handleGetData(params);
    };

    const handleGetData = async (params, isReload?) => {
        const response = await getData(params).unwrap();
        if (response) {
            setPaging({
                ...paging,
                PageNumber: params.PageNumber,
                totalRecords: response.totalRecords,
            });
            setData([...data, ...response.items]);
            if (isReload) {
                setData(response.items);
            } else {
                setData([...data, ...response.items]);
            }
        }
    };

    const viewFacilityInformation = ($event, item: IDeliveryRecord) => {
        $event.stopPropagation();
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.FACILITY_INFORMATION,
            }),
        );
        navigate({
            pathname: `/${CONSTANT_ROUTE.FACILITY_INFORMATION}`,
            search: `?siteCd=${item.siteCd}&companyCd=${item.companyCd}`,
        });
    };

    const renderData = useMemo(() => {
        if (data.length > 0) {
            return (
                <div>
                    <div
                        id='carryInListContainer'
                        className='overflow-auto h-[calc(100vh_-_260px)]'
                    >
                        <InfiniteScroll
                            dataLength={data.length ?? 0}
                            next={loadMore}
                            hasMore={data.length < responseData.data?.totalRecords}
                            loader={<Skeleton paragraph={{ rows: 1 }} active />}
                            scrollableTarget='carryInListContainer'
                        >
                            {data.map((e, index) => (
                                <div
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                     
                                    className={`shadow-md rounded-lg bg-white pt-3 ${
                                        index + 1 !== data.length ? 'mb-3' : ''
                                    }`}
                                >
                                    <div className='grid grid-cols-[auto_38px] mb-1 relative px-3 items-center'>
                                        <span
                                            className={`
                                             text-md font-semibold break-all pr-2
                                            ${e.siteStts === '2' ? 'text-green1A' : 'text-red2a'}
                                            `}
                                        >
                                            {e.siteStts === '2' ? '搬入済' : '未搬入'}
                                        </span>
                                        <button
                                            type='button'
                                            onClick={($event) => viewFacilityInformation($event, e)}
                                        >
                                            <img
                                                src={iconInfo}
                                                alt='info'
                                                className='pointer-events-none ml-[3px]'
                                            />
                                        </button>
                                        <div
                                            className={`
                                        absolute left-0 w-[6px] top-0 bottom-0 rounded-e-xl
                                            ${e.siteStts === '2' ? 'bg-green1A' : 'bg-red2a'}

                                        `}
                                        />
                                    </div>
                                    <div className='text-sm mb-1 px-4 flex items-start'>
                                        <span className='text-gray93 whitespace-nowrap'>
                                            搬入日：
                                        </span>
                                        <span className='text-black52'>
                                            {e.deliveryDate &&
                                                dayjs(e.deliveryDate).format(
                                                    'YYYY/MM/DD(dd) HH:mm',
                                                )}
                                        </span>
                                    </div>
                                    <div className='text-sm mb-1 px-4 flex items-start'>
                                        <span className='text-gray93 whitespace-nowrap'>
                                            業者名：
                                        </span>
                                        <span className='text-black52'>{e.companyName}</span>
                                    </div>
                                    <div className='text-sm px-4 flex items-start'>
                                        <span className='text-gray93 whitespace-nowrap'>
                                            現場名：
                                        </span>
                                        <span className='text-black52'>{e.siteName}</span>
                                    </div>
                                    <div className='px-4 mt-4'>
                                        <div className='flex py-4 items-center border-t border-t-grayE9'>
                                            <div className='w-1/2 border-r-2 border-grayD4 flex items-center gap-2' role='button' onClick={() => navigateToPageUpdate(e)}>
                                                <div className='w-6 h-6'>
                                                    <EditIcon className='w-full h-full object-cover' />
                                                </div>
                                                <p className='text-ssm text-green15 font-zenMaru'>
                                                    編集
                                                </p>
                                            </div>

                                            <div className='w-1/2'>
                                                <div
                                                    role='button'
                                                    className='flex items-center gap-2 justify-end'
                                                    onClick={($event) => navigateToPageDelete($event, e)}
                                                >
                                                    <p className='text-ssm text-red2a  font-zenMaru'>
                                                        削除
                                                    </p>
                                                    <div className='w-6 h-6'>
                                                        <img
                                                            src={iconRedDelete}
                                                            className='w-full h-full object-contain'
                                                            alt='edit'
                                                        />
                                                    </div>
                                                </div>
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
                {/* TODO: update en -> jp */}
                {/* TODO: chưa có message empty data ? */}
                {/* <span className='text-yellow01 text-sm'>empty data</span> */}
            </div>
        );
    }, [data]);

    const navigateToPageAddNew = () => {
        navigate(`/${CONSTANT_ROUTE.CARRY_IN_INPUT}`);
    };

    const navigateToPageUpdate = (item: IDeliveryRecord) => {
        navigate({
            pathname: `/${CONSTANT_ROUTE.CARRY_IN_INPUT}`,
            search: `?deliverySeqNo=${item.deliverySeqNo}`,
        });
    };

    const navigateToPageDelete = ($event, item: IDeliveryRecord) => {
        $event.stopPropagation();
        navigate({
            pathname: `/${CONSTANT_ROUTE.CARRY_IN_INPUT}`,
            search: `?deliverySeqNo=${item.deliverySeqNo}&isDelete=true`,
        });
    };

    const handleClickRollback = () => {
        navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    return (
        <Layout
            isShowDate
            title='搬入先現場一覧'
            isShowRollback
            isLoading={
                responseData.isLoading ||
                responseData.isFetching
            }
            onClickRollback={handleClickRollback}
        >
            <div className='bg-green15 py-2'>
                <Container classnames='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3 '>
                            搬入先施設
                        </span>
                        <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold'>
                            {responseData?.data?.totalRecords || 0}
                        </span>
                    </div>
                    <button type='button' onClick={() => navigateToPageAddNew()}>
                        <AddIcon />
                    </button>
                </Container>
            </div>
            <div className='py-5'>
                <Container>{renderData}</Container>
            </div>
        </Layout>
    );
};

export default CarryInList;
