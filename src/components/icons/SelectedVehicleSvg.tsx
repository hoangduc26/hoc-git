import React from 'react';

export const SelectedVehicleSvg = () => (
    <svg width='93' height='45' viewBox='0 0 93 45' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g filter='url(#filter0_dd_1520_1713)'>
            <path
                d='M93 0H3C69.6964 8.44322 49.6072 45.5934 93 40.5275V0Z'
                fill='var(--sub-color)'
            />
        </g>
        <defs>
            <filter
                id='filter0_dd_1520_1713'
                x='0'
                y='-2'
                width='96'
                height='47'
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
                    result='effect1_dropShadow_1520_1713'
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
                    in2='effect1_dropShadow_1520_1713'
                    result='effect2_dropShadow_1520_1713'
                />
                <feBlend
                    mode='normal'
                    in='SourceGraphic'
                    in2='effect2_dropShadow_1520_1713'
                    result='shape'
                />
            </filter>
        </defs>
    </svg>
);
