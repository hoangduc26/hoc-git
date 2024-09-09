/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import './index.scss';
import { useAppSelector } from 'store/hooks';

type TagColor = 'green' | 'red';

export interface IJobRegisterCard {
    isCollected: boolean;
    containerName: string;
    containerTypeName: string;
    settingType: number;
    quantity: number;
    handleClickItem?(): void;
}
const JOBRegisterCard: React.FC<IJobRegisterCard> = ({
    isCollected,
    containerName,
    containerTypeName,
    settingType,
    quantity,
    handleClickItem,
}) => {
    const { user }: any = useAppSelector((state) => state.reducer.user);
    return <div className={`jobcard-wrapper ${isCollected === true ? 'green' : ''}`} onClick={handleClickItem}>
        {isCollected === false ? (
            <h1 className='font-medium text-xl' style={{ color: '#bd472a' }}>
                未登録
            </h1>
        ) : (
            <h1 className='font-medium text-xl' style={{ color: 'var(--main-color)' }}>
                登録済
            </h1>
        )}

        {settingType === 1 ? (
            <span className='text-gray68 text-sm'>
                作業：<span className='text-black27'>設置</span>
            </span>
        ) : settingType === 2 ? (
            <span className='text-gray68 text-sm'>
                作業：<span className='text-black27'>引揚</span>
            </span>
        ) : settingType === 9 ? (
            <span className='text-gray68 text-sm'>
                作業：<span className='text-black27'>未作業</span>
            </span>
        ) : (
            <span className='text-gray68 text-sm'>
                作業：
                <span className='text-black27' />
            </span>
        )}
        <span className='text-gray68 text-sm'>
            種類：<span className='text-black27'>{containerTypeName}</span>
        </span>
        {user.containerManagementType === 1 && <span className='text-gray68 text-sm'>
            台数：<span className='text-black27'>{quantity}</span>
        </span>}
        {user.containerManagementType === 2 && <span className='text-gray68 text-sm'>
            名称：<span className='text-black27'>{containerName}</span>
        </span>}
    </div>;
};

export default JOBRegisterCard;
