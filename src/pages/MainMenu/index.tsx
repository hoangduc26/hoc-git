// eslint-disable-line @typescript-eslint/no-explicit-any
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import iconInfo from 'assets/icons/ic_info.svg';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import Layout from 'components/templates/Layout';
import { ParamsCollectSummary } from 'models';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useLazyGetCollectionSummaryQuery } from 'services/collection';
import './index.scss';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE, ROLES } from 'utils/constants';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { openInformation, shadeColor } from 'utils/functions';
import dayjs from 'dayjs';
import { cleanSiteNotes } from 'services/siteNotes';
import { useLazyGetStatusAuthQuery } from 'services/auth';
import { setPreviousPage } from 'services/page';
import TruckNoBorderSvg from 'components/icons/TruckNoBorderSvg';
import { GarbageBagSvg } from 'components/icons/GarbageBagSvg';
import { TrashbinSvg } from 'components/icons/TrashbinSvg';
import { PrinterSvg } from 'components/icons/PrinterSvg';
import { TagSvg } from 'components/icons/TagSvg';
import { CoinsSvg } from 'components/icons/CoinsSvg';
import { NotesSvg } from 'components/icons/NotesSvg';
import { FolderSvg } from 'components/icons/FolderSvg';
import { ScheduleIcon } from 'components/icons/ScheduleIcon';
import { ChatIcon } from 'components/icons/ChatIcon';

interface IMenuItem {
    id: string;
    svg: any;
    label: string;
    desc: string;
    href?: string;
    isRequiredVehicle?: boolean;
    isSubtituteWorkSetting?: boolean;
    function?: any;
    isLimited?: boolean;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const Home: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [isRenderChart, setIsRenderChart] = useState(true);
    const user = useAppSelector((state) => state.reducer.user);
    const vehicle = useAppSelector((state) => state.reducer.vehicle);
    const workingDate = useAppSelector((state) => state.reducer.workingDate.workingDate);
    const userData = useAppSelector((state) => state.reducer?.user.user);
    const AuthMenu = userData.authorizedMenu;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);
    const intervalId = useRef<NodeJS.Timeout | null>();
    const [getAuthenStatus] = useLazyGetStatusAuthQuery();
    const location = useLocation();

    const menuItemsDefault: IMenuItem[] = [
        // {
        //     id: ROLES.MOBILE001,
        //     svg: <GarbageBagSvg className='w-full h-full object-cover' />,
        //     isLimited: false,
        //     label: '回収実績登録',
        //     desc: '廃棄物の回収実績を入力します',
        //     href: `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`,
        //     isRequiredVehicle: true,
        //     function: () => {
        //         if (vehicle.selectedVehicle) {
        //             dispatch(
        //                 setPreviousPage({
        //                     previousUrl: location.pathname + location.search,
        //                     previousUrlOfPage: CONSTANT_ROUTE.COLLECTION_RECORD_INPUT,
        //                 }),
        //             );
        //             navigate(`/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`);
        //         } else {
        //             openPopupRequiredVehicle();
        //         }
        //     },
        // },
        // {
        //     id: ROLES.MOBILE002,
        //     svg: <TrashbinSvg className='w-full h-full object-cover' />,
        //     isLimited: false,
        //     label: '搬入実績登録',
        //     desc: '廃棄物の搬入実績を登録します',
        //     href: `/${CONSTANT_ROUTE.CARRY_IN_LIST}`,
        //     isRequiredVehicle: true,
        //     function: () => {
        //         if (vehicle.selectedVehicle) {
        //             navigate(`/${CONSTANT_ROUTE.CARRY_IN_LIST}`);
        //         } else {
        //             openPopupRequiredVehicle();
        //         }
        //     },
        // },
        // {
        //     id: ROLES.MOBILE003,
        //     svg: <PrinterSvg className='w-full h-full object-cover' />,
        //     isLimited: true,
        //     label: '現場メモ',
        //     desc: '現場の共有事項を登録します',
        //     href: `/${CONSTANT_ROUTE.SITE_NOTES}`,
        //     function: () => {
        //         if (vehicle.selectedVehicle) {
        //             dispatch(cleanSiteNotes());
        //             navigate(`/${CONSTANT_ROUTE.SITE_NOTES}`);
        //         } else {
        //             openPopupRequiredVehicle();
        //         }
        //     },
        // },
        // {
        //     id: ROLES.MOBILE004,
        //     svg: <TagSvg className='w-full h-full object-cover' />,
        //     isLimited: true,
        //     label: '作業代行登録',
        //     desc: '回収の作業を代行します',
        //     href: `/${CONSTANT_ROUTE.SUBTITUTE_WORK_SETTING_SPOT}`,
        //     isRequiredVehicle: true,
        //     isSubtituteWorkSetting: true,
        //     function: () => {
        //         checkIsAllowSubtituteWork();
        //     },
        // },
        // {
        //     id: ROLES.MOBILE005,
        //     svg: <CoinsSvg className='w-full h-full object-cover' />,
        //     isLimited: true,
        //     label: '受入実績登録',
        //     desc: '新規受入作業の実績を登録します',
        //     href: `/${CONSTANT_ROUTE.WEIGHING_INFORMATION_SELECTION}`,
        //     function: () => {
        //         navigate(`/${CONSTANT_ROUTE.WEIGHING_INFORMATION_SELECTION}`);
        //     },
        // },
        // {
        //     id: ROLES.MOBILE007,
        //     svg: <NotesSvg className='w-full h-full object-cover' />,
        //     isLimited: true,
        //     label: '配車状況一覧',
        //     desc: '配車の予定を確認します',
        //     href: `/${CONSTANT_ROUTE.DISPATCH_STATUS}`,
        //     function: () => {
        //         navigate(`/${CONSTANT_ROUTE.DISPATCH_STATUS}`);
        //     },
        // },
        // {
        //     id: ROLES.MOBILE009,
        //     svg: <FolderSvg className='w-full h-full object-cover' />,
        //     isLimited: true,
        //     label: '委託契約一覧',
        //     desc: '委託契約情報を確認します',
        //     href: `/${CONSTANT_ROUTE.CONTRACTS}`,
        //     function: () => {
        //         dispatch(
        //             setPreviousPage({
        //                 previousUrl: location.pathname + location.search,
        //                 previousUrlOfPage: CONSTANT_ROUTE.CONTRACTS,
        //             }),
        //         );
        //         navigate(`/${CONSTANT_ROUTE.CONTRACTS}`);
        //     },
        // },
        // {
        //     id: 'MOBILE003',
        //     svg: <ChatIcon />,
        //     isLimited: false,
        //     label: '現場チャット',
        //     desc: '共有情報をメッセージ登録します',
        //     href: `/${CONSTANT_ROUTE.GROUP_CHAT_LIST}`,
        //     function: () => {
        //         navigate(`/${CONSTANT_ROUTE.GROUP_CHAT_LIST}`);
        //     },
        // },
        {
            id: ROLES.MOBILE006,
            svg: null,
            isLimited: false,
            label: `手分解前→中間処理前\nカゴ連携`,
            desc: '',
            href: `/${CONSTANT_ROUTE.BUNKAI_TO_CHUUKAN}`,
            function: () => {
                navigate(`/${CONSTANT_ROUTE.BUNKAI_TO_CHUUKAN}`);
            },
        },
    ];

    const showModal = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (AuthMenu.includes(ROLES.MOBILE001)) {
            setIsRenderChart(true);
        } else {
            setIsRenderChart(false);
        }
    }, [AuthMenu]);
    useEffect(() => {
        if (user) {
            handleGetCollectionSummary();
        }
    }, [user, vehicle]);

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
                    handleReloadPageData();
                }
            }, time);
        }

        return (): void => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [systemSetting]);

    const handleReloadPageData = () => {
        handleGetCollectionSummary();
    };

    const handleGetCollectionSummary = () => {
        getCollectionSummary({
            driverCd: user.user.employeeCd,
            vehicleCd: vehicle.selectedVehicle?.vehicleCd || null,
            carrierCd: vehicle.selectedVehicle?.companyCd || null,
            workingDate: workingDate && dayjs(workingDate).format('YYYY-MM-DD'),
        });
    };

    const mainColor = getComputedStyle(document.documentElement)?.getPropertyValue('--main-color');
    const subColor = getComputedStyle(document.documentElement)?.getPropertyValue('--sub-color');

    const customDatalabels = {
        id: 'customDatalabels',
        afterDatasetsDraw(chart: any) {
            const {
                ctx,
                data,
                chartArea: { top, left, width, height },
            } = chart;
            ctx.save();
            const halfWidth = width / 2 + left;
            const halfHeight = height / 2 + top;

            data.datasets[0].data?.map((datapoint: any, index: number) => {
                const { x, y } = chart.getDatasetMeta(0).data[index].tooltipPosition();
                const fillColor = subColor;
                const black = 'black';
                const isBlackLine = index === 0;
                if (index < 2 && datapoint > 0) {
                    ctx.font = '1rem Zen Maru Gothic';
                    ctx.fillStyle = index === 1 ? fillColor : black;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    if (isBlackLine) {
                        const xLine = x <= halfWidth ? x + 5 : x - 5;
                        const yLine = y >= halfHeight ? y + 15 : y - 15;
                        const extraLine = x >= halfWidth ? 30 : -30;
                        const textWidth =
                            ctx.measureText(datapoint).width + (isBlackLine ? 25 : 35) + 5;
                        const textWidthPosition = x >= halfWidth ? textWidth : -textWidth;
                        // draw line
                        ctx.strokeStyle = black;
                        ctx.beginPath();
                        ctx.moveTo(x, y - 10);
                        ctx.lineTo(xLine, yLine);
                        ctx.lineTo(xLine + extraLine, yLine);
                        ctx.stroke();
                        ctx.fillText(
                            `作業なし ${datapoint}`,
                            xLine + extraLine + textWidthPosition,
                            yLine,
                        );
                    } else {
                        const xLine = x <= halfWidth ? x + 5 : x - 5;
                        const yLine = y <= halfHeight ? y + 15 : y - 15;
                        const extraLine = x >= halfWidth ? 30 : -40;
                        const textWidth =
                            ctx.measureText(datapoint).width + (isBlackLine ? 25 : 35);
                        const textWidthPosition = x >= halfWidth ? textWidth : -textWidth;
                        // draw line
                        ctx.strokeStyle = index === 1 ? fillColor : black;
                        ctx.beginPath();
                        ctx.moveTo(x, y + 10);
                        ctx.lineTo(xLine, yLine);
                        ctx.lineTo(xLine + extraLine, yLine);
                        ctx.stroke();
                        ctx.fillText(
                            `回収済 ${datapoint}`,
                            xLine + extraLine + textWidthPosition,
                            yLine,
                        );
                    }
                }
                return null;
            });
        },
    };

    const [getCollectionSummary, { data: collectionData, isLoading }] =
        useLazyGetCollectionSummaryQuery();

    const isEmptyChart =
        collectionData?.exclusion === 0 &&
        collectionData?.collected === 0 &&
        collectionData.uncollected === 0;

    const total = collectionData
        ? collectionData.collected + collectionData.exclusion + collectionData.uncollected
        : 0;

    const dataChart = {
        datasets: [
            {
                data: isEmptyChart
                    ? [0, 0, 1]
                    : [
                          collectionData?.exclusion,
                          collectionData?.collected,
                          collectionData?.uncollected,
                      ],
                backgroundColor: (context: any) => {
                    if (isEmptyChart) {
                        return 'rgba(217, 217, 217, 1)';
                    }
                    const { ctx } = context.chart;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, shadeColor(subColor, 90));
                    gradient.addColorStop(1, subColor);
                    if (context.dataIndex === 0) {
                        return 'black';
                    }
                    if (context.dataIndex === 1) {
                        return gradient;
                    }
                    return 'rgba(217, 217, 217, 1)';
                },
                borderColor: 'rgba(202, 202, 202, 1)',
                display: true,
                borderWidth: isEmptyChart ? 1 : 0,
                weight: 0.05,
                circumference: 90 * Math.PI,
                rotation: 69.9 * Math.PI,
            },
        ],
    };

    const openPopupRequiredVehicle = () => {
        openInformation({
            content: (
                <div className='text-center text-ssm font-bold'>
                    車輛が指定されていない為、利用出来ません。
                </div>
            ),
        });
    };

    const navigateToSubtituteWorkSpot = () => {
        navigate(`/${CONSTANT_ROUTE.SUBTITUTE_WORK_SETTING_SPOT}`);
    };

    const navigateToSubtituteWorkCourse = () => {
        navigate(`/${CONSTANT_ROUTE.SUBTITUTE_WORK_SETTING_COURSE}`);
    };

    const checkIsAllowSubtituteWork = () => {
        const currDate = dayjs(new Date()).format('YYYY-MM-DD');
        if (currDate !== workingDate) {
            openPopupNotAllowWorkSubstitution();
        } else {
            openSelectSubtituteWork();
        }
    };

    const openPopupNotAllowWorkSubstitution = () => {
        openInformation({
            content: (
                <div className='text-center text-ssm font-bold'>
                    作業代行は当日のみ可能です。
                    <br /> 作業日を確認してください。
                </div>
            ),
        });
    };

    const openSelectSubtituteWork = () => {
        // eslint-disable-next-line react/react-in-jsx-scope
        const modal = Modal.confirm({
            closable: false,
            maskClosable: false,
        });

        const content = (
            <div className='flex justify-center items-center text-center mt-3 text-ssm font-bold w-full'>
                作業代行を行う種類を選択してください
            </div>
        );

        const footer = (
            <div>
                <div className='flex justify-center items-center mt-8'>
                    <div className='pr-2 w-1/2'>
                        <Button
                            htmlType='button'
                            onClick={() => {
                                modal.destroy();
                                navigateToSubtituteWorkSpot();
                            }}
                            className='h-btn-default text-center rounded text-white border-green1A bg-green1A w-full shadow-sm text-sm'
                        >
                            スポット
                        </Button>
                    </div>
                    <div className='pl-2 w-1/2'>
                        <Button
                            htmlType='button'
                            onClick={() => {
                                modal.destroy();
                                navigateToSubtituteWorkCourse();
                            }}
                            className='h-btn-default text-center rounded text-white border-green1A bg-green1A w-full shadow-sm text-sm'
                        >
                            コース
                        </Button>
                    </div>
                </div>
                <div className='mt-4 w-full'>
                    <Button
                        htmlType='button'
                        onClick={() => {
                            modal.destroy();
                        }}
                        className='h-btn-default text-center rounded  text-black52 border-black52 hover:text-black52 bg-white w-full shadow-sm text-sm'
                    >
                        戻る
                    </Button>
                </div>
            </div>
        );

        modal.update({
            content,
            footer,
        });
    };

    const menuItems = useMemo(
        () =>
            menuItemsDefault.filter((item) => {
                if (user.user?.isSystemLimit) {
                    return item.isLimited === false && AuthMenu.includes(item.id);
                }
                return AuthMenu.includes(item.id);
            }),
        [AuthMenu, user.user],
    );

    return (
        <Layout
            title='メインメニュー'
            isShowDate
            isShowNotification
            isLoading={isLoading}
            isShowLogout
            fixedHeader
        >
            <div className='main-menu bg-grayE9 w-full mt-header'>
                {/* {isRenderChart ? (
                    <>
                        Progress chart
                        <div className='flex w-full justify-center mb-[50px] relative'>
                            <div className='w-full'>
                                <Doughnut
                                    id='home-chart'
                                    data={dataChart}
                                    height={window.innerWidth < 475 ? window.innerWidth - 100 : 280}
                                    width={window.innerWidth}
                                    options={{
                                        layout: {
                                            padding: 60,
                                        },
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                            tooltip: {
                                                enabled: false,
                                            },
                                        },
                                        rotation: -90,
                                        circumference: 180,
                                        cutout: '75%',
                                        maintainAspectRatio: false,
                                        responsive: true,
                                    }}
                                    plugins={isEmptyChart ? [] : [customDatalabels]}
                                />
                            </div>

                            <div
                                style={{
                                    position: 'absolute',
                                    top: '80%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                }}
                            >
                                <div className='inside flex flex-col justify-center items-center'>
                                    <h2 className=' text-black52 text-ssm mb-1 mx-3'>収集する</h2>
                                    <h2 className=' text-black52 text-ssm mb-0 mx-3'>場所の合計</h2>

                                    <h2 className=' text-black text-[48px] font-bold'>{total}</h2>

                                    <div className='flex items-center'>
                                        <h2 className=' text-black52 text-sm font-bold mb-0 mr-1'>
                                            予定
                                        </h2>

                                        <div className='w-5 h-5 '>
                                            <ScheduleIcon className='w-full h-full object-cover' />
                                        </div>
                                    </div>

                                    <div className='flex items-center mt-3 gap-1 '>
                                        <p className=' text-black52 text-md mb-0'>
                                            未回収の現場数{' '}
                                        </p>
                                        <p className=' text-[#BD472A] text-md mb-0 font-black'>
                                            {collectionData?.uncollected}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        Midde title
                        <div className='w-full px-4  py-2 flex items-center bg-white'>
                            <div className='w-8 h-8'>
                                <TruckNoBorderSvg className='w-full h-full object-cover' />
                            </div>
                            <h2 className='font-semibold text-green15 text-md mb-0 mx-3'>
                                コンテナ未登録
                            </h2>
                            <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                                {collectionData?.containerUnregistered || 0}
                            </div>
                        </div>
                    </>
                ) : (
                    ''
                )} */}

                {/* Menu  */}
                <div className='whitespace-break-spaces grid grid-cols-1 gap-5 px-5 py-5'>
                    {menuItems.length > 0 &&
                        menuItems.map((item) => {
                            const { label, svg } = item;
                            return (
                                <div
                                    key={label}
                                    onClick={() => item.function()}
                                    className=' bg-white rounded-lg py-2 flex flex-col items-center justify-center gap-1 shadow-md'
                                >
                                    {/* <div className='w-5 h-5 '>{svg}</div> */}
                                    <p className='font-semibold text-black52 text-md mt-1 text-center'>
                                        {label}
                                    </p>
                                </div>
                            );
                        })}
                </div>

                {/* Explain */}
                <div onClick={showModal} className='flex justify-end px-4 items-center pb-4'>
                    <h2 className='font-semibold text-green1A text-sm mb-0 mr-2'>メニュー説明</h2>
                    <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-white font-bold flex items-center text-sm justify-center'>
                        <div>
                            <img src={iconInfo} className='w-full h-full object-cover' alt='info' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal  */}
            <ModalMenuExplanation open={open} setOpen={setOpen} menuItems={menuItems} />
        </Layout>
    );
};

const ModalMenuExplanation = (props) => {
    const { open, menuItems, setOpen } = props;
    useEffect(() => {
        if (open === false) {
            document.getElementsByClassName('ant-modal-wrap')?.[0]?.scroll(0, 0);
        }
    }, [open]);

    return (
        <Modal className='main-menu__modal' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A h-[80px] fixed top-0 w-full z-10'>
                <h2 className='font-semibold text-white text-xl mb-0 mr-2'>メニュー説明</h2>
                <div onClick={() => setOpen(false)}>
                    <img src={iconClose} className='w-full h-full object-cover' alt='info' />
                </div>
            </div>

            <div className='body flex flex-col mt-[80px]'>
                {menuItems.length > 0 &&
                    menuItems.map((item, index) => {
                        const { label, svg, desc } = item;
                        return (
                            <div
                                key={label}
                                className={`flex flex-col py-2  border-dashed border-b border-[#999999] ${
                                    index === menuItems.length - 1 && 'border-none'
                                }`}
                            >
                                <div className='w-full  py-2 flex items-center pl-6'>
                                    <div className='w-10 h-10 '>{svg}</div>
                                    <p className='font-semibold text-black52 text-md mb-0 ml-4 '>
                                        {label}
                                    </p>
                                </div>

                                <p className='font-semibold text-black52 text-md mb-0 ml-6 '>
                                    {desc}
                                </p>
                            </div>
                        );
                    })}
            </div>
        </Modal>
    );
};

export default Home;
