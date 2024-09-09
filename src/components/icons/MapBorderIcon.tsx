import React from 'react';

export const MapBorderIcon = ({ className }) => (
    <svg
        width='36'
        className={className}
        height='36'
        viewBox='0 0 36 36'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <g filter='url(#filter0_d_2217_1019)'>
            <rect x='2' y='1' width='32' height='32' rx='4' fill='white' />
            <g clipPath='url(#clip0_2217_1019)'>
                <path
                    d='M25.5 15.334C25.5 21.1673 18 26.1673 18 26.1673C18 26.1673 10.5 21.1673 10.5 15.334C10.5 13.3449 11.2902 11.4372 12.6967 10.0307C14.1032 8.62416 16.0109 7.83398 18 7.83398C19.9891 7.83398 21.8968 8.62416 23.3033 10.0307C24.7098 11.4372 25.5 13.3449 25.5 15.334Z'
                    stroke='var(--main-color)'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
                <path
                    d='M18 17.834C19.3807 17.834 20.5 16.7147 20.5 15.334C20.5 13.9533 19.3807 12.834 18 12.834C16.6193 12.834 15.5 13.9533 15.5 15.334C15.5 16.7147 16.6193 17.834 18 17.834Z'
                    stroke='var(--main-color)'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </g>
            <rect x='2.5' y='1.5' width='31' height='31' rx='3.5' stroke='var(--main-color)' />
        </g>
        <defs>
            <filter
                id='filter0_d_2217_1019'
                x='0'
                y='0'
                width='36'
                height='36'
                filterUnits='userSpaceOnUse'
                colorInterpolationFilters='sRGB'
            >
                <feFlood floodOpacity='0' result='BackgroundImageFix' />
                <feColorMatrix
                    in='SourceAlpha'
                    type='matrix'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                    result='hardAlpha'
                />
                <feOffset dy='1' />
                <feGaussianBlur stdDeviation='1' />
                <feColorMatrix
                    type='matrix'
                    values='0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0'
                />
                <feBlend
                    mode='normal'
                    in2='BackgroundImageFix'
                    result='effect1_dropShadow_2217_1019'
                />
                <feBlend
                    mode='normal'
                    in='SourceGraphic'
                    in2='effect1_dropShadow_2217_1019'
                    result='shape'
                />
            </filter>
            <clipPath id='clip0_2217_1019'>
                <rect width='20' height='20' fill='white' transform='translate(8 7)' />
            </clipPath>
        </defs>
    </svg>
);
