/* eslint-disable jsx-a11y/no-redundant-roles */
import React from 'react';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import iconClock from 'assets/icons/ic_clock.svg';
import dayjs from 'dayjs';

export interface TimeInfoProps {
    title?: string | null;
    date?: Date;
    time?: string | null;
}

const TimeInfo: React.FC<TimeInfoProps> = ({ title, date, time }) => (
    <div className='sub-header px-4 py-4 grid grid-cols-4 bg-grayE9'>
        {title && (
            <div className='flex flex-col gap-2'>
                <h2 className='text-md capitalize mb-0'>{title}</h2>
            </div>
        )}
        <div
            className={`flex flex-row gap-3 items-center justify-center col-span-2 translate-x-[${
                title ? '' : '-10px'
            }]`}
        >
            <img src={iconCalendar} className='text-black52 object-contain' alt='icon' />
            <h2 className='text-md text-black52 font-medium capitalize mb-0'>
                {dayjs(date).format('YYYY/MM/DD')}
            </h2>
        </div>
        <div
            className={`flex flex-row gap-2 items-center relative ${
                title ? 'col-span-1 justify-end' : 'col-span-2 justify-center'
            }`}
        >
            <div className='absolute left-0 bg-[#BEBEBE] w-[1px] h-[70%]' />
            <img src={iconClock} className='object-contain' alt='icon' />
            <h2 className='text-md text-black52 font-medium capitalize mb-0'>{time}</h2>
        </div>
    </div>
);

export default TimeInfo;
