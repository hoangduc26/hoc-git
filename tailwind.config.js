/* eslint-disable*/
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            ssm: '280px',

            sm: '375px',

            md: '768px',

            lg: '1024px',

            xl: '1400px',
        },

        fontSize: {
            ssm: '16px',
            sm: '18px',
            md: '20px',
            lg: '22px',
            xl: '24px',
        },
        extend: {
            spacing: {
                xs: '576px',
                md: '768px',
                lg: '992px',
                xl: '1280px',
                xxl: '1440px',
                header: '112px'
            },
            colors: {
                white: '#FFFFFF',
                greenDC: 'var(--sub-color-lightest)',
                green1A: 'var(--main-color)',
                green15: 'var(--sub-color)',
                green25: 'var(--sub-color-light)',
                green26: 'var(--sub-color-lighter)',
                green3C: 'var(--sub-color-lighter)',
                greenC5: 'var(--main-color-lightest)',
                red2a: '#bd472a',

                grayE9: '#E9E9E9',
                grayD4: '#D4D4D4',
                gray68: '#686868',
                grayBE: '#BEBEBE',

                black52: '#525252',
                yellow59: '#FFE659',
                yellow25: '#FFF9DC',

                black11: '#111111',
                black3C: '#3C3C3C',
                black3A: '#3A3A3A',
                black37: '#373737',
                black27: '#272727',
                black4F: '#49454F',

                blue01A: '#22701A',

                yellow01: '#EDB401',

                grayD8: '#d8d8d8',
                gray93: '#939393',
                grayF0: '#F0F0F0',
                gray3C: '#3C3C3C',
            },

            boxShadow: {
                'week-calendar': '0px 1px 2px rgba(16, 24, 40, 0.05);',
            },

            height: {
                'input-default': '44px',
                'btn-default': '50px',
                'fixed-header': 'calc(100vh - 174px)',
            },

            lineHeight: {
                'input-default': '44px',
            },
        },
        fontFamily: {},
    },
    plugins: [require('tailwindcss'), require('autoprefixer')],
};
