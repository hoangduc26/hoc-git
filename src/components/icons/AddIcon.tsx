import React from 'react';

export const AddIcon = ({ className }: { className? }) => (
    <svg
        width='34'
        height='34'
        className={className || ''}
        viewBox='0 0 34 34'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M18 10.2C18 9.64772 17.5523 9.2 17 9.2C16.4477 9.2 16 9.64772 16 10.2V16H10.2C9.64772 16 9.2 16.4477 9.2 17C9.2 17.5523 9.64772 18 10.2 18H16V23.8C16 24.3523 16.4477 24.8 17 24.8C17.5523 24.8 18 24.3523 18 23.8V18H23.8C24.3523 18 24.8 17.5523 24.8 17C24.8 16.4477 24.3523 16 23.8 16H18V10.2ZM33 17C33 25.8366 25.8366 33 17 33C8.16344 33 1 25.8366 1 17C1 8.16344 8.16344 1 17 1C25.8366 1 33 8.16344 33 17Z'
            fill='white'
            stroke='var(--sub-color)'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);
