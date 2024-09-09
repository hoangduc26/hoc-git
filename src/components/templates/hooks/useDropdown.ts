import { useCallback, useEffect, useRef, useState } from 'react';

const useDropdown = (heightDefault = '0px', opacityDefault = '0') => {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    const handleToggle = useCallback(() => {
        if (!loading) {
            setActive(!active);
        }
    }, [loading, active]);

    useEffect(() => {
        const elPanelWrapper = wrapRef.current;
        const elPanel = bodyRef.current;
        if (elPanelWrapper) {
            if (active) {
                if (elPanel) {
                    elPanelWrapper.style.maxHeight = `${elPanel.offsetHeight}px`;
                    elPanelWrapper.style.opacity = '1';
                    setLoading(true);
                }
                setTimeout(() => {
                    elPanelWrapper.style.maxHeight = 'unset';
                    setLoading(false);
                }, 240);
            } else {
                if (elPanel) {
                    elPanelWrapper.style.maxHeight = `${elPanelWrapper.offsetHeight}px`;
                    setLoading(true);
                }
                setTimeout(() => {
                    elPanelWrapper.style.maxHeight = heightDefault;
                    elPanelWrapper.style.opacity = opacityDefault;
                    setLoading(false);
                }, 10);
            }
        }
    }, [active, heightDefault, opacityDefault]);

    return { active, wrapRef, bodyRef, handleToggle };
};

export default useDropdown;
