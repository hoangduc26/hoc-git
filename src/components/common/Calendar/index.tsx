import { Button } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'dayjs/locale/ja';

dayjs.locale('ja');

interface ICalendarProps {
    defaultDate?: any;
    selectedDate?: any;
    handleSelectDate(date): void;
    disabled?: boolean;
}

const Calendar = (props: ICalendarProps) => {
    const { defaultDate, selectedDate, handleSelectDate, disabled } = props;
    const [dayOfWeek, setDayOfWeek] = useState([]);
    const isAlreadySetupDefaultDate = useRef(false);

    const getWeekByDate = (date) => {
        const newDayOfWeek = [];
        const curr = new Date(date);
        const first = curr.getDate() - curr.getDay(); // First day of week
        for (let i = 0; i < 7; i += 1) {
            const newDate = new Date(new Date(new Date(date).setDate(first + i)).setHours(0, 0, 0));
            newDayOfWeek.push({
                date: newDate,
                day: dayjs(newDate).format('dd'),
                getDate: newDate.getDate().toString().padStart(2, '0'),
                getYear: newDate.getFullYear(),
                getMonth: (newDate.getMonth() + 1).toString().padStart(2, '0'),
            });
        }
        setDayOfWeek(newDayOfWeek);
    };

    useEffect(() => {
        const currDate = new Date();
        getWeekByDate(currDate);
    }, []);

    useEffect(() => {
        if (defaultDate && isAlreadySetupDefaultDate.current === false) {
            isAlreadySetupDefaultDate.current = true;
            handleSelectDate(new Date(defaultDate));
            getWeekByDate(defaultDate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultDate]);

    const handleNextWeek = () => {
        const last = dayOfWeek[dayOfWeek.length - 1];
        const nextDate = dayjs(last.date).add(1, 'day');
        getWeekByDate(nextDate);
    };

    const handlePreviousWeek = () => {
        const last = dayOfWeek[0];
        const previousDate = dayjs(last.date).add(-1, 'day');
        getWeekByDate(previousDate);
    };

    const selectDate = (d) => {
        if (disabled === true) {
            return;
        }
        handleSelectDate(d.date);
    };

    const isDaySelected = useMemo(
        () => (d) => dayjs(new Date(d.date)).isSame(selectedDate, 'day'),
        [selectedDate],
    );

    const renderDayOfWeek = useMemo(
        () =>
            dayOfWeek.map((d, index) => (
                <div
                    key={d.getDate}
                    tabIndex={0}
                    role='button'
                    onClick={() => selectDate(d)}
                    onKeyDown={() => selectDate(d)}
                >
                    <div>
                        <div
                            className={classNames(
                                'font-light text-sm text-center font-zenMaru',
                                isDaySelected(d) ? 'text-[var(--background-footer)]' : 'text-gray93',
                            )}
                        >
                            ({d.day})
                        </div>
                        <div
                            className={classNames(
                                'text-md font-bold  font-zenMaru text-center',
                                isDaySelected(d) ? 'text-[var(--background-footer)]' : 'text-gray93',
                            )}
                        >
                            {d.getDate}
                        </div>
                    </div>
                </div>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dayOfWeek, isDaySelected],
    );

    // eslint-disable-next-line arrow-body-style
    const renderRangeDay = useMemo(() => {
        if (dayOfWeek.length > 0) {
            return `${dayOfWeek[0].getYear}/${dayOfWeek[0].getMonth}/${dayOfWeek[0].getDate} -  ${
                dayOfWeek[dayOfWeek.length - 1].getDate
            }`;
        }
        return ``;
    }, [dayOfWeek]);

    return (
        <div className='week-calendar shadow-week-calendar'>
            <div className='flex'>
                <div className='h-[70px] bg-green15 flex items-center justify-center px-4'>
                    <div className='text-center text-white'>
                        <span className='text-lg font-bold block  font-zenMaru'>今日</span>
                        <span className='text-sm font-zenMaru font-light'>
                            {dayjs(new Date()).format('YYYY/MM/DD')}
                        </span>
                    </div>
                </div>
                <div className='bg-white w-full flex items-center justify-center border-b border-b-grayD8 border-t border-t-grayD8'>
                    <div className='flex items-start justify-between w-full h-full'>
                        <Button
                            htmlType='button'
                            className='pr-0 pl-5 border-0 h-full'
                            onClick={() => handlePreviousWeek()}
                        >
                            <svg
                                width='8'
                                height='15'
                                viewBox='0 0 8 15'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M7 13.5L1 7.5L7 1.5'
                                    stroke='var(--sub-color)'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </Button>
                        <span className='text-lg font-bold text-black3A h-full flex items-center'>
                            {renderRangeDay}
                        </span>
                        <Button
                            htmlType='button'
                            className='pr-5 pl-0 border-0 h-full'
                            onClick={() => handleNextWeek()}
                        >
                            <svg
                                width='8'
                                height='15'
                                viewBox='0 0 8 15'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M1 13.5L7 7.5L1 1.5'
                                    stroke='var(--sub-color)'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-around py-3 bg-white'>{renderDayOfWeek}</div>
        </div>
    );
};
export default Calendar;
