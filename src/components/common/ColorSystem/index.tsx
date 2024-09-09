/* eslint-disable */
import { useEffect } from 'react';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';
import { useAppSelector } from 'store/hooks';
import { applyColorSystem, shadeColor } from 'utils/functions';

export const ColorSystem = () => {
    // TODO: sửa lại, không lưu colorDefault ở db, lưu ở localStorage.
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting) || DEFAULT_SYSTEM_SETTING;
    useEffect(() => {
        // SET CUSTOM COLOR =============================
        // try {
        //     if (systemSetting?.color) {
        //         (document.querySelector(':root') as any).style.setProperty(
        //             '--main-color',
        //             systemSetting?.color.mainColor,
        //         );
        //         (document.querySelector(':root') as any).style.setProperty(
        //             '--sub-color',
        //             systemSetting?.color.subColor,
        //         );
        //         (document.querySelector(':root') as any).style.setProperty(
        //             '--sub-color-light',
        //             shadeColor(systemSetting?.color.subColor, 30),
        //         );
        //         (document.querySelector(':root') as any).style.setProperty(
        //             '--sub-color-lighter',
        //             shadeColor(systemSetting?.color.subColor, 75),
        //         );
        //     }
        // } catch (error) {
        //     // Do something
        // }
        // SET DEFAULT COLOR ============================
        applyColorSystem(systemSetting?.defaultColor);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};
