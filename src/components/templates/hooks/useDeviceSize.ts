import { useEffect, useState } from 'react';

const useDeviceSize = () => {
    const [width, setWidth] = useState(0);

    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);

        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    const [smallMobile, mobile, tablet, laptop, desktop] = [0, 1, 2, 3, 4];

    if (width < 360) {
        return smallMobile;
    }
    if (width >= 360 && width < 480) {
        return mobile;
    }
    if (width >= 481 && width < 1024) {
        return tablet;
    }
    if (width >= 1024 && width < 1280) {
        return laptop;
    }

    return desktop;
};

export default useDeviceSize;
