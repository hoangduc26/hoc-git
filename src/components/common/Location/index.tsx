/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
import { IParamsRequestPostLocation } from 'models/location';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostLocationMutation } from 'services/location';
import { useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE, ROLES } from 'utils/constants';

const pageNotGetLocation = [CONSTANT_ROUTE.LOGIN];
const Location = () => {
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);
    const vehicle = useAppSelector((state) => state.reducer.vehicle.selectedVehicle);
    const user = useAppSelector((state) => state.reducer.user);
    const [postLocation] = usePostLocationMutation();
    const location = useLocation();
    const intervalId = useRef<NodeJS.Timeout | null>();
    const AuthMenu = user.user?.authorizedMenu;

    useEffect(() => {
        if (location.pathname.includes(CONSTANT_ROUTE.LOGIN)) {
            handleClearInterval();
        }
        if (
            !location.pathname.includes(CONSTANT_ROUTE.LOGIN) &&
            vehicle &&
            user &&
            user.user?.isSystemLimit === false &&
            AuthMenu.includes(ROLES.MOBILE008) &&
            intervalId.current === undefined
        ) {
            const millisecond = systemSetting?.location?.intervalAutoUpdate * 1000;
            if (millisecond) {
                intervalId.current = setInterval(() => {
                    getLocaltion();
                }, millisecond);
            }
        }

        return (): void => {
            handleClearInterval();
        };
    }, [systemSetting, user, vehicle, location]);

    useEffect(() => {
        if (user.isLoggedIn) {
            getLocaltion();
        }
    }, [user.isLoggedIn, vehicle]);

    const getLocaltion = () => {
        navigator.geolocation.getCurrentPosition(
            (res) => {
                if (res.coords) {
                    const latlng = {
                        latitude: res.coords.latitude,
                        longitude: res.coords.longitude,
                    };
                    sendLocation(latlng);
                }
            },
            (err) => {},
        );
    };

    const sendLocation = (latlng: { latitude: any; longitude: any }) => {
        if (vehicle && user) {
            const params: IParamsRequestPostLocation = {
                vehicleTypeCd: vehicle.vehicleTypeCd,
                vehicleCd: vehicle.vehicleCd,
                carrierCd: vehicle.companyCd,
                driverCd: user.user.employeeCd,
                latitude: latlng.latitude.toString(),
                longitude: latlng.longitude.toString(),
            };
            postLocation(params);
        }
    };

    const handleClearInterval = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = undefined;
        }
    };
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
};

export default Location;
