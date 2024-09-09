// https://usehooks-ts.com/react-hook/use-window-size
import { useEffect, useState } from 'react';

interface WindowSizeProps {
    width: number;
    height: number;
}

function useWindowSize(): WindowSizeProps {
    const [windowSize, setWindowSize] = useState<WindowSizeProps>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const handler = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Set size at the first client-side load
        handler();

        window.addEventListener('resize', handler);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

    return windowSize;
}

export default useWindowSize;
