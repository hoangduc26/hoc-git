/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Input, Switch } from 'antd';
import iconGrayClock from 'assets/icons/ic_gray_clock.svg';
import iconInputClear from 'assets/icons/icon-input-clear.svg';
import iconInputSearch from 'assets/icons/ic_search.svg';
import Calendar from 'components/common/Calendar';
import CustomTimePicker from 'components/common/TimePicker';
import Container from 'components/organisms/container';
import Layout from 'components/templates/Layout';
import dayjs from 'dayjs';
import {
    IAddDeliveryRecord,
    IDeliveryRecordCollectionSite,
    IUpdateDeliveryRecord,
    IUploadingSite,
} from 'models/deliveryRecord';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
    useAddDeliveryRecordMutation,
    useDeleteDeliveryRecordMutation,
    useLazyGetDeliveryRecordCollectionSitesQuery,
    useLazyGetDeliveryRecordsByIdQuery,
    useUpdateDeliveryRecordMutation,
} from 'services/deliveryRecord';
import { setPreviousPage } from 'services/page';
import iconWhiteDelete from 'assets/icons/ic-white-delete.svg';
import { useGetQuantityFormatQuery } from 'services/settings';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE, STATUS_CODE } from 'utils/constants';
import { openConfirm, openInformation } from 'utils/functions';
import * as yup from 'yup';
import { convertQuantityCarryIn } from 'utils/number';
import { FilterSvg } from 'components/icons/FilterSvg';
import { BuildingOfficeIcon } from 'components/icons/BuildingOfficeIcon';
import { WebsiteIcon } from 'components/icons/WebsiteIcon';
import { WasteIcon } from 'components/icons/WasteIcon';
import ModalSelectDestinationFacility from './ModalSelectDestinationFacility';

interface IFormValue {
    isDelete?: boolean;
    isEdit?: boolean;
    time: string;
    deliverySeqNo: number;
    unloadingCompanyCd: string;
    unloadingCompanyName: string;
    unloadingSiteCd: string;
    unloadingSiteName: string;
    deliveryDate: string;
    deliveryQuantity: string;
    deliveryRecordRegistSetting: string;
    collectionSiteDtos: IDeliveryRecordCollectionSite[];
    timeStamp: string;
}

const CarryInInput = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const vehicle = useAppSelector((state) => state.reducer.vehicle);
    const workingDate = useAppSelector((state) => state.reducer.workingDate.workingDate);
    const importRecordRegistrationSetting = useAppSelector(
        (state) => state.reducer.systemSetting?.systemSetting?.importRecordRegistrationSetting,
    );
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const user = useAppSelector((state) => state.reducer.user);
    const { data: formatQuantityCd } = useGetQuantityFormatQuery();
    const [getDeliveryRecordCollectionSites, responseGetDeliveryRecordCollectionSites] =
        useLazyGetDeliveryRecordCollectionSitesQuery();
    const [getDeliveryRecordsById, responseGetDeliveryRecordsById] =
        useLazyGetDeliveryRecordsByIdQuery();
    const [deleteDeliveryRecord, responseDeleteDeliveryRecord] = useDeleteDeliveryRecordMutation();
    const [addDeliveryRecord, responseAddDeliveryRecord] = useAddDeliveryRecordMutation();
    const [updateDeliveryRecord, responseUpdateDeliveryRecord] = useUpdateDeliveryRecordMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const currentTime = dayjs().format('HH:mm');
    const form = useForm<IFormValue>({
        mode: 'all',
        defaultValues: {
            isDelete: false,
            isEdit: false,
            time: currentTime,
            deliverySeqNo: -1,
            unloadingCompanyCd: '',
            unloadingCompanyName: '',
            unloadingSiteCd: '',
            unloadingSiteName: '',
            deliveryDate: '',
            deliveryQuantity: '',
            deliveryRecordRegistSetting: '',
            collectionSiteDtos: [],
            timeStamp: '',
        },

        resolver: yupResolver(
            yup.object().shape({
                unloadingSiteCd: yup.string().when(['isDelete'], {
                    is: (val) => val === false,
                    then: yup.string().nullable().required('施設を選択してください。'),
                    otherwise: yup.string().nullable(),
                }),
                deliveryDate: yup.string().when(['isDelete'], {
                    is: (val) => val === false,
                    then: yup.string().nullable().required('搬入日を入力してください。'),
                    otherwise: yup.string().nullable(),
                }),
                time: yup.string().when(['isDelete'], {
                    is: (val) => val === false,
                    then: yup.string().nullable().required('搬入時刻を入力してください。'),
                    otherwise: yup.string().nullable(),
                }),
                deliveryQuantity: yup.string().when(['isDelete'], {
                    is: (val) => val === false,
                    then: yup.string().nullable().required('搬入量を入力してください。'),
                    otherwise: yup.string().nullable(),
                }),
                collectionSiteDtos: yup.array().when(['isDelete'], {
                    is: (val) => val === false,
                    then: yup
                        .array()
                        .compact((e) => !e.siteCheck)
                        .min(1, '回収現場を選択してください。'),
                    otherwise: yup.array().nullable(),
                }),
            }),
        ),
    });

    const isDelete = useMemo(() => form.watch('isDelete'), [form.watch('isDelete')]);
    const isEdit = useMemo(() => form.watch('isEdit'), [form.watch('isEdit')]);

    useEffect(() => {
        const deliverySeqNo = searchParams.get('deliverySeqNo');
        const isDeleteQueryParams = searchParams.get('isDelete');
        if (deliverySeqNo) {
            if (isDeleteQueryParams) {
                form.setValue('isDelete', true);
            } else {
                form.setValue('isEdit', true);
            }
        }

        if (user?.user && vehicle?.selectedVehicle?.vehicleCd && workingDate) {
            // Do something
        } else {
            // TODO: navigate to page select-vehicle ?
        }

        if (deliverySeqNo) {
            handleGetDeliveryRecordById(deliverySeqNo);
        } else {
            handleGetCollectionSites();
        }
    }, []);

    useEffect(() => {
        if (
            responseGetDeliveryRecordsById.data &&
            responseGetDeliveryRecordsById.status === STATUS_CODE.fulfilled &&
            (isEdit || isDelete)
        ) {
            let time = '';
            if (responseGetDeliveryRecordsById.data.deliveryDate) {
                time =
                    dayjs(responseGetDeliveryRecordsById.data.deliveryDate).format('HH:mm') || '';
            }

            let deliveryQuantity = '';
            if (responseGetDeliveryRecordsById.data.deliveryQuantity) {
                deliveryQuantity =
                    convertQuantityCarryIn(
                        responseGetDeliveryRecordsById.data.deliveryQuantity,
                        formatQuantityCd,
                    ) || '';
            }

            const newFormData: any = {
                ...responseGetDeliveryRecordsById.data,
                deliveryQuantity,
                time,
                isDelete,
                isEdit,
            };
            // reset form value
            form.reset(newFormData);
        }
    }, [responseGetDeliveryRecordsById]);

    const handleGetDeliveryRecordById = async (id) => {
        const params = {
            id,
            VehicleCd: vehicle?.selectedVehicle.vehicleCd,
            WorkDate: workingDate,
            CarrierCd: vehicle?.selectedVehicle.companyCd,
            DeliveryRecordRegistSetting: importRecordRegistrationSetting,
        };
        getDeliveryRecordsById(params);
    };

    const deliveryDate = form.watch('deliveryDate');

    const handleSelectDate = (d) => {
        form.setValue('deliveryDate', new Date(d).toISOString());
    };

    const handleSelectTime = (t) => {
        form.setValue('time', t);
    };

    const renderCalendar = useMemo(
        () => (
            <Calendar
                disabled={isDelete}
                defaultDate={deliveryDate}
                selectedDate={deliveryDate}
                handleSelectDate={handleSelectDate}
            />
        ),
        [deliveryDate],
    );

    const handleClickInputTimePicker = (e) => {
        if (isDelete) {
            return;
        }
        if (e.target.tagName === 'BUTTON') {
            return;
        }
        setOpenTimePicker(true);
    };

    const openModalSelectFacility = () => {
        setOpen(true);
    };

    const handleSelectFacility = (data: IUploadingSite) => {
        setOpen(false);
        form.setValue('unloadingSiteCd', data.siteCd);
        form.setValue('unloadingSiteName', data.siteName);
        form.setValue('unloadingCompanyCd', data.companyCd);
        form.setValue('unloadingCompanyName', data.companyName);
    };

    const handleRollback = () => {
        navigate(`/${CONSTANT_ROUTE.CARRY_IN_LIST}`);
    };

    const handleBlurInputQuantity = () => {
        const formatNumber =
            convertQuantityCarryIn(form.watch('deliveryQuantity'), formatQuantityCd) || '';
        form.setValue('deliveryQuantity', formatNumber);
    };

    const handleFocusInputQuantity = (e) => {
        e.target.select();
        const inputValue = e.target.value;
        const newValue = inputValue.replaceAll(',', '');
        form.setValue('deliveryQuantity', newValue);
    };

    const handleGetCollectionSites = async () => {
        const params = {
            VehicleCd: vehicle?.selectedVehicle.vehicleCd,
            WorkDate: workingDate,
            CarrierCd: vehicle?.selectedVehicle.companyCd,
            DeliveryRecordRegistSetting: importRecordRegistrationSetting,
        };
        const response = await getDeliveryRecordCollectionSites(params).unwrap();
        if (response?.length > 0) {
            form.setValue('collectionSiteDtos', response);
        }
    };
    const collectionSiteDtos = form.watch('collectionSiteDtos') || [];
    const handleCheckCollectionSite = (item: IDeliveryRecordCollectionSite) => {
        if (isDelete) {
            return;
        }
        const newCollectionSiteDtos = [...collectionSiteDtos];
        let ind = newCollectionSiteDtos.findIndex(
            (e) => e.siteCd === item.siteCd && e.seqNo === item.seqNo && e.edaban === item.edaban,
        );
        if (ind !== -1) {
            newCollectionSiteDtos[ind] = {
                ...newCollectionSiteDtos[ind],
                siteCheck: !newCollectionSiteDtos[ind].siteCheck,
            };
        }
        form.setValue('collectionSiteDtos', newCollectionSiteDtos);
    };

    const isSelectedAllCollectionSite = useMemo(
        () =>
            collectionSiteDtos?.length > 0 &&
            collectionSiteDtos?.length === collectionSiteDtos?.filter((e) => e.siteCheck)?.length,
        [collectionSiteDtos],
    );

    const totalCollectionSiteSelected = useMemo(
        () => collectionSiteDtos?.filter((e) => e.siteCheck)?.length,
        [collectionSiteDtos],
    );

    const toggleSelectAllCollectionSites = () => {
        if (isSelectedAllCollectionSite) {
            unSelectAllCollectionSites();
        } else {
            selectAllCollectionSites();
        }
    };

    const unSelectAllCollectionSites = () => {
        const newCollectionSiteDtos = JSON.parse(JSON.stringify(collectionSiteDtos));
        newCollectionSiteDtos.forEach((e) => {
            e.siteCheck = false;
        });

        form.setValue('collectionSiteDtos', newCollectionSiteDtos);
    };

    const selectAllCollectionSites = () => {
        const newCollectionSiteDtos = [...collectionSiteDtos];
        newCollectionSiteDtos.forEach((e) => {
            e.siteCheck = true;
        });
        form.setValue('collectionSiteDtos', newCollectionSiteDtos);
    };

    const renderCollectionSites = useMemo(() => {
        if (collectionSiteDtos?.length > 0) {
            return (
                <div className='py-4'>
                    <Container>
                        {collectionSiteDtos?.map((e, index) => (
                            <div
                                key={index}
                                role='button'
                                onClick={() => handleCheckCollectionSite(e)}
                                className={`shadow-md rounded-lg bg-white px-3 py-3 relative ${
                                    index + 1 != collectionSiteDtos?.length ? 'mb-3' : ''
                                }`}
                            >
                                <div className='flex items-start'>
                                    <Checkbox checked={e.siteCheck} disabled={isDelete} />
                                    <div className='text-sm ml-3'>
                                        <div className='flex items-start mb-1'>
                                            <div className='w-[22px] mr-3'>
                                                <BuildingOfficeIcon className='m-auto' />
                                            </div>
                                            <span className=' text-black27'>{e.companyName}</span>
                                        </div>
                                        <div className='flex items-start mb-1'>
                                            <div className='w-[22px] mr-3'>
                                                <WebsiteIcon className='m-auto' />
                                            </div>
                                            <span className=' text-black27'>{e.siteName}</span>
                                        </div>
                                        <div className='flex items-start'>
                                            <div className='w-[22px] mr-3'>
                                                <WasteIcon className='m-auto' />
                                            </div>
                                            <span className=' text-black27'>
                                                {e.productName} {e.otherProductFlg === 1 && '他'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Container>
                </div>
            );
        }
        return (
            <div className='py-5'>
                <Container>
                    <span className='text-yellow01 text-sm'>搬入情報はありません</span>
                </Container>
            </div>
        );
    }, [collectionSiteDtos]);

    const onSubmit = (formValue: IFormValue) => {
        openConfirm({
            content: (
                <div className='flex justify-center text-center items-center text-md font-bold w-full'>
                    <div>
                        {isDelete ? '搬入実績を削除します。' : '搬入実績を登録します。'}
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),
            onOk: () => {
                if (isDelete) {
                    handleDelete(formValue);
                } else if (isEdit) {
                    handleUpdate(formValue);
                } else {
                    handleCreateNew(formValue);
                }
            },
        });
    };

    const handleCreateNew = async (formValue: IFormValue) => {
        const deliveryHour = formValue.time?.split(':')[0];
        const deliveryMinute = formValue.time?.split(':')[1];
        const selectedcollectionSiteDtos = formValue.collectionSiteDtos
            .filter((e) => e.siteCheck)
            .map((e) => ({
                seqNo: e.seqNo,
                edaban: e.edaban,
                timeStamp: e.timeStamp,
            }));

        const body: IAddDeliveryRecord = {
            carrierCd: vehicle.selectedVehicle.companyCd,
            vehicleCd: vehicle?.selectedVehicle.vehicleCd,
            workDate: workingDate,
            collectionSiteDtos: selectedcollectionSiteDtos,
            deliveryDate: dayjs(formValue.deliveryDate)
                .set('hour', Number(deliveryHour))
                .set('minute', Number(deliveryMinute))
                .toISOString(),
            deliveryRecordRegistSetting: importRecordRegistrationSetting,
            deliveryQuantity: formValue.deliveryQuantity?.toString().replaceAll(',', ''),
            unloadingCompanyCd: formValue.unloadingCompanyCd,
            unloadingSiteCd: formValue.unloadingSiteCd,
        };

        const response: any = await addDeliveryRecord(body);
        if (response && !response.error) {
            // success
            navigate(`/${CONSTANT_ROUTE.CARRY_IN_LIST}`);
        }
    };

    const handleUpdate = async (formValue: IFormValue) => {
        const deliveryHour = formValue.time?.split(':')[0];
        const deliveryMinute = formValue.time?.split(':')[1];
        const selectedcollectionSiteDtos = formValue.collectionSiteDtos
            .filter((e) => e.siteCheck)
            .map((e) => ({
                seqNo: e.seqNo,
                edaban: e.edaban,
                timeStamp: e.timeStamp,
            }));

        const body: IUpdateDeliveryRecord = {
            carrierCd: vehicle.selectedVehicle.companyCd,
            vehicleCd: vehicle?.selectedVehicle.vehicleCd,
            workDate: workingDate,
            collectionSiteDtos: selectedcollectionSiteDtos,
            deliveryDate: dayjs(formValue.deliveryDate)
                .set('hour', Number(deliveryHour))
                .set('minute', Number(deliveryMinute))
                .toISOString(),
            deliveryRecordRegistSetting: importRecordRegistrationSetting,
            deliveryQuantity: formValue.deliveryQuantity?.toString().replaceAll(',', ''),
            unloadingCompanyCd: formValue.unloadingCompanyCd,
            unloadingSiteCd: formValue.unloadingSiteCd,
            timeStamp: formValue.timeStamp,
        };

        const params = {
            id: formValue.deliverySeqNo,
            body,
        };
        const response: any = await updateDeliveryRecord(params);
        if (response && !response.error) {
            navigate(`/${CONSTANT_ROUTE.CARRY_IN_LIST}`);
        }
    };

    const handleDelete = async (formValue: IFormValue) => {
        const requestParams = {
            id: formValue.deliverySeqNo,
            body: {
                timeStamp: formValue.timeStamp,
            },
        };
        const response: any = await deleteDeliveryRecord(requestParams);
        if (response && !response.error) {
            navigate(`/${CONSTANT_ROUTE.CARRY_IN_LIST}`);
        }
    };

    useEffect(() => {
        if (Object.keys(form.formState?.errors)?.length > 0) {
            let messageErr = '';
            const { errors } = form.formState;
            if (errors.unloadingSiteCd) {
                messageErr = errors.unloadingSiteCd.message;
            } else if (errors.deliveryDate) {
                messageErr = errors.deliveryDate.message;
            } else if (errors.time) {
                messageErr = errors.time.message;
            } else if (errors.deliveryQuantity) {
                messageErr = errors.deliveryQuantity.message;
            } else if (errors.collectionSiteDtos) {
                messageErr = errors.collectionSiteDtos?.message;
            }

            openInformation({
                content: <div className='text-center text-ssm font-bold'>{messageErr}</div>,
            });
        }
    }, [form.formState.errors]);

    return (
        <Layout
            title={isDelete ? '搬入実績削除' : '搬入実績登録'}
            isShowRollback
            isLoading={
                responseAddDeliveryRecord.isLoading ||
                responseGetDeliveryRecordCollectionSites.isLoading ||
                responseGetDeliveryRecordCollectionSites.isFetching ||
                responseGetDeliveryRecordsById.isLoading ||
                responseGetDeliveryRecordsById.isFetching ||
                responseUpdateDeliveryRecord.isLoading ||
                responseDeleteDeliveryRecord.isLoading
            }
            onClickRollback={handleRollback}
            fixedHeader
        >
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-header'>
                <div className='bg-green15 py-2'>
                    <Container classnames='flex justify-between items-center'>
                        <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                            搬入先情報
                        </span>
                    </Container>
                </div>
                <div className='py-3 bg-white '>
                    <Container classnames='flex items-center'>
                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-4'>
                            施設名
                        </span>
                        <Controller
                            control={form.control}
                            name='unloadingSiteName'
                            render={({ field }) => (
                                <Input
                                    className='h-[44px] disabled-bg-white'
                                    {...field}
                                    disabled
                                    prefix={
                                        !isEdit &&
                                        !isDelete && (
                                            <img src={iconInputSearch} alt='icon input search' />
                                        )
                                    }
                                    suffix={
                                        !isEdit &&
                                        !isDelete &&
                                        field.value && (
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    form.setValue('unloadingSiteName', '');
                                                    form.setValue('unloadingSiteCd', '');
                                                }}
                                            >
                                                <img src={iconInputClear} alt='icon input clear' />
                                            </button>
                                        )
                                    }
                                />
                            )}
                        />
                        {!isEdit && !isDelete && (
                            <button
                                type='button'
                                onClick={() => openModalSelectFacility()}
                                className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                            >
                                <FilterSvg className='m-auto' />
                            </button>
                        )}
                    </Container>
                </div>
                {renderCalendar}
                <div className='py-3 mb-[3px] border-t border-t-grayD8 bg-white'>
                    <Container classnames='flex items-center'>
                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-4'>
                            時 刻
                        </span>
                        <div
                            className='w-[130px] '
                            onClick={(e) => {
                                handleClickInputTimePicker(e);
                            }}
                            role='button'
                        >
                            <Controller
                                control={form.control}
                                name='time'
                                render={({ field }) => (
                                    <Input
                                        className='h-input-default disabled-bg-white pointer-events-none'
                                        {...field}
                                        disabled={isDelete}
                                        prefix={
                                            !isDelete && (
                                                <img src={iconGrayClock} alt='icon input search' />
                                            )
                                        }
                                    />
                                )}
                            />
                        </div>
                    </Container>
                </div>
                <div className='py-3 border-t border-t-grayD8 bg-white'>
                    <Container classnames='flex items-center'>
                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-4'>
                            搬入量
                        </span>
                        <Controller
                            control={form.control}
                            name='deliveryQuantity'
                            render={({ field }) => (
                                <Input
                                    type='tel'
                                    className='h-input-default w-full disabled-bg-white'
                                    {...field}
                                    onBlur={() => handleBlurInputQuantity()}
                                    onFocus={(e) => handleFocusInputQuantity(e)}
                                    disabled={isDelete}
                                    suffix={
                                        field.value && !isDelete ? (
                                            <button
                                                type='button'
                                                className=''
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    form.setValue('deliveryQuantity', null);
                                                }}
                                            >
                                                <img
                                                    src={iconInputClear}
                                                    alt='icon input clear'
                                                    className='pointer-events-none'
                                                />
                                            </button>
                                        ) : (
                                            <span />
                                        )
                                    }
                                />
                            )}
                        />
                        <span className='rounded flex justify-center items-center h-[44px] min-w-[44px] ml-2 border-grayD8 border bg-grayE9'>
                            Kg
                        </span>
                    </Container>
                </div>
                <div className='bg-green15 py-2'>
                    <Container classnames='flex justify-between items-center'>
                        <div className='flex items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                回収済み現場一覧（選択済
                                <span className='text-sm px-2 bg-red2a mx-2 text-yellow59 rounded font-bold'>
                                    {totalCollectionSiteSelected || 0}
                                </span>
                                )
                            </span>
                        </div>
                    </Container>
                </div>
                <div className='bg-white py-3'>
                    <Container>
                        <div className='flex items-center'>
                            <Switch
                                checked={
                                    collectionSiteDtos?.length > 0
                                        ? isSelectedAllCollectionSite
                                        : undefined
                                }
                                disabled={isDelete}
                                onClick={() => toggleSelectAllCollectionSites()}
                            />
                            <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] ml-3 mr-4'>
                                一括選択
                            </span>
                        </div>
                    </Container>
                </div>
                {renderCollectionSites}
                <div className='pb-7 pt-3'>
                    <Container>
                        <Button
                            className={`${
                                isDelete ? 'bg-red2a ' : 'bg-green1A '
                            } text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center`}
                            htmlType='submit'
                        >
                            {isDelete ? '削除' : '登録'}
                            {isDelete ? (
                                <img src={iconWhiteDelete} alt='icon delete' className='ml-2' />
                            ) : (
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
                            )}
                        </Button>
                    </Container>
                </div>
                <CustomTimePicker
                    defaultTime={form.watch('time')}
                    open={openTimePicker}
                    setOpen={setOpenTimePicker}
                    handleSelect={handleSelectTime}
                />
            </form>

            <ModalSelectDestinationFacility
                open={open}
                setOpen={setOpen}
                handleSelectItem={handleSelectFacility}
            />
        </Layout>
    );
};

export default CarryInInput;
