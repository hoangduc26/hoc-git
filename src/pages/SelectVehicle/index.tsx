/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unstable-nested-components */
import { Button, Collapse, Input } from 'antd';
import iconCheck from 'assets/icons/ic_check.svg';
import iconInputClear from 'assets/icons/icon-input-clear.svg';
import iconInputSearch from 'assets/icons/ic_search.svg';
import Calendar from 'components/common/Calendar';
import ModalSelectVehicleType from 'components/common/Modal/ModalSelectVehicleType';
import Container from 'components/organisms/container';
import Layout from 'components/templates/Layout';
import dayjs from 'dayjs';
import { IVehicle, IVehicleType } from 'models/vehicle';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearVehicle, saveVehicle, useGetVehiclesQuery } from 'services/vehicle';
import { saveWorkingDate } from 'services/workingDate';
import { useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE, SETTING_WHEN_SELECT_VEHICLE } from 'utils/constants';
import { compareString, openConfirm } from 'utils/functions';
import { SelectedVehicleSvg } from 'components/icons/SelectedVehicleSvg';
import { TruckSvg } from 'components/icons/TruckSvg';
import { FilterSvg } from 'components/icons/FilterSvg';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';

const days = [
    {
        value: 1,
        display: '月',
    },
    {
        value: 2,
        display: '火',
    },
    {
        value: 3,
        display: '水',
    },
    {
        value: 4,
        display: '木',
    },
    {
        value: 5,
        display: '金',
    },
    {
        value: 6,
        display: '土',
    },
    {
        value: 0,
        display: '日',
    },
];

const SelectVehicle: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const user = useAppSelector((state) => state.reducer.user);
    const vehicle = useAppSelector((state) => state.reducer.vehicle);
    const workingDate = useAppSelector((state) => state.reducer.workingDate.workingDate);
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [keyword, setKeyword] = useState('');

    const fixedElementRef = useRef();
    const collapsedElementRef = useRef();
    const contentElementRef = useRef();

    const KEY_COLLAPSE = '1';
    const [activeKey, setActiveKey] = useState(KEY_COLLAPSE);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data: vehicles, isLoading } = useGetVehiclesQuery({});

    useEffect(() => {
        if (
            systemSetting?.settingWhenSelectVehicle !==
            SETTING_WHEN_SELECT_VEHICLE.SPECIFY_VEHICLE_EACH_TIME
        ) {
            if (vehicle?.selectedVehicle) {
                setSelectedVehicle(vehicle.selectedVehicle);
            }
        }

        resetWorkingDate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetWorkingDate = () => {
        const d = new Date();
        dispatch(saveWorkingDate(dayjs(d).format('YYYY-MM-DD')));
    };

    const handleSelectDate = (date) => {
        setSelectedDate(date);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSelectVehicle = (v: IVehicle) => {
        setSelectedVehicle(v);
        document.getElementById('vehicle')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (activeKey === null) {
            toggleCollapse();
        }
    };

    const handleUnSelectVehicle = () => {
        setSelectedVehicle(null);
    };

    const handleChangeInputSearch = (e) => {
        setKeyword(e.target.value);
    };

    const clearKeyword = () => {
        setKeyword('');
    };

    const renderVehicles = useMemo(
        () =>
            vehicles
                ?.filter(
                    (v) =>
                        compareString(v.companyCd, keyword) ||
                        compareString(v.companyShortName, keyword) ||
                        compareString(v.vehicleCd, keyword) ||
                        compareString(v.vehicleName, keyword) ||
                        compareString(v.vehicleTypeShortName, keyword) ||
                        compareString(v.vehicleTypeCd, keyword),
                )
                ?.map((v, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                        <div
                            className='pb-3 px-3'
                            role='button'
                            onClick={() => handleSelectVehicle(v)}
                            onKeyDown={() => handleSelectVehicle(v)}
                        >
                            <div
                                className={`shadow-md rounded-lg bg-white p-3 pt-2 pb-3 relative border overflow-hidden ${
                                    JSON.stringify(selectedVehicle) === JSON.stringify(v)
                                        ? 'border-green1A'
                                        : ''
                                }`}
                            >
                                {JSON.stringify(selectedVehicle) === JSON.stringify(v) && (
                                    <>
                                        <div className='absolute top-0 right-0'>
                                            <SelectedVehicleSvg />
                                        </div>
                                        <div className='absolute top-[10px] right-[10px]'>
                                            <img src={iconCheck} alt='icon check' />
                                        </div>
                                    </>
                                )}

                                <span className='block text-green1A text-md mb-1'>
                                    {v.vehicleTypeShortName}
                                </span>
                                <div className='flex items-start relative'>
                                    <div className='absolute left-0 bg-yellow59 w-[6px] bottom-0 top-0 rounded-e-xl' />
                                    <div className='pl-4'>
                                        <span className='block text-sm'>{v.vehicleName}</span>
                                        <div className='flex items-start mt-1'>
                                            <svg
                                                width='26'
                                                height='24'
                                                viewBox='0 0 26 24'
                                                fill='none'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path
                                                    d='M1.625 22.5H24.375M3.375 1.5V22.5M15.625 1.5V22.5M22.625 6.75V22.5M6.875 5.875H7.75M6.875 9.375H7.75M6.875 12.875H7.75M11.25 5.875H12.125M11.25 9.375H12.125M11.25 12.875H12.125M6.875 22.5V18.5625C6.875 17.838 7.463 17.25 8.1875 17.25H10.8125C11.537 17.25 12.125 17.838 12.125 18.5625V22.5M2.5 1.5H16.5M15.625 6.75H23.5M19.125 11.125H19.1343V11.1343H19.125V11.125ZM19.125 14.625H19.1343V14.6343H19.125V14.625ZM19.125 18.125H19.1343V18.1343H19.125V18.125Z'
                                                    stroke='#1589A3'
                                                    strokeWidth='1.5'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                />
                                            </svg>
                                            <span className='text-gray93 pl-3 w-fit text-sm'>
                                                {v.companyShortName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )),
        [vehicles, keyword, selectedVehicle, handleSelectVehicle],
    );

    const handleOpenModalSearchVehicleTypes = () => {
        setOpen(true);
    };

    const handleSelectVehicleType = (vehicleType: IVehicleType) => {
        setKeyword(vehicleType.name);
        setOpen(false);
    };

    const handleSubmit = (e) => {
        if (e.target.id === 'clear-vehicle') {
            return;
        }
        if (selectedVehicle) {
            dispatch(saveVehicle(selectedVehicle));
            dispatch(saveWorkingDate(dayjs(selectedDate).format('YYYY-MM-DD')));
            navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
        } else {
            openConfirm({
                content: (
                    <div className='text-center text-ssm font-bold'>
                        <div>車輛が選択されていません。</div>
                        <div>指定しない場合、利用機能が制限されます。</div>
                        <div>そのまま続行しますか？</div>
                    </div>
                ),
                onOk: () => {
                    dispatch(clearVehicle());
                    dispatch(saveWorkingDate(dayjs(selectedDate).format('YYYY-MM-DD')));
                    navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
                },
            });
        }
    };
    const renderCalendar = useMemo(
        () => <Calendar selectedDate={selectedDate} handleSelectDate={handleSelectDate} />,
        [selectedDate],
    );

    const toggleCollapse = () => {
        if (activeKey === KEY_COLLAPSE) {
            setActiveKey(null);
        } else {
            setActiveKey(KEY_COLLAPSE);
            window.scrollTo(0, 0);
        }
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
    }, [activeKey]);

    const checkStyleElement = () => {
        const { documentElement } = document;
        if (fixedElementRef.current && collapsedElementRef.current && contentElementRef.current) {
            const collapsed = collapsedElementRef.current as HTMLElement; // Collapse
            const elementFixedOnScroll = fixedElementRef.current as HTMLElement; // Element cần cố định khi scroll
            const content = contentElementRef.current as HTMLElement; // Danh sách || nội dung || dữ liệu trang
            if (collapsed.classList.contains('opening')) {
                // Collapse OPEN
                if (documentElement.scrollTop >= 438) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '112px';
                    elementFixedOnScroll.style.zIndex = '10';
                    elementFixedOnScroll.style.borderTop = '1px solid white';
                    content.style.marginTop = '110px';
                } else {
                    elementFixedOnScroll.style.position = 'unset';
                    elementFixedOnScroll.style.borderTop = 'none';
                    content.style.marginTop = 'unset';
                }
            } else {
                // Collapse CLOSE
                elementFixedOnScroll.style.position = 'fixed';
                elementFixedOnScroll.style.width = '100%';
                elementFixedOnScroll.style.top = '112px';
                elementFixedOnScroll.style.zIndex = '10';
                elementFixedOnScroll.style.borderTop = '1px solid white';
                content.style.marginTop = '226px';
            }
        }
    };

    return (
        <Layout
            title=''
            isLoading={isLoading}
            isShowLogout
            fixedHeader
            isHiddenPageHeader
            isHideFooter
        >
            <Collapse
                activeKey={activeKey}
                expandIconPosition='end'
                ref={collapsedElementRef}
                className={`bg-grayE9  !border-0 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:!py-2
                    [&_.ant-collapse-header]:!pl-0
                    [&_.ant-collapse-header]:top-[66px] 
                    [&_.ant-collapse-header]:bg-green1A 
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
                        [&_.ant-collapse-content]:mt-[112px]
                        `
                             : `[&_.ant-collapse-item]:!h-[0px] !border-b-[0px]`
                     }`}
                expandIcon={({ isActive }) =>
                    isActive ? (
                        <div className='w-5 h-5' role='button' onClick={() => toggleCollapse()}>
                            <img src={iconChevronUp} className='w-full h-full' alt='info' />
                        </div>
                    ) : (
                        <div className='w-5 h-5' role='button' onClick={() => toggleCollapse()}>
                            <img src={iconChevronDown} className='w-full h-full' alt='info' />
                        </div>
                    )
                }
                items={[
                    {
                        key: KEY_COLLAPSE,
                        label: (
                            <div role='button' onClick={() => toggleCollapse()}>
                                <Container>
                                    <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                        車輌選択
                                    </span>
                                </Container>
                            </div>
                        ),
                        className: 'collapse-panel-custom',
                        children: activeKey === KEY_COLLAPSE && (
                            <>
                                {renderCalendar}
                                <div className='p-3'>
                                    <span className='font-semibold text-md block'>車輌選択</span>
                                </div>
                                {selectedVehicle && (
                                    <div className='px-3 pb-3' id='vehicle'>
                                        <div
                                            className='shadow-md rounded-lg bg-white px-3 py-6 relative'
                                            role='button'
                                            onClick={($event) => handleSubmit($event)}
                                        >
                                            <div className='flex items-start'>
                                                <TruckSvg />
                                                <div className='pl-3 w-full'>
                                                    <span className='block text-green1A text-xl font-zenMaru font-medium pr-[35px]'>
                                                        {selectedVehicle.vehicleName}
                                                    </span>
                                                    <div className='flex items-start'>
                                                        <span className='text-gray93 text-md whitespace-nowrap'>
                                                            車種名:
                                                        </span>
                                                        <span className='text-md pl-2'>
                                                            {selectedVehicle.vehicleTypeShortName}
                                                        </span>
                                                    </div>
                                                    <div className='flex items-start'>
                                                        <span className='text-gray93 text-md whitespace-nowrap'>
                                                            業者名:
                                                        </span>
                                                        <span className='text-md pl-2'>
                                                            {selectedVehicle.companyShortName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className='absolute top-3 right-3'
                                                type='button'
                                                id='clear-vehicle'
                                                onKeyDown={() => handleUnSelectVehicle()}
                                                onClick={() => handleUnSelectVehicle()}
                                            >
                                                <svg
                                                    className='pointer-events-none'
                                                    width='30'
                                                    height='30'
                                                    viewBox='0 0 30 30'
                                                    fill='none'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <path
                                                        d='M19 11L11 19M11 11L19 19M28.3334 15C28.3334 22.3638 22.3638 28.3334 15 28.3334C7.63622 28.3334 1.66669 22.3638 1.66669 15C1.66669 7.63622 7.63622 1.66669 15 1.66669C22.3638 1.66669 28.3334 7.63622 28.3334 15Z'
                                                        stroke='#BD472A'
                                                        strokeWidth='2'
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!selectedVehicle && (
                                    <div className='px-3 pb-3'>
                                        <div
                                            className='shadow-md rounded-lg bg-white px-3 py-6'
                                            role='button'
                                            onClick={($event) => handleSubmit($event)}
                                        >
                                            <div className='flex items-start'>
                                                <TruckSvg />
                                                <div className='px-3 w-full'>
                                                    <span className='block text-[#EDB401] text-sm font-zenMaru font-medium'>
                                                        作業を続ける車両を選択してください
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    htmlType='button'
                                    className='rounded-lg bg-green1A text-[18px]  h-full m-auto w-[144px] py-[12px] font-sm text-[white] font-medium flex items-center justify-center mb-4'
                                    loading={false}
                                    onClick={($event) => handleSubmit($event)}
                                >
                                    次へ
                                </Button>
                            </>
                        ),
                    },
                ]}
            />

            <div className='bg-grayE9' ref={fixedElementRef}>
                <div className='bg-green15 py-2'>
                    <Container classnames='flex justify-between items-center'>
                        <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                            車輌リスト
                        </span>
                    </Container>
                </div>

                <div className='py-3  px-3'>
                    <div className='flex items-center'>
                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-2'>
                            車種
                        </span>
                        <Input
                            className='h-[44px]'
                            placeholder='検索する'
                            value={keyword}
                            onChange={($event) => handleChangeInputSearch($event)}
                            prefix={<img src={iconInputSearch} alt='icon input search' />}
                            suffix={
                                keyword && (
                                    <button type='button' onClick={() => clearKeyword()}>
                                        {' '}
                                        <img src={iconInputClear} alt='icon input clear' />
                                    </button>
                                )
                            }
                        />

                        <button
                            type='button'
                            className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                            onClick={() => handleOpenModalSearchVehicleTypes()}
                        >
                            <FilterSvg className='m-auto' />
                        </button>
                    </div>
                </div>
            </div>
            <div ref={contentElementRef}>{renderVehicles}</div>
            {/* Modal  */}
            <ModalSelectVehicleType
                open={open}
                setOpen={setOpen}
                handleSelectItem={handleSelectVehicleType}
            />
        </Layout>
    );
};

export default SelectVehicle;
