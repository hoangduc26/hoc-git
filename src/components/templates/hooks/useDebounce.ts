import { useRef, useEffect } from 'react';

const useDebounce = (callback: () => void, timeout: number, deps: Array<string>): void => {
    const timeoutId = useRef<NodeJS.Timeout | null>();
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }

            timeoutId.current = setTimeout(callback, timeout);
        }

        return (): void => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
export default useDebounce;
