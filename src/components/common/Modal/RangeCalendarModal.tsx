/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
import { Button, Input, Modal } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import { CalendarGreenNotClockIcon } from 'components/icons/CalendarGreenNotClockIcon';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import RangeCalendar from '../RangeCalendar';

export interface ISelectValueModal {
    workDateFrom?: any;
    workDateTo?: any;
    open: boolean;
    setOpen(value: boolean): void;
    handleSelectItem(item: any): void;
}

interface IFormRangeDate {
    startDate: string;
    endDate: string;
}

const currDate = new Date();

const RangeCalendarModal: React.FC<ISelectValueModal> = ({
    workDateFrom,
    workDateTo,
    open,
    setOpen,
    handleSelectItem,
}) => {
    const { control, watch, setValue } = useForm<IFormRangeDate>({
        defaultValues: null,
    });

    useEffect(() => {
        if (workDateFrom) {
            setValue('startDate', dayjs(workDateFrom).format('YYYY/MM/DD'));
        }
        if (workDateTo) {
            setValue('endDate', dayjs(workDateTo).format('YYYY/MM/DD'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workDateFrom, workDateTo]);

    const onCloseModal = () => {
        setOpen(false);
    };

    const submit = () => {
        if (watch('startDate') || watch('endDate')) {
            const item = {
                workDateFrom: watch('startDate'),
                workDateTo: watch('endDate'),
            };
            handleSelectItem(item);
        }
        setOpen(false);
    };

    const handleSelectDate = (item: any) => {
        if (item) {
            if (!watch('startDate') && !watch('endDate')) {
                setValue('startDate', dayjs(item).format('YYYY/MM/DD'));
            } else if (watch('startDate') && !watch('endDate')) {
                if (dayjs(new Date(item)).isBefore(watch('startDate'), 'day')) {
                    setValue('endDate', dayjs(watch('startDate')).format('YYYY/MM/DD'));
                    setValue('startDate', dayjs(item).format('YYYY/MM/DD'));
                } else {
                    setValue('endDate', dayjs(item).format('YYYY/MM/DD'));
                }
            } else if (watch('startDate') && watch('endDate')) {
                if (!dayjs(new Date(item)).isSame(watch('startDate'), 'day') && !dayjs(new Date(item)).isSame(watch('endDate'), 'day')) {
                    if (dayjs(new Date(item)).isBefore(watch('startDate'), 'day')) {
                        setValue('startDate', dayjs(item).format('YYYY/MM/DD'));
                    } else {
                        setValue('endDate', dayjs(item).format('YYYY/MM/DD'));
                    }
                } else {
                    setValue('endDate', dayjs(item).format('YYYY/MM/DD'));
                }
            }
        }
    };
    
    return (
        <Modal className='main-menu__modal  font-inter h-screen' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A sticky top-0 w-full z-10'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-2'>期間を選択</h2>
                </div>
                <div role='button' onClick={onCloseModal}>
                    <img src={iconClose} className='w-full h-full object-cover' alt='info' />
                </div>
            </div>

            <div className=''>
                <div className='flex justify-between bg-green1A px-4 pb-4 sticky top-[80px] w-full z-10'>
                    <div className='pe-2'>
                        <div className='text-white mb-1'>日から</div>
                        <Controller
                            render={({
                                field,
                            }) => (
                                <Input
                                    {...field}
                                    readOnly
                                    size='middle'
                                    className='!border-grayD4'
                                    prefix={
                                        <div className='w-5 h-5'>
                                            <CalendarGreenNotClockIcon className='w-full h-full object-cover' />
                                        </div>
                                    }
                                />
                            )}
                            name='startDate'
                            control={
                                control
                            }
                            defaultValue=''
                        />
                    </div>
                    <div className='ps-2'>
                        <div className='text-white mb-1'>日まで</div>
                        <Controller
                            render={({
                                field,
                            }) => (
                                <Input
                                    {...field}
                                    readOnly
                                    size='middle'
                                    className='!border-grayD4'
                                    prefix={
                                        <div className='w-5 h-5'>
                                            <CalendarGreenNotClockIcon className='w-full h-full object-cover' />
                                        </div>
                                    }
                                />
                            )}
                            name='endDate'
                            control={
                                control
                            }
                            defaultValue=''
                        />
                    </div>
                </div>
                <div className='overflow-auto px-4 py-2 h-[calc(100vh_-_263.141px)]'>
                    <div className='mt-4'>
                        <RangeCalendar
                            defaultDate={currDate}
                            startDate={
                                watch(
                                    'startDate',
                                ) ||
                                null
                            }
                            endDate={
                                watch(
                                    'endDate',
                                ) ||
                                null
                            }
                            handleSelectDate={
                                handleSelectDate
                            }
                        />
                    </div>
                    <div className='mt-4'>
                        <RangeCalendar
                            defaultDate={dayjs(currDate).add(1, 'month').toString()}
                            startDate={
                                watch(
                                    'startDate',
                                ) ||
                                null
                            }
                            endDate={
                                watch(
                                    'endDate',
                                ) ||
                                null
                            }
                            handleSelectDate={
                                handleSelectDate
                            }
                        />
                    </div>
                </div >
            </div >
            <div className='px-4 py-6 sticky w-full bottom-0 bg-grayE9'>
                <div className='flex'>
                    <div className='pr-2 w-1/2'>
                        <Button
                            htmlType='button'
                            onClick={() => {
                                setValue(
                                    'startDate',
                                    null,
                                );
                                setValue(
                                    'endDate',
                                    null,
                                );
                            }}
                            className='h-btn-default text-center rounded text-black52 border-black52 bg-white w-full shadow-sm text-sm  hover:!text-black52 hover:!border-black52 :!bg-white'
                        >
                            クリア
                        </Button>
                    </div>
                    <div className='pl-2 w-1/2'>
                        <Button
                            htmlType='button'
                            onClick={() => submit()}
                            disabled={!watch('startDate') || !watch('endDate')}
                            className='h-btn-default text-center rounded text-white border-green1A bg-green1A w-full shadow-sm text-sm'
                        >
                            OK({watch('startDate') && watch('endDate') ? dayjs(watch('endDate')).diff(watch('startDate'), 'day') + 1 : 0}日)
                        </Button>
                    </div>
                </div>
            </div>
        </Modal >
    );
};

export default RangeCalendarModal;
