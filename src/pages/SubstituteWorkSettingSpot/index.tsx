/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from 'components/templates/Layout';
import Container from 'components/organisms/container';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';
import { Button, Checkbox, Collapse, Input, Radio, Switch } from 'antd';
import { CONSTANT_ROUTE, DROPDOWN_ORDER_BY, PAGE_SIZE, SORT_TYPE } from 'utils/constants';
import dayjs from 'dayjs';
import { useAppSelector } from 'store/hooks';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import { Controller, useForm, useWatch } from 'react-hook-form';
import iconInputSearch from 'assets/icons/ic_search.svg';
import iconInputClear from 'assets/icons/icon-input-clear.svg';
import { ModalSelectOption } from 'components/common/Modal';
import ModalSelectDriverToReplacement from 'components/common/Modal/ModalSelectDriverToReplacement';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { openConfirm, openInformation } from 'utils/functions';
import {
    useLazyGetDriverReplacementsSpotsByDriverCdQuery,
    usePostDriverReplacementsSpotsRegisterMutation,
} from 'services/driverReplacements';
import {
    IDriverReplacementSSpot,
    IDriverReplacementsSpotsRegister,
    IParamsGetDriverReplacementsSpotsByDriverCd,
} from 'models/driverReplacements';
import { FilterSvg } from 'components/icons/FilterSvg';
import { BuildingOfficeIcon } from 'components/icons/BuildingOfficeIcon';
import { RefreshBorderIcon } from 'components/icons/RefreshBorderIcon';
import { WebsiteIcon } from 'components/icons/WebsiteIcon';
import { CalendarGreenIcon } from 'components/icons/CalendarGreenIcon';
import { TagIcon2 } from 'components/icons/TagIcon2';

enum ModalName {
    DRIVER = 'DRIVER',
    ORDER_BY = 'ORDER_BY',
}
const SubtituteWorkSettingSpot = () => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(null);
    const form = useForm({
        mode: 'all',
        defaultValues: {
            searchCondition: {
                driverCd: null,
                driverName: null,
                receptionType: 0,
                siteSearchType: 0,
                siteSearchText: '',
                orderBy: 0,
                orderType: 0,
                page: 1,
                size: PAGE_SIZE,
            },
            sites: [],
        },

        resolver: yupResolver(
            yup.object().shape({
                sites: yup
                    .array()
                    .compact((e) => !e.siteCheck)
                    .min(1, '代行対象を選択してください。'),
            }),
        ),
    });

    const handleOpenModal = (modalName) => {
        setOpenModal(modalName);
    };

    const handleSelectDriver = (d) => {
        form.setValue('searchCondition.driverName', d.name);
        form.setValue('searchCondition.driverCd', d.cd);
        setOpenModal(null);
    };

    const handleSelectOrderBy = (value) => {
        form.setValue('searchCondition.orderBy', value);
        handleGetSpots();
    };

    const workingDate = useAppSelector((state) => state.reducer.workingDate.workingDate);
    const vehicle = useAppSelector((state) => state.reducer.vehicle);
    const user = useAppSelector((state) => state.reducer.user.user);
    const [getSpotsByDriverCd, responseGetSpotsByDriverCd] =
        useLazyGetDriverReplacementsSpotsByDriverCdQuery();
    const [postDriverReplacementsSpotsRegister, responsePostDriverReplacementsSpotsRegister] =
        usePostDriverReplacementsSpotsRegisterMutation();

    const handleClickRollBack = () => {
        navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    const orderType = useWatch({ control: form.control, name: 'searchCondition.orderType' });
    const orderBy = useWatch({ control: form.control, name: 'searchCondition.orderBy' });
    const renderOrderBy = useMemo(() => DROPDOWN_ORDER_BY[orderBy].label, [orderBy]);

    const sites: IDriverReplacementSSpot[] = form.watch('sites') || [];
    const handleCheckSite = (item: IDriverReplacementSSpot) => {
        const newSites = [...sites];
        const ind = newSites.findIndex((e) => e.siteCd === item.siteCd && e.seqNo === item.seqNo);
        if (ind !== -1) {
            newSites[ind] = {
                ...newSites[ind],
                siteCheck: !newSites[ind].siteCheck,
            };
        }
        form.setValue('sites', newSites);
    };

    const isSelectedAllSites = useMemo(
        () => sites.length > 0 && sites.length === sites.filter((e) => e.siteCheck).length,
        [sites],
    );

    const totalSitesSelected = useMemo(() => sites.filter((e) => e.siteCheck).length, [sites]);

    const toggleSelectAllSites = () => {
        if (isSelectedAllSites) {
            unSelectAllSites();
        } else {
            selectAllSites();
        }
    };

    const unSelectAllSites = () => {
        const newSites = JSON.parse(JSON.stringify(sites));
        newSites.forEach((e) => {
            e.siteCheck = false;
        });

        form.setValue('sites', newSites);
    };

    const selectAllSites = () => {
        const newSites = [...sites];
        newSites.forEach((e) => {
            e.siteCheck = true;
        });
        form.setValue('sites', newSites);
    };

    const handleGetSpots = async () => {
        const driverCd = form.watch('searchCondition.driverCd');
        if (!driverCd) {
            openInformation({
                content: (
                    <div className='text-center text-ssm font-bold'>運転者を指定してください。</div>
                ),
            });
            return;
        }

        const params: IParamsGetDriverReplacementsSpotsByDriverCd = {
            driverCd,
            siteSearchText: form.watch('searchCondition.siteSearchText'),
            siteSearchType: form.watch('searchCondition.siteSearchType'),
            orderBy: form.watch('searchCondition.orderBy'),
            orderType: form.watch('searchCondition.orderType'),
        };
        try {
            const response = await getSpotsByDriverCd(params).unwrap();
            const newList = response.map((e) => {
                const newItem = { ...e };
                newItem.siteCheck = false;
                return newItem;
            });

            form.setValue('sites', newList);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        if (Object.keys(form.formState?.errors)?.length > 0) {
            let messageErr = '';
            const { errors } = form.formState;
            if (errors.sites) {
                messageErr = errors.sites.message;
            }

            openInformation({
                content: <div className='text-center text-ssm font-bold'>{messageErr}</div>,
            });
        }
    }, [form.formState.errors]);

    const onSubmit = async () => {
        openConfirm({
            content: (
                <div className='flex justify-center items-center text-md font-bold w-full text-center'>
                    <div>
                        他運転者の回収分を代行します。
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),

            onOk: async () => {
                const collectionDatas = sites
                    .filter((e) => e.siteCheck)
                    .map((e) => ({
                        id: e.seqNo,
                        timeStamp: e.timeStamp,
                    }));
                const bodyRequest: IDriverReplacementsSpotsRegister = {
                    driverCd: user.employeeCd,
                    vehicleCd: vehicle?.selectedVehicle?.vehicleCd,
                    vehicleTypeCd: vehicle?.selectedVehicle?.vehicleTypeCd,
                    carrierCd: vehicle?.selectedVehicle?.companyCd,
                    collectionDatas,
                };

                try {
                    const response = await postDriverReplacementsSpotsRegister(bodyRequest);
                    navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
                } catch (error) {
                    //
                }
            },
        });
    };

    const renderSites = useMemo(() => {
        if (sites.length > 0) {
            return (
                <div className='py-4'>
                    <Container>
                        {sites.map((e, index) => (
                            <div
                                key={index}
                                role='button'
                                onClick={() => handleCheckSite(e)}
                                className={`shadow-md rounded-lg bg-white px-3 py-2 relative ${
                                    index + 1 !== sites.length ? 'mb-3' : ''
                                }`}
                            >
                                <div className='flex items-start  mb-3'>
                                    <Checkbox checked={e.siteCheck} className='pt-1' />

                                    <div className='text-md border-b border-b-grayE9 w-full ml-3 pb-2'>
                                        <span className='text-green1A'>
                                            {e.receptionType === 1 && 'スポット（収集）'}
                                            {e.receptionType === 2 && 'スポット（出荷）'}
                                        </span>
                                    </div>
                                </div>
                                <div className='ml-7'>
                                    <div className='text-sm flex items-start mb-1'>
                                        <div className='w-[22px] mr-3'>
                                            <CalendarGreenIcon className='m-auto h-[27px]' />
                                        </div>
                                        <span className=' text-black27'>
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
                                        </span>
                                    </div>
                                    <div className='text-sm flex items-start mb-1'>
                                        <div className='w-[22px] mr-3'>
                                            <BuildingOfficeIcon className='m-auto' />
                                        </div>
                                        <span className=' text-black27'>{e.companyName}</span>
                                    </div>
                                    <div className='text-sm flex items-start mb-1'>
                                        <div className='w-[22px] mr-3'>
                                            <WebsiteIcon className='m-auto' />
                                        </div>
                                        <span className=' text-black27'>{e.siteName}</span>
                                    </div>
                                    <div className='text-sm flex items-start mb-1'>
                                        <div className='w-[22px] mr-3'>
                                            <TagIcon2 className='m-auto' />
                                        </div>
                                        <span className=' text-black27'>
                                            {e.collectionDetails
                                                ?.map((p) => p.productName)
                                                .join(' ,')}{' '}
                                            {e.collectionDetails.length > 1 && '他'}
                                        </span>
                                    </div>
                                    {/* <div className='text-sm flex items-start'>
                                    <div className='w-[22px] mr-3'>
                                        <img src={icNote} alt='icon tag' className='m-auto' />
                                    </div>
                                    <span className=' text-black27'>{e.note}</span>
                                </div> */}
                                </div>
                            </div>
                        ))}
                    </Container>
                </div>
            );
        }
        return (
            <div className='py-4'>
                <Container>
                    <span className='text-yellow01 text-sm'>現場情報はありません</span>
                </Container>
            </div>
        );
    }, [sites]);

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
                if (boundingClientRect.top <= 167 && documentElement.scrollTop >= 221) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '167px';
                    elementFixedOnScroll.style.zIndex = '10';
                    elementFixedOnScroll.style.borderTop = '1px solid white';
                    content.style.marginTop = '100px';
                } else {
                    elementFixedOnScroll.style.position = 'unset';
                    elementFixedOnScroll.style.borderTop = 'none';
                    content.style.marginTop = 'unset';
                }
            } else {
                // Collapse CLOSE
                elementFixedOnScroll.style.position = 'fixed';
                elementFixedOnScroll.style.width = '100%';
                elementFixedOnScroll.style.top = '167px';
                elementFixedOnScroll.style.zIndex = '10';
                elementFixedOnScroll.style.borderTop = '1px solid white';
                content.style.marginTop = '267px';
            }
        }
    };

    return (
        <Layout
            title='作業代行登録（スポット）'
            isLoading={
                responseGetSpotsByDriverCd.isFetching ||
                responseGetSpotsByDriverCd.isLoading ||
                responsePostDriverReplacementsSpotsRegister.isLoading
            }
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
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
                            <div className='flex justify-between items-center'>
                                <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                    検索条件
                                </span>
                                <div className={`flex items-center `}>
                                    <p className='w-fit text-[#D4D4D4] mb-0 text-[18px] font-medium font-zenMaru'>
                                        {dayjs(new Date(workingDate)).format('YYYY/MM/DD')}
                                    </p>
                                    <div className='w-[24px] h-[24px] ml-3'>
                                        <img
                                            src={iconCalendar}
                                            className='w-full h-full object-cover'
                                            alt='calendar-date'
                                        />
                                    </div>
                                </div>
                            </div>
                        ),
                        className: 'collapse-panel-custom',
                        children: isOpenSearchConditions && (
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className='py-3 bg-white'>
                                    <Container classnames='flex items-center'>
                                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[80px]'>
                                            運転者
                                        </span>
                                        <Controller
                                            control={form.control}
                                            name='searchCondition.driverName'
                                            render={({ field }) => (
                                                <Input
                                                    className='h-[44px] disabled-bg-white'
                                                    {...field}
                                                    disabled
                                                    prefix={
                                                        <img
                                                            src={iconInputSearch}
                                                            alt='icon input search'
                                                        />
                                                    }
                                                    suffix={
                                                        field.value && (
                                                            <button
                                                                type='button'
                                                                onClick={() => {
                                                                    form.setValue(
                                                                        'searchCondition.driverName',
                                                                        null,
                                                                    );
                                                                    form.setValue(
                                                                        'searchCondition.driverCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={iconInputClear}
                                                                    alt='icon input clear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                        <button
                                            type='button'
                                            onClick={() => handleOpenModal(ModalName.DRIVER)}
                                            className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                                        >
                                            <FilterSvg className='m-auto' />
                                        </button>
                                    </Container>
                                </div>
                                <div className=' bg-white'>
                                    <Container classnames='flex items-start gap-y-2 !pr-0'>
                                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[80px]'>
                                            場 所
                                        </span>
                                        <Controller
                                            control={form.control}
                                            name='searchCondition.siteSearchType'
                                            render={({ field }) => (
                                                <Radio.Group
                                                    {...field}
                                                    className='[&_span]:text-ssm pl-0 flex flex-wrap gap-y-2'
                                                >
                                                    <Radio value={0} className='w-[92px]'>
                                                        業者名
                                                    </Radio>
                                                    <Radio value={1} className='w-[92px]'>
                                                        現場名
                                                    </Radio>
                                                    <Radio value={2}>住所</Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                    </Container>
                                </div>
                                <div className='py-3 bg-white'>
                                    <Container classnames='flex items-center'>
                                        <Controller
                                            control={form.control}
                                            name='searchCondition.siteSearchText'
                                            render={({ field }) => (
                                                <Input
                                                    className='h-[44px] disabled-bg-white'
                                                    {...field}
                                                    placeholder='回収の場所の絞り込み条件を入力'
                                                    prefix={
                                                        <img
                                                            src={iconInputSearch}
                                                            alt='icon input search'
                                                        />
                                                    }
                                                    suffix={
                                                        field.value && (
                                                            <button
                                                                type='button'
                                                                onClick={() =>
                                                                    form.setValue(
                                                                        'searchCondition.siteSearchText',
                                                                        '',
                                                                    )
                                                                }
                                                            >
                                                                <img
                                                                    src={iconInputClear}
                                                                    alt='icon input clear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </Container>
                                </div>
                                <div className='pb-3 bg-white'>
                                    <Container classnames='flex items-center'>
                                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[80px]'>
                                            並び順
                                        </span>
                                        <Input
                                            className='h-[44px] disabled-bg-white mr-2'
                                            disabled
                                            value={renderOrderBy}
                                        />
                                        <button
                                            type='button'
                                            className='rounded border border-green15 h-[44px] min-w-[44px] mr-2 text-center bg-green1A'
                                            onClick={() => handleOpenModal(ModalName.ORDER_BY)}
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
                                            onClick={() => {
                                                form.setValue(
                                                    'searchCondition.orderType',
                                                    SORT_TYPE.ASCENDING,
                                                );
                                                handleGetSpots();
                                            }}
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
                                            onClick={() => {
                                                form.setValue(
                                                    'searchCondition.orderType',
                                                    SORT_TYPE.DESCENDING,
                                                );
                                                handleGetSpots();
                                            }}
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
                                    </Container>
                                </div>
                            </form>
                        ),
                    },
                ]}
            />
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div ref={fixedElementRef}>
                    <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <div className='flex'>
                                <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                    現場一覧
                                </span>

                                <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                    （ 選択済
                                    <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold inline-block mx-3'>
                                        {totalSitesSelected}
                                    </span>
                                    ）
                                </span>
                            </div>
                            <button type='button' onClick={handleGetSpots}>
                                <RefreshBorderIcon />
                            </button>
                        </Container>
                    </div>
                    <div className='bg-white py-3'>
                        <Container>
                            <div className='flex items-center'>
                                <Switch
                                    checked={sites.length > 0 ? isSelectedAllSites : undefined}
                                    onClick={() => toggleSelectAllSites()}
                                />
                                <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] ml-3 mr-4'>
                                    一括選択
                                </span>
                            </div>
                        </Container>
                    </div>
                </div>
                <div ref={contentElementRef}>{renderSites}</div>
                <div className='pb-7 pt-3'>
                    <Container>
                        <Button
                            className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center'
                            htmlType='submit'
                        >
                            登録
                            <svg
                                width='22'
                                height='23'
                                viewBox='0 0 22 23'
                                className='ml-2'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M21 1.5L10 12.5M21 1.5L14 21.5L10 12.5M21 1.5L1 8.5L10 12.5'
                                    stroke='white'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </Button>
                    </Container>
                </div>
            </form>

            <ModalSelectDriverToReplacement
                open={openModal === ModalName.DRIVER}
                setOpen={setOpenModal}
                handleSelectItem={handleSelectDriver}
            />

            <ModalSelectOption
                open={openModal === ModalName.ORDER_BY}
                setOpen={setOpenModal}
                dropdown={DROPDOWN_ORDER_BY}
                handleSelect={handleSelectOrderBy}
                title='並べ替え'
                defaultValue={orderBy}
            />
        </Layout>
    );
};
export default SubtituteWorkSettingSpot;
