/* eslint-disable jsx-a11y/no-redundant-roles */
import React from 'react';
import { AddIcon } from 'components/icons/AddIcon';
import { RefreshBorderIcon } from 'components/icons/RefreshBorderIcon';

interface FuncBlockProps {
    leftChild: React.ReactNode;
    bgColor?: string;
    isShowRightIcon?: boolean;
    isShowIconRefresh?: boolean;
    onClickIcon?: () => void;
    onClickRefresh?: () => void;
}

const FuncBlock: React.FC<FuncBlockProps> = ({
    leftChild,
    bgColor,
    isShowRightIcon,
    isShowIconRefresh,
    onClickIcon,
    onClickRefresh,
}) => (
    <div
        className={`w-full px-4  py-2 flex justify-between items-center ${
            bgColor ?? 'bg-green15'
        } `}
    >
        {leftChild}

        <div className='flex items-center'>
            {isShowIconRefresh && (
                <div
                    role='button'
                    onKeyDown={onClickRefresh}
                    onClick={onClickRefresh}
                    className={isShowRightIcon ? 'mr-2 w-8 h-8' : 'w-8 h-8'}
                >
                    <RefreshBorderIcon className='w-full h-full object-cover' />
                </div>
            )}
            {isShowRightIcon && (
                <div
                    role='button'
                    onKeyDown={onClickIcon}
                    onClick={onClickIcon}
                    className='w-8 h-8 '
                >
                    <AddIcon className='w-full h-full object-cover' />
                </div>
            )}
        </div>
    </div>
);

export default FuncBlock;
