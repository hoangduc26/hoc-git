/* eslint-disable jsx-a11y/no-redundant-roles */
import React from 'react';
import Container from 'components/organisms/container';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import { useAppSelector } from 'store/hooks';
import dayjs from 'dayjs';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from 'services/auth';
import { Button } from 'antd';
import NotiSvg from 'components/icons/NotiSvg';
import { LogoutSvg } from 'components/icons/LogoutSvg';
import { BackIcon } from 'components/icons/BackIcon';
import { LogoHeader } from 'components/icons/LogoHeader';
import { DownloadIcon } from 'components/icons/DownloadIcon';
import { DEFAULT_COLOR } from 'utils/constants';
import logoPurple from 'assets/img/logo_purple.png';

interface HeaderProps {
    title: string;
    isShowDate?: boolean;
    isShowNotification?: boolean;
    isShowRollback?: boolean;
    onClickRollback?: () => void;
    isShowLogout?: boolean;
    isHiddenPageHeader?: boolean;
    isShowDownload?: boolean;
    onClickDownload?: () => void;
    fixedHeader?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    title,
    isShowDate,
    isShowNotification,
    isShowRollback,
    onClickRollback,
    isShowLogout,
    isHiddenPageHeader,
    isShowDownload,
    onClickDownload,
    fixedHeader,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const workingDate = useAppSelector((state) => state.reducer.workingDate.workingDate);
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);
    const [searchParams, setSearchParams] = useSearchParams();
    // eslint-disable-next-line eqeqeq
    const isViewOnly = searchParams.get('viewOnly') == 'true';
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logOut());
    };

    const navigateToMain = () => {
        if (location.pathname !== '/select-vehicle') {
            navigate('/main-menu');
        }
    };

    return (
        <div className='header bg-white'>
            <div className={`header_nav ${fixedHeader ? 'fixed top-0 z-10 w-full bg-white' : ''}`}>
                <Container>
                    <div className='flex justify-between align-center py-2 pointer'>
                        {systemSetting?.defaultColor === DEFAULT_COLOR.GREEN ? (
                            <h1 onClick={navigateToMain} className='w-[86px] h-[50px]'>
                              <LogoHeader className='w-full h-full object-cover' />
                            </h1>
                        ) : (
                            <h1 onClick={navigateToMain}>
                                <img
                                    className=' h-[50px] object-cover'
                                    src={logoPurple}
                                    alt='logo'
                                />
                            </h1>
                        )}

                        <div className='flex items-center gap-x-5'>
                            {isShowRollback && (
                                <button
                                    className='header_rollback pointer'
                                    role='button'
                                    type='button'
                                    onClick={onClickRollback}
                                >
                                    <BackIcon />
                                </button>
                            )}
                            {isShowNotification && (
                                <button
                                    className='header_rollback pointer'
                                    role='button'
                                    type='button'
                                >
                                    <NotiSvg />
                                </button>
                            )}
                            {isShowLogout && (
                                <button
                                    className='header_rollback pointer'
                                    role='button'
                                    type='button'
                                    onClick={() => handleLogout()}
                                >
                                    <LogoutSvg />
                                </button>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
            <div
                className={`header_noti bg-green1A py-2   ${
                    fixedHeader ? 'fixed top-[66px] w-full z-10' : ''
                } ${isHiddenPageHeader ? 'hidden' : ''}`}
            >
                <Container classnames='flex justify-between items-center'>
                    <p className='w-fit  text-[white] mb-0 text-md font-semibold font-inter'>
                        {title}
                    </p>
                    {isShowDate && (
                        <div className={`flex items-center `}>
                            <p className='w-fit text-[#D4D4D4] mb-0 text-[18px] font-medium font-zenMaru'>
                                {dayjs(
                                    new Date(
                                        new Date(
                                            isViewOnly && searchParams.get('workingDate')
                                                ? searchParams.get('workingDate')
                                                : workingDate,
                                        ),
                                    ),
                                ).format('YYYY/MM/DD')}
                            </p>
                            <div className='w-[24px] h-[24px] ml-3'>
                                <img
                                    src={iconCalendar}
                                    className='w-full h-full object-cover'
                                    alt='calendar-date'
                                />
                            </div>
                        </div>
                    )}
                    {isShowDownload ? (
                        <Button
                            onClick={onClickDownload}
                            className='flex bg-white items-center rounded text-sm gap-2 p-1 hover:bg-grayD4'
                        >
                            <p>ダウンロード</p>
                            <DownloadIcon className='h-[26px]' />
                        </Button>
                    ) : (
                        ''
                    )}
                </Container>
            </div>
        </div>
    );
};

export default Header;
