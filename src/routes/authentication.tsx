/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { saveSystemSettingToStore, useLazyGetSystemSettingQuery } from 'services/systemSetting';
import { useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE, STATUS_CODE } from 'utils/constants';

export const ProtectedRoutes = (props: any) => {
    const { isLoggedIn } = useAppSelector((state) => state.reducer.user);
    const [getSystemSetting, responseGetSystemSetting] = useLazyGetSystemSettingQuery();
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);
    const dispatch = useDispatch();

    useEffect(() => {
        handleGetSystemSetting();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGetSystemSetting = async () => {
        const responseData = await getSystemSetting({}).unwrap();
        dispatch(saveSystemSettingToStore(responseData));
    };

    if (!isLoggedIn) {
        return <Navigate to='/login' />;
    }

    if (!systemSetting || responseGetSystemSetting?.status !== STATUS_CODE.fulfilled) {
        return <></>;
    }
    return <Outlet />;
};

export const PublicRoutes = (props: any) => {
    const { isLoggedIn } = useAppSelector((state) => state.reducer.user);
    return isLoggedIn ? <Navigate to={`/${CONSTANT_ROUTE.MAIN_MENU}`} /> : <Outlet />;
};
