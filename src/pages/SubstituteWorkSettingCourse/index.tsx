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
import undefined, { CONSTANT_ROUTE, PAGE_SIZE, UNDEFINED } from 'utils/constants';
import dayjs from 'dayjs';
import { useAppSelector } from 'store/hooks';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import { Controller, useForm } from 'react-hook-form';
import iconInputSearch from 'assets/icons/ic_search.svg';
import iconInputClear from 'assets/icons/icon-input-clear.svg';
import ModalSelectDriverToReplacement from 'components/common/Modal/ModalSelectDriverToReplacement';
import { IDriver } from 'models/driver';
import {
    ICourseOfDay,
    IDriverReplacementsCourse,
    IDriverReplacementsCoursesRegister,
    IParamsGetDriverReplacementCoursesByDriverCd,
} from 'models/driverReplacements';
import {
    useLazyGetDriverReplacementsCoursesByDriverCdQuery,
    usePostDriverReplacementsCoursesRegisterMutation,
} from 'services/driverReplacements';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { openConfirm, openInformation } from 'utils/functions';
import { FilterSvg } from 'components/icons/FilterSvg';
import { BuildingOfficeIcon } from 'components/icons/BuildingOfficeIcon';
import { RefreshBorderIcon } from 'components/icons/RefreshBorderIcon';
import { WebsiteIcon } from 'components/icons/WebsiteIcon';
import { NoteIcon } from 'components/icons/NoteIcon';
import { TagIcon2 } from 'components/icons/TagIcon2';
import ModalSelectCourseOfDay from './ModalSelectCourseOfDay';

enum ModalName {
    DRIVER = 'DRIVER',
    COURSE = 'COURSE',
    DESINATION_COURSE = 'DESINATION_COURSE',
}

const SubtituteWorkSettingCourse = () => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(null);
    const form = useForm({
        mode: 'all',
        defaultValues: {
            destination: {
                courseCd: null,
                courseName: '',
                courseDispatchNo: undefined,
            },
            targetSearchCondition: {
                driverCd: null,
                driverName: null,
                courseCd: null,
                courseName: null,
                courseDispatchNo: undefined,
                siteSearchType: 0,
                siteSearchText: '',
                page: 1,
                size: PAGE_SIZE,
            },
            sites: [],
        },

        resolver: yupResolver(
            yup.object().shape({
                destination: yup.object().shape({
                    courseCd: yup
                        .string()
                        .nullable()
                        .required('組込先のコースを指定してください。'),
                }),
                sites: yup
                    .array()
                    .compact((e) => !e.siteCheck)
                    .min(1, '代行対象を選択してください。'),
            }),
        ),
    });

    const workingDate = useAppSelector((state) => state.reducer.workingDate.workingDate);
    const vehicle = useAppSelector((state) => state.reducer.vehicle);
    const user = useAppSelector((state) => state.reducer.user.user);
    const [getCourseByDriverCd, responseGetCourseByDriverCd] =
        useLazyGetDriverReplacementsCoursesByDriverCdQuery();
    const [postDriverReplacementsCoursesRegister, responsePostDriverReplacementsCoursesRegister] =
        usePostDriverReplacementsCoursesRegisterMutation();
    const handleOpenModal = (modalName) => {
        setOpenModal(modalName);
    };

    const handleSelectDriver = (d: IDriver) => {
        form.setValue('targetSearchCondition.driverName', d.name);
        form.setValue('targetSearchCondition.driverCd', d.cd);
        form.setValue('targetSearchCondition.courseName', null);
        form.setValue('targetSearchCondition.courseCd', null);
        form.setValue('targetSearchCondition.courseDispatchNo', undefined);
        setOpenModal(null);
    };

    const handleSelectCourse = (d: ICourseOfDay) => {
        form.setValue('targetSearchCondition.courseName', d.courseName);
        form.setValue('targetSearchCondition.courseCd', d.courseNameCd);
        form.setValue('targetSearchCondition.courseDispatchNo', d.dispatchNo);
        setOpenModal(null);
    };

    const handleSelectDestinationCourse = (d: ICourseOfDay) => {
        form.setValue('destination.courseName', d.courseName);
        form.setValue('destination.courseCd', d.courseNameCd);
        form.setValue('destination.courseDispatchNo', d.dispatchNo);
        setOpenModal(null);
    };

    const handleClickRollBack = () => {
        navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    const sites: IDriverReplacementsCourse[] = form.watch('sites') || [];
    const handleCheckSite = (item: IDriverReplacementsCourse) => {
        const newSites = [...sites];
        const ind = newSites.findIndex(
            (e) => e.courseNameCd === item.courseNameCd && e.seqNo === item.seqNo,
        );
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

    const handleGetCourses = async () => {
        const driverCd = form.watch('targetSearchCondition.driverCd');
        if (!driverCd) {
            openInformation({
                content: (
                    <div className='text-center text-ssm font-bold'>運転者を指定してください。</div>
                ),
            });
            return;
        }

        const params: IParamsGetDriverReplacementCoursesByDriverCd = {
            driverCd,
            dispatchNo: form.watch('targetSearchCondition.courseDispatchNo'),
            siteSearchText: form.watch('targetSearchCondition.siteSearchText'),
            siteSearchType: form.watch('targetSearchCondition.siteSearchType'),
        };
        try {
            const response = await getCourseByDriverCd(params).unwrap();
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
            if (errors.destination?.courseCd) {
                const messageErrCourseCd: any = errors.destination?.courseCd?.message;
                messageErr = messageErrCourseCd;
            } else if (errors.sites) {
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
                const bodyRequest: IDriverReplacementsCoursesRegister = {
                    dispatchNo: form.watch('destination.courseDispatchNo'),
                    driverCd: user.employeeCd,
                    vehicleCd: vehicle?.selectedVehicle?.vehicleCd,
                    vehicleTypeCd: vehicle?.selectedVehicle?.vehicleTypeCd,
                    carrierCd: vehicle?.selectedVehicle?.companyCd,
                    collectionDatas,
                };

                try {
                    const response = await postDriverReplacementsCoursesRegister(bodyRequest);
                    navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
                } catch (error) {
                    //
                }
            },
        });
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
            const boundingClientRect = elementFixedOnScroll.getBoundingClientRect();
            if (collapsed.classList.contains('opening')) {
                // Collapse OPEN
                if (boundingClientRect.top <= 281 && documentElement.scrollTop >= 221) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '281px';
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
                elementFixedOnScroll.style.top = '281px';
                elementFixedOnScroll.style.zIndex = '10';
                elementFixedOnScroll.style.borderTop = '1px solid white';
                content.style.marginTop = '380px';
            }
        }
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
                                        <span className='text-green1A'>{e.courseName}</span>
                                    </div>
                                </div>
                                <div className='ml-7'>
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
                                            {e.collectionDetails?.map((p) => p.productName)[0]}{' '}
                                            {e.collectionDetails.length > 1 && '他'}
                                        </span>
                                    </div>
                                    <div className='text-sm flex items-start'>
                                        <div className='w-[22px] mr-3'>
                                            <NoteIcon className='m-auto' />
                                        </div>
                                        <span className=' text-black27'>{e.note}</span>
                                    </div>
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

    return (
        <Layout
            title='作業代行登録（コース）'
            isLoading={
                responseGetCourseByDriverCd.isFetching ||
                responseGetCourseByDriverCd.isLoading ||
                responsePostDriverReplacementsCoursesRegister.isLoading
            }
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='fixed w-full z-10 top-header'>
                    <div className='bg-green15 py-2 '>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                組込先コース設定
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
                        </Container>
                    </div>
                    <div className='py-3 bg-white'>
                        <Container classnames='flex items-center'>
                            <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[80px]'>
                                コース
                            </span>
                            <Controller
                                control={form.control}
                                name='destination.courseName'
                                render={({ field }) => (
                                    <Input
                                        className='h-[44px] disabled-bg-white'
                                        {...field}
                                        disabled
                                        prefix={
                                            <img src={iconInputSearch} alt='icon input search' />
                                        }
                                        suffix={
                                            field.value && (
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        form.setValue(
                                                            'destination.courseName',
                                                            null,
                                                        );
                                                        form.setValue('destination.courseCd', null);
                                                        form.setValue(
                                                            'destination.courseDispatchNo',
                                                            undefined,
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
                                onClick={() => handleOpenModal(ModalName.DESINATION_COURSE)}
                                className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                            >
                                <FilterSvg className='m-auto' />
                            </button>
                        </Container>
                    </div>
                </div>
                {/* COllapse */}
                <Collapse
                    onChange={($event) => handleChangeCollapse($event)}
                    defaultActiveKey='1'
                    expandIconPosition='end'
                    ref={collapsedElementRef}
                    className={`bg-green15 border !border-green15 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:top-[226px] 
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
                        [&_.ant-collapse-content]:mt-[280px]
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
                                </div>
                            ),
                            className: 'collapse-panel-custom',
                            children: isOpenSearchConditions && (
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className='pt-3 bg-white'>
                                        <Container classnames='flex items-center'>
                                            <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[80px]'>
                                                運転者
                                            </span>
                                            <Controller
                                                control={form.control}
                                                name='targetSearchCondition.driverName'
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
                                                                            'targetSearchCondition.driverCd',
                                                                            null,
                                                                        );
                                                                        form.setValue(
                                                                            'targetSearchCondition.driverName',
                                                                            null,
                                                                        );
                                                                        form.setValue(
                                                                            'targetSearchCondition.courseName',
                                                                            null,
                                                                        );
                                                                        form.setValue(
                                                                            'targetSearchCondition.courseCd',
                                                                            null,
                                                                        );
                                                                        form.setValue(
                                                                            'targetSearchCondition.courseDispatchNo',
                                                                            undefined,
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
                                    <div className='pt-3 bg-white'>
                                        <Container classnames='flex items-center'>
                                            <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[80px]'>
                                                コース
                                            </span>
                                            <Controller
                                                control={form.control}
                                                name='targetSearchCondition.courseName'
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
                                                                            'targetSearchCondition.courseName',
                                                                            null,
                                                                        );
                                                                        form.setValue(
                                                                            'targetSearchCondition.courseCd',
                                                                            null,
                                                                        );
                                                                        form.setValue(
                                                                            'targetSearchCondition.courseDispatchNo',
                                                                            undefined,
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
                                                onClick={() => handleOpenModal(ModalName.COURSE)}
                                                className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                                            >
                                                <FilterSvg className='m-auto' />
                                            </button>
                                        </Container>
                                    </div>
                                    <div className='pt-3 bg-white'>
                                        <Container classnames='flex items-start  gap-y-2 !pr-0'>
                                            <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[80px]'>
                                                場 所
                                            </span>
                                            <Controller
                                                control={form.control}
                                                name='targetSearchCondition.siteSearchType'
                                                render={({ field }) => (
                                                    <Radio.Group
                                                        {...field}
                                                        className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                                    >
                                                        <Radio value={0}>業者名</Radio>
                                                        <Radio value={1}>現場名</Radio>
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
                                                name='targetSearchCondition.siteSearchText'
                                                render={({ field }) => (
                                                    <Input
                                                        className='h-[44px] disabled-bg-white'
                                                        {...field}
                                                        placeholder='コースの場所の絞り込み条件を入力'
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
                                                                            'targetSearchCondition.siteSearchText',
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
                                </form>
                            ),
                        },
                    ]}
                />

                <div
                    ref={fixedElementRef}
                >
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
                            <button type='button' onClick={handleGetCourses}>
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
                {/* <div className='mt-[270px]' /> */}
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

            <ModalSelectCourseOfDay
                driverCd={form.watch('targetSearchCondition.driverCd')}
                open={openModal === ModalName.COURSE}
                setOpen={setOpenModal}
                handleSelectItem={handleSelectCourse}
            />

            <ModalSelectCourseOfDay
                driverCd={user.employeeCd}
                open={openModal === ModalName.DESINATION_COURSE}
                setOpen={setOpenModal}
                handleSelectItem={handleSelectDestinationCourse}
            />
        </Layout>
    );
};
export default SubtituteWorkSettingCourse;
