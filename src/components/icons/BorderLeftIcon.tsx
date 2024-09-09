import React from 'react';

export const BorderLeftIcon = ({ className }) => (
    <svg width='16' height='68' viewBox='0 0 16 68' className={className} fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g filter='url(#filter0_d_1001_7695)'>
            <path
                d='M2 4C6.41828 4 10 7.58172 10 12V56C10 60.4183 6.41828 64 2 64V4Z'
                fill='var(--main-color)'
            />
        </g>
        <defs>
            <filter
                id='filter0_d_1001_7695'
                x='0'
                y='0'
                width='16'
                height='68'
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
                <feOffset dx='2' />
                <feGaussianBlur stdDeviation='2' />
                <feComposite in2='hardAlpha' operator='out' />
                <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0' />
                <feBlend
                    mode='normal'
                    in2='BackgroundImageFix'
                    result='effect1_dropShadow_1001_7695'
                />
                <feBlend
                    mode='normal'
                    in='SourceGraphic'
                    in2='effect1_dropShadow_1001_7695'
                    result='shape'
                />
            </filter>
        </defs>
    </svg>
);
