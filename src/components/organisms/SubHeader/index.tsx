/* eslint-disable jsx-a11y/no-redundant-roles */
import React from 'react';
import TimeInfo, { TimeInfoProps } from './TimeInfo';

interface SubHeaderProps {
    title: string;
    desc: string;
    icon?: string;
    dateTimeInfos?: TimeInfoProps;
    svgIcon?:any;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title, desc, icon, dateTimeInfos, svgIcon }) => (
    <>
        {dateTimeInfos && <TimeInfo {...dateTimeInfos} />}
        <div className='sub- header bg-white px-4 py-3 flex items-start gap-3'>
            <div>
                {
                    svgIcon || <img src={icon} className='w-full h-full object-cover' alt='icon' />
                }
            </div>

            <div className='flex flex-col gap-2'>
                <h2 className='text-xl text-green1A font-medium capitalize mb-0'>{title}</h2>
                <h3 className='text-md text-black52 font-medium capitalize mb-0'>{desc}</h3>
            </div>
        </div>
    </>
);

export default SubHeader;
