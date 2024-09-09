import { useEffect, useState } from 'react';

const smallMobileMediaQuery = window.matchMedia('(max-width: 576px)');
const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
const tabletMediaQuery = window.matchMedia('(max-width: 1200px)');
const desktopMediaQuery = window.matchMedia('(min-width: 1199px)');

export default function useDeviceQueries() {
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 576);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1200);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1199);

    useEffect(() => {
        const querySmallMobileChanged = (e: MediaQueryListEvent) => {
            setIsSmallMobile(e.matches);
        };
        const queryMobileChanged = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };
        const queryTabletChanged = (e: MediaQueryListEvent) => {
            setIsTablet(e.matches);
        };
        const queryDesktopChanged = (e: MediaQueryListEvent) => {
            setIsDesktop(e.matches);
        };

        try {
            smallMobileMediaQuery.addEventListener('change', querySmallMobileChanged);
            mobileMediaQuery.addEventListener('change', queryMobileChanged);
            tabletMediaQuery.addEventListener('change', queryTabletChanged);
            desktopMediaQuery.addEventListener('change', queryDesktopChanged);
        } catch (error) {
            try {
                smallMobileMediaQuery.addListener(querySmallMobileChanged);
                mobileMediaQuery.addListener(queryMobileChanged);
                tabletMediaQuery.addListener(queryTabletChanged);
                desktopMediaQuery.addListener(queryDesktopChanged);
            } catch (err) {
                // Empty
            }
        }

        return () => {
            try {
                smallMobileMediaQuery.removeEventListener('change', querySmallMobileChanged);
                mobileMediaQuery.removeEventListener('change', queryMobileChanged);
                tabletMediaQuery.removeEventListener('change', queryTabletChanged);
                desktopMediaQuery.removeEventListener('change', queryDesktopChanged);
            } catch (error) {
                try {
                    smallMobileMediaQuery.removeListener(querySmallMobileChanged);
                    mobileMediaQuery.removeListener(queryMobileChanged);
                    tabletMediaQuery.removeListener(queryTabletChanged);
                    desktopMediaQuery.removeListener(queryDesktopChanged);
                } catch (err) {
                    // Empty
                }
            }
        };
    }, []);

    return { isTablet, isMobile, isSmallMobile, isDesktop };
}
