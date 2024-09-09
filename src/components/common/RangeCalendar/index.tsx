/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
import { Select } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { RightIcon } from 'components/icons/RightIcon';
import { LeftIcon } from 'components/icons/LeftIcon';
import { SelectIcon } from 'components/icons/SelectIcon';
import 'dayjs/locale/ja';
import './index.scss';

dayjs.locale('ja');

interface ICalendarProps {
    defaultDate?: any;
    startDate?: any;
    endDate?: any;
    handleSelectDate(date): void;
}

const weekdayList = [
    {
        value: 0,
        text: '月',
    },
    {
        value: 1,
        text: '火',
    },
    {
        value: 2,
        text: '水',
    },
    {
        value: 3,
        text: '木',
    },
    {
        value: 4,
        text: '金',
    },
    {
        value: 5,
        text: '土',
    },
    {
        value: 6,
        text: '日',
    },
];
const currentTime = {
    Year: new Date().getFullYear(),
    Month: new Date().getMonth() + 1,
};

const listMonth = [
    { value: 1, label: '01' },
    { value: 2, label: '02' },
    { value: 3, label: '03' },
    { value: 4, label: '04' },
    { value: 5, label: '05' },
    { value: 6, label: '06' },
    { value: 7, label: '07' },
    { value: 8, label: '08' },
    { value: 9, label: '09' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
];

const RangeCalendar = (props: ICalendarProps) => {
    const { defaultDate, startDate, endDate, handleSelectDate } = props;
    const [dateList, setDateList] = useState([]);
    const [selectYear, setSelectYear] = useState([]);
    const [startDateSelected, setStartDateSelected] = useState('');
    const [endDateSelected, setEndDateSelected] = useState('');
    const [defaultMonth, setDefaultMonth] = useState(0);
    const [defaultYear, setDefaultYear] = useState(0);

    const getAllDatesOfMonth = () => {
        const month = currentTime.Month;
        const year = currentTime.Year;
        const currentDate = new Date(new Date().setHours(0o0, 0o0, 0o0));



        const calendar = (new Array(31)).fill('').map((v, i) => new Date(year, month - 1, i + 1)).filter(v => v.getMonth() === month - 1).map((date: Date, index) => {
            let isCurrentDate = false;
            let isClick = false;
            let isBetween = false;
            const date1 = dayjs(date);
            const date2 = dayjs(currentDate);
            if (date1.isSame(date2, 'date')) {
                isCurrentDate = true;
            }

            if (date1.isAfter(startDate) && date1.isBefore(endDate)) {
                isBetween = true;
            }
            if (date1.isSame(startDate) || date1.isSame(endDate)) {
                isClick = true;
            }

            return {
                index,
                isUsed: true,
                weekday: date.getDay() === 0 ? 7 : date.getDay(),
                monthdate: date.getDate(),
                date: date.toISOString(),
                isCurrentDate,
                isClick,
                isBetween,
            };
        });
        checkToFillPreviousAndNextMonthDate(calendar);
    };

    const checkToFillPreviousAndNextMonthDate = (calendar: any) => {
        if (calendar[0].weekday > 1) {
            for (let weekday = calendar[0].weekday; weekday > 1; weekday--) {
                const firstDateObj = new Date(calendar[0].date);
                const addedDate = firstDateObj.setDate(firstDateObj.getDate() - 1);
                calendar.splice(0, 0, {
                    index: new Date(addedDate).getDate(),
                    isUsed: false,
                    weekday: weekday - 1,
                    monthdate: new Date(addedDate).getDate(),
                    date: new Date(addedDate).toISOString(),
                    isCurrentDate: false,
                    isClick: false,
                    isBetween: false,
                });
            }
        }
        if (calendar[calendar.length - 1].weekday < 7) {
            for (let weekday = calendar[calendar.length - 1].weekday; weekday < 7; weekday++) {
                const lastDateObj = new Date(calendar[calendar.length - 1].date);
                const addedDate = lastDateObj.setDate(lastDateObj.getDate() + 1);
                calendar.push({
                    index: new Date(addedDate).getDate(),
                    isUsed: false,
                    weekday: weekday + 1,
                    monthdate: new Date(addedDate).getDate(),
                    date: new Date(addedDate).toISOString(),
                    isCurrentDate: false,
                    isClick: false,
                    isBetween: false,
                });
            }
        }
        setDateList([]);
        const result: any = [];
        for (let row = 0; row < calendar.length; row += 7) {
            result.push(calendar.slice(row, row + 7));
        }
        setDateList(result);
    };

    useEffect(() => {
        getSelectYear();
        getAllDatesOfMonth();
    }, []);

    const getSelectYear = () => {
        const currentYear = (new Date()).getFullYear();
        const startYear = currentYear - 6;
        const endYear = currentYear + 3;
        const listYear = [];

        for (let i = startYear; i < endYear; i++) {
            const option = {
                value: i,
                label: i.toString(),
            };

            listYear.push(option);
        }
        setSelectYear(listYear);
    };

    useEffect(() => {
        currentTime.Month = dayjs(defaultDate).month() + 1;
        currentTime.Year = dayjs(defaultDate).year();
        setDefaultMonth(dayjs(defaultDate).month() + 1);
        setDefaultYear(dayjs(defaultDate).year());
        getAllDatesOfMonth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultDate]);

    useEffect(() => {
        setStartDateSelected(startDate);
        setEndDateSelected(endDate);
        for (const row of dateList) {
            for (const date of row) {
                const dates = dayjs(date.date).format('YYYY/MM/DD');
                if (startDate && endDate) {
                    if (date.isUsed && (dayjs(new Date(dates)).isAfter(startDate, 'day') && dayjs(new Date(dates)).isBefore(endDate, 'day'))) {
                        date.isBetween = true;
                    } else {
                        date.isBetween = false;
                    }
                } else {
                    date.isBetween = false;
                }
                if (startDate || endDate) {
                    if (date.isUsed && ((dayjs(new Date(dates)).isSame(startDate, 'day') && startDate !== undefined) || (dayjs(new Date(dates)).isSame(endDate, 'day') && endDate !== undefined))) {
                        date.isClick = true;
                    } else {
                        date.isClick = false;
                    }
                } else {
                    date.isClick = false;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);
    // eslint-disable-next-line arrow-body-style
    const selectDate = (d) => {
        if (d.isUsed) {
            handleSelectDate(d.date);
        }
    };

    const renderDayOfWeek = useMemo(
        () =>
            dateList.map((row, i) => (
                <tr key={i}>
                    {row.map((date) => (
                        <td className='text-center' key={date.index} >
                            <div className={classNames(
                                `fw-bold border rounded-md h-[30px] flex justify-center items-center ${date.isCurrentDate ? 'border-green15' : ''}`,
                                date.isClick ? '!bg-green15 !text-white' : date.isBetween ? '!bg-greenC5 !text-green15' : date.isUsed ? '!bg-white !text-black' : 'text-grayD4',
                            )} onClick={() => selectDate(date)} onKeyDown={() => selectDate(date)}>{date.monthdate}</div>
                        </td >
                    ))}
                </tr >
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dateList, startDateSelected, endDateSelected],
    );

    const handleChangeMonth = (value) => {
        setDefaultMonth(+value);
        currentTime.Month = +value;
        currentTime.Year = defaultYear;

        getAllDatesOfMonth();
    };

    const handleChangeYear = (value) => {
        setDefaultYear(+value);
        currentTime.Month = defaultMonth;
        currentTime.Year = +value;

        getAllDatesOfMonth();
    };

    const handleChangeNext = () => {
        let month = defaultMonth;
        month += 1;
        if (month > 12) {
            currentTime.Month = 1;
            currentTime.Year = defaultYear + 1;
        } else {
            currentTime.Month = defaultMonth + 1;
            currentTime.Year = defaultYear;
        }
        setDefaultMonth(currentTime.Month);
        setDefaultYear(currentTime.Year);

        getAllDatesOfMonth();
    };

    const handleChangePrevious = () => {
        let month = defaultMonth;
        month -= 1;
        if (month < 1) {
            currentTime.Month = 12;
            currentTime.Year = defaultYear - 1;
        } else {
            currentTime.Month = defaultMonth - 1;
            currentTime.Year = defaultYear;
        }
        setDefaultMonth(currentTime.Month);
        setDefaultYear(currentTime.Year);

        getAllDatesOfMonth();
    };

    return (
        <div className='week-calendar'>
            <div className='flex justify-between items-center'>
                <div onClick={handleChangePrevious}>
                    <div className='w-5 h-5'>
                        <LeftIcon className='w-full h-full object-cover' />
                    </div>
                </div>
                <div>
                    <div className='flex justify-center items-center'>
                        <Select
                            defaultValue={dayjs(defaultDate).month() + 1}
                            className='pe-1 select-month-year'
                            onChange={handleChangeMonth}
                            options={listMonth}
                            value={defaultMonth}
                            suffixIcon={
                                <button
                                    type='button'
                                    className='w-2 h-5'
                                >
                                    <SelectIcon className='w-full h-full object-cover' />
                                </button>
                            }
                        />
                        <Select
                            defaultValue={dayjs(defaultDate).year()}
                            onChange={handleChangeYear}
                            options={selectYear}
                            value={defaultYear}
                            suffixIcon={
                                <button
                                    type='button'
                                    className='w-2 h-5'
                                >
                                    <SelectIcon className='w-full h-full object-cover' />
                                </button>
                            }
                        />
                    </div>
                </div>
                <div onClick={handleChangeNext}>
                    <div className='w-5 h-5'>
                        <RightIcon className='w-full h-full object-cover' />
                    </div>
                </div>
            </div>
            <div className="table my-3 w-full">
                <table className="w-full ">
                    <thead className="position-static">
                        <tr>
                            {weekdayList.map((item) => (
                                <td className='p-1 text-center border fw-bold' key={item.value}>
                                    ({item.text})
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {renderDayOfWeek}
                    </tbody >
                </table >
            </div >
        </div>
    );
};
export default RangeCalendar;
