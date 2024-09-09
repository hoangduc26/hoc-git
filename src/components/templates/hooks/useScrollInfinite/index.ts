import { useEffect, useState } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

const useScrollInfinite = (handleLoadMore?: () => void) => {
    const [node, setNode] = useState<Element | null>(null);
    const entry = useIntersectionObserver(node, {});
    const isVisible = entry?.isIntersecting;

    useEffect(() => {
        if (isVisible && handleLoadMore) {
            handleLoadMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    return { setNode };
};

export default useScrollInfinite;
