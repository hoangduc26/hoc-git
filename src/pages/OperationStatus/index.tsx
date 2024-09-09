/* eslint-disable react-hooks/exhaustive-deps */
import Layout from 'components/templates/Layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import 'react-times/css/classic/default.css';
import 'react-times/css/material/default.css';
import './index.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import iconInputClear from 'assets/icons/icon-input-clear.svg';
import Container from 'components/organisms/container';
import iconInputSearch from 'assets/icons/ic_search.svg';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import ReactMapGL, { FlyToInterpolator, Marker, Popup } from 'react-map-gl';
import { Button, Image, Input, Spin } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { OperationStatusApi, useGetMapBoxInfoQuery } from 'services/operations';
import { useLazyGetLocationQuery } from 'services/location';
import { CONSTANT_ROUTE } from 'utils/constants';
import { useNavigate } from 'react-router-dom';
import FuncBlock from 'components/common/FuncBlock';
import { ILocation } from 'models/location';
import { useDispatch } from 'react-redux';
import { setPreviousPage } from 'services/page';
import { LocationIcon } from 'components/icons/LocationIcon';
import { FilterSvg } from 'components/icons/FilterSvg';
import ModalSelectDriver from 'components/common/Modal/ModalSelectDriver';
import { IDriver } from 'models/driver';
import { useAppSelector } from 'store/hooks';

dayjs.locale('ja');

const OperationStatus: React.FC = () => {
    const today = new Date(Date.now()).toLocaleDateString('zh-Hans-CN');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [driver, setDriver] = useState<IDriver>(null);
    const [openModalSearchDriver, setOpenModalSearchDriver] = useState(false);
    const [locations, setLocations] = useState<ILocation[]>([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const isFixedMap = window.innerHeight > 800;
    const [placeNames, setPlaceNames] = useState([]);
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.OPERATION_STATUS],
    );
    const [viewPort, setViewPort] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 10,
    });

    const {
        data: dataMapBox,
        isLoading: isLoadingData,
        isFetching: isFetchingData,
    } = useGetMapBoxInfoQuery();

    const [trigger] = OperationStatusApi.endpoints.getMapBoxInfo.useLazyQuery();

    const mapStyleApi = dataMapBox?.mapStyle.slice(16, dataMapBox?.mapStyle.length);
    const mapTokenApi = dataMapBox?.accessToken;

    const [
        getDataMapOperation,
        { data: dataOperationMap, isLoading, isFetching: isFetchingDataOperation },
    ] = useLazyGetLocationQuery();

    useEffect(() => {
        setLocations(dataOperationMap || []);
        if (dataOperationMap?.[0]) {
            setViewPort((prevValue) => ({
                ...prevValue,
                latitude: dataOperationMap[0]?.latitude,
                longitude: dataOperationMap[0]?.longitude,
            }));

            if (driver) {
                setSelectedMarker(dataOperationMap[0]);
            }
        }
    }, [dataOperationMap]);

    useEffect(() => {
        setViewPort((prevValue) => ({
            ...prevValue,
            latitude: 35.652832,
            longitude: 139.839478,
        }));
        getDataOperation();
    }, []);

    useEffect(() => {
        if (locations && mapTokenApi) {
            locations?.forEach((data) => {
                setViewPort((prevValue) => ({
                    ...prevValue,
                    latitude: data?.latitude,
                    longitude: data?.longitude,
                }));
                fetchAddress(data);
            });
        }
    }, [locations, mapTokenApi]);

    const getDataOperation = () => {
        const params = {
            refDate: new Date().toISOString(),
            driverCd: driver ? driver.cd : undefined,
        };
        getDataMapOperation(params);
    };

    const fetchAddress = async (data: ILocation) => {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${data?.longitude},${data?.latitude}.json?access_token=${mapTokenApi}&language=ja`,
        );
        const placeName = response.data.features[0]?.place_name;
        setPlaceNames((prevValue) => [...prevValue, { idLocation: data.id, placeName }]);
    };

    const handleLatitudeChange = (newLat, newLng) => {
        setViewPort({
            latitude: newLat,
            longitude: newLng,
            zoom: 15,
        });
    };

    const handleClickRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    const handleNavigateToCollectionRecordInput = (data: ILocation) => {
        dispatch(
            setPreviousPage({
                previousUrl: `/${CONSTANT_ROUTE.OPERATION_STATUS}`,
                previousUrlOfPage: CONSTANT_ROUTE.COLLECTION_RECORD_INPUT,
            }),
        );

        const workingDate = dayjs(new Date()).format('YYYY-MM-DD');

        navigate({
            pathname: `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`,
            search: `?viewOnly=true&driverCd=${data.driverCd}&vehicleCd=${data.vehicleCd}&workingDate=${workingDate}`,
        });
    };

    const handleSelectDriver = (data: IDriver) => {
        setDriver(data);
        setOpenModalSearchDriver(false);
    };

    const handleSelectMarker = (data: ILocation) => {
        setSelectedMarker(data);
    };

    const handleClickRefresh = () => {
        trigger();
        setPlaceNames([]);
        setSelectedMarker(null);
        getDataOperation();
    };

    const placeNameOfSelectedMarker = useMemo(() => {
        if (selectedMarker) {
            const placeName = placeNames.find((e) => e.idLocation === selectedMarker.id)?.placeName;
            return placeName || '';
        }
        return '';
    }, [selectedMarker, placeNames]);

    const renderSelectedData = useMemo(() => {
        // {/* ポイントを選択してください =====>  Hãy chọn một điểm.. */}
        // {/* 稼働状況はありません =====> Không có trạng thái hoạt động => ?? check display */}
        if (!locations || locations.length === 0) {
            return (
                <div className='p-4'>
                    <div className='text-sm text-yellow01'>稼働状況はありません.</div>
                </div>
            );
        }

        if (!selectedMarker) {
            return (
                <div className='p-4'>
                    <div className='text-sm text-yellow01'>ポイントを選択してください.</div>
                </div>
            );
        }
        return (
            <div
                role='navigation'
                className='bg-white p-4 hover:opacity-90 cursor-pointer'
                onClick={(e) => {
                    e.preventDefault();
                    handleLatitudeChange(selectedMarker?.latitude, selectedMarker?.longitude);
                }}
            >
                <div />
                <h1 className='font-medium text-xl mb-2' style={{ color: 'var(--sub-color)' }}>
                    {selectedMarker?.driverName} ( {selectedMarker?.driverName} )
                </h1>
                <div className='text-gray68 text-sm mb-2'>
                    時間 :
                    <span className='text-black27'>
                        {dayjs(selectedMarker?.updateDate).format('H時 m分')}
                    </span>
                </div>
                <div className='text-gray68 text-sm mb-2'>
                    場所 : <span className='text-black27'>{placeNameOfSelectedMarker}</span>
                </div>

                <div className='text-gray68 text-sm mb-2'>
                    状況 :
                    <span className='text-black27'>
                        {(selectedMarker?.collected || 0) +
                            (selectedMarker?.uncollected || 0) +
                            (selectedMarker?.exclusion || 0) ===
                        0
                            ? ''
                            : ` 未${selectedMarker?.uncollected || 0} 
                            済${selectedMarker?.collected || 0} 
                            除${selectedMarker?.exclusion || 0} 
                            (計${
                                (selectedMarker?.collected || 0) +
                                (selectedMarker?.uncollected || 0) +
                                (selectedMarker?.exclusion || 0)
                            })`}
                    </span>
                </div>
                <div className='text-gray68 text-sm mb-2'>
                    車輌 :{' '}
                    <span className='text-black27'>
                        {selectedMarker?.vehicleName || ''}{' '}
                        {`${
                            selectedMarker?.vehicleTypeName === null
                                ? ''
                                : `(${selectedMarker?.vehicleTypeName})`
                        }`}
                    </span>
                </div>

                <button
                    onClick={() => handleNavigateToCollectionRecordInput(selectedMarker)}
                    type='button'
                    className=' w-full border border-[var(--main-color)] rounded-xl py-3 hover:bg-[var(--sub-color)] '
                >
                    回収状況
                </button>
            </div>
        );
    }, [selectedMarker, locations, driver, placeNameOfSelectedMarker]);

    return (
        <Layout
            isShowDate={false}
            onClickRollback={() => handleClickRollback()}
            isShowRollback
            isLoading={isFetchingData || isLoadingData || isFetchingDataOperation}
            title={null}
            isHiddenPageHeader
            fixedHeader
        >
            <div className='fixed top-[66px] z-10 w-full'>
                <FuncBlock
                    bgColor='bg-green1A'
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>稼働状況</h2>
                        </div>
                    }
                    isShowIconRefresh
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    onClickRefresh={() => handleClickRefresh()}
                />
            </div>
            <div className={`${isFixedMap ? 'fixed top-[114px] z-10 w-full' : 'mt-[114px]'}`}>
                <div className='py-3 bg-white '>
                    <Container classnames='flex items-center'>
                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-4'>
                            運転者
                        </span>
                        <Input
                            className='h-[44px] disabled-bg-white'
                            disabled
                            value={driver?.name}
                            prefix={<img src={iconInputSearch} alt='icon input search' />}
                            suffix={
                                driver && (
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setDriver(null);
                                        }}
                                    >
                                        <img src={iconInputClear} alt='icon input clear' />
                                    </button>
                                )
                            }
                        />

                        <button
                            type='button'
                            onClick={() => {
                                setOpenModalSearchDriver(true);
                            }}
                            className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                        >
                            <FilterSvg className='m-auto' />
                        </button>
                    </Container>
                </div>
                {mapTokenApi && (
                    <ReactMapGL
                        {...viewPort}
                        width='100%'
                        height='264px'
                        mapboxApiAccessToken={mapTokenApi}
                        mapStyle={`https://api.mapbox.com/styles/v1/${mapStyleApi}?access_token=${mapTokenApi}`}
                        onViewportChange={(viewport) => setViewPort(viewport)}
                        transitionInterpolator={new FlyToInterpolator()}
                        transitionDuration={200}
                    >
                        {locations?.length === 0 || locations === null || locations === undefined
                            ? ''
                            : locations?.map((data, number) => (
                                  <Marker
                                      key={data.id}
                                      latitude={data.latitude}
                                      longitude={data.longitude}
                                      offsetLeft={-20}
                                      offsetTop={-30}
                                      className='text-center'
                                  >
                                      <span role='button' onClick={() => handleSelectMarker(data)}>
                                          <LocationIcon
                                              className={`w-[50px] h-[50px] ${
                                                  selectedMarker?.id === data.id ? 'active' : ''
                                              }`}
                                          />
                                      </span>
                                  </Marker>
                              ))}
                    </ReactMapGL>
                )}

                <div className='py-4 px-4 bg-white'>
                    <p className='text-[#272727] text-[18px] font-semibold	'>
                        ※本日、モバイル将軍を使用した直近の位置情報を表示しています
                    </p>
                </div>
                <div className='header_noti bg-[var(--sub-color)] py-3'>
                    <Container classnames='flex justify-between items-center'>
                        <p className='w-fit  text-[white] mb-0 text-md font-semibold font-inter'>
                            稼働状況
                        </p>
                        <div className={`flex items-center `}>
                            <p className='w-fit text-white mb-0 text-[18px] font-medium font-zenMaru'>
                                {dayjs(today).format('YYYY/MM/DD')}
                            </p>
                            <div className='w-[24px] h-[24px] ml-3'>
                                <img
                                    src={iconCalendar}
                                    className='w-full h-full object-cover'
                                    alt='calendar-date'
                                />
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            <div
                className={
                    isFixedMap ? `${window.innerWidth < 571 ? 'mt-[586px]' : 'mt-[559px]'}` : ''
                }
            >
                {renderSelectedData}
            </div>

            <ModalSelectDriver
                open={openModalSearchDriver}
                setOpen={setOpenModalSearchDriver}
                handleSelectItem={handleSelectDriver}
            />
        </Layout>
    );
};

export default OperationStatus;
