import React, { useState } from 'react';
import './index.scss';
import { Button } from 'antd';

type TagColor = 'green' | 'red';

export interface IOperationStatusCard {
    driverName: string;
    updateDate: string;
    latitude: number;
    longitude: number;
    uncollected: string;
    collected: number;
    exclusion: number;
    vehicleName: string;
    vehicleTypeName: string;
    onClick: (x, y) => void;
}

const OperationStatusCard: React.FC<IOperationStatusCard> = ({
    driverName,
    updateDate,
    latitude,
    longitude,
    uncollected,
    collected,
    exclusion,
    vehicleName,
    vehicleTypeName,
    onClick,
}) => {
    const [latitudeNew, setLattitue] = useState(0);
    const [longitudeNew, setLongitude] = useState(0);
    const positionNew = [latitudeNew, longitudeNew];
    const setLocation = () => {
        setLattitue(latitude);
        setLongitude(longitude);
        onClick(latitude, longitude);
        // console.log('latitude', latitude, longitude);
        // setLat(latitude);
        // setLng(longitude);
    };

    return (
        <div className='jobcard-wrapper green'>
            <h1 className='font-medium text-xl' style={{ color: 'green' }}>
                {driverName}
            </h1>
            <span className='text-gray68 text-sm'>
                時間 : <span className='text-black27'>{updateDate}</span>
            </span>
            <span className='text-gray68 text-sm'>
                {/* 場所 : <span className='text-black27'>{address}</span> */}
            </span>
            <span className='text-gray68 text-sm'>
                {/* 状況 : <span className='text-black27'>{situation}</span> */}
            </span>
            <span className='text-gray68 text-sm'>
                車輌 :
                <span className='text-black27'>
                    {vehicleName}
                    {`${vehicleTypeName === null ? '' : `(${vehicleTypeName})`}`}
                </span>
            </span>
            <Button
                onClick={setLocation}
                className='w-full border-[var(--main-color)] rounded-xl py-[10px] hover:bg-[var(--sub-color)]'
            >
                回収状況
            </Button>
        </div>
    );
};

export default OperationStatusCard;
