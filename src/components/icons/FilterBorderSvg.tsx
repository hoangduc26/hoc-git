import React from 'react';

export const FilterBorderSvg = ({ className }: { className? }) => (
    <svg
        width='50'
        height='50'
        viewBox='0 0 50 50'
        className={className || ''}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <g filter='url(#filter0_dd_162_4044)'>
            <rect x='3' y='2' width='44' height='44' rx='4' fill='white' />
            <path
                d='M35 15H15L23 24.46V31L27 33V24.46L35 15Z'
                stroke='var(--sub-color)'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <rect x='3.5' y='2.5' width='43' height='43' rx='3.5' stroke='var(--sub-color)' />
        </g>
        <defs>
            <filter
                id='filter0_dd_162_4044'
                x='0'
                y='0'
                width='50'
                height='50'
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
                    values='0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0'
                />
                <feBlend
                    mode='normal'
                    in2='BackgroundImageFix'
                    result='effect1_dropShadow_162_4044'
                />
                <feColorMatrix
                    in='SourceAlpha'
                    type='matrix'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                    result='hardAlpha'
                />
                <feOffset dy='1' />
                <feGaussianBlur stdDeviation='1.5' />
                <feColorMatrix
                    type='matrix'
                    values='0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0'
                />
                <feBlend
                    mode='normal'
                    in2='effect1_dropShadow_162_4044'
                    result='effect2_dropShadow_162_4044'
                />
                <feBlend
                    mode='normal'
                    in='SourceGraphic'
                    in2='effect2_dropShadow_162_4044'
                    result='shape'
                />
            </filter>
        </defs>
    </svg>
);
