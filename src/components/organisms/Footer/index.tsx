/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import icTruck from 'assets/icons/ic_truck.svg';
import icMenu from 'assets/icons/ic_menu.svg';
import icMap from 'assets/icons/ic_map.svg';
import icSystem from 'assets/icons/ic_system.svg';
import './index.scss';
import classNames from 'classnames';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CONSTANT_ROUTE, ROLES } from 'utils/constants';
import { useAppSelector } from 'store/hooks';
import { Button, Input, Modal } from 'antd';
import { openConfirm, showErrorToast } from 'utils/functions';
import iconsDenied from 'assets/icons/ic_denied.svg';
import { usePostSettingAuthMutation } from 'services/auth';
import { setPreviousPage } from 'services/page';
import { useDispatch } from 'react-redux';

interface IFooterItem {
    id?: string;
    src: string;
    label: string;
    link: string;
    svg?: ReactElement<any, any>;
    function?: any;
    isLimited?: boolean;
}

const Footer = (props) => {
    const userData = useAppSelector((state: any) => state.reducer?.user.user);
    const AuthMenu = userData.authorizedMenu;
    const { isSystemLimit } = userData;
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isShowModalEnterPassword, setIsShowModalEnterPassword] = useState(false);
    const [password, setPassword] = useState('');
    const footerItemsDefault: IFooterItem[] = [
        // {
        //     src: icTruck,
        //     svg: (
        //         <svg
        //             width='24'
        //             height='20'
        //             viewBox='0 0 24 20'
        //             className='w-full h-full object-cover'
        //             fill='none'
        //             xmlns='http://www.w3.org/2000/svg'
        //         >
        //             <path
        //                 d='M15.75 14V1H0.75V14H15.75ZM15.75 14H22.75V9L19.75 6H15.75V14ZM7.75 16.5C7.75 17.8807 6.63071 19 5.25 19C3.86929 19 2.75 17.8807 2.75 16.5C2.75 15.1193 3.86929 14 5.25 14C6.63071 14 7.75 15.1193 7.75 16.5ZM20.75 16.5C20.75 17.8807 19.6307 19 18.25 19C16.8693 19 15.75 17.8807 15.75 16.5C15.75 15.1193 16.8693 14 18.25 14C19.6307 14 20.75 15.1193 20.75 16.5Z'
        //                 stroke='var(--sub-color)'
        //                 strokeLinecap='round'
        //                 strokeLinejoin='round'
        //             />
        //         </svg>
        //     ),
        //     label: '車輌選択',
        //     link: `/${CONSTANT_ROUTE.SELECT_VEHICLE}`,
        //     function: () => onClickMenuSelectVehicle(),
        // },
        {
            src: icMenu,
            label: 'メニュー ',
            link: `/${CONSTANT_ROUTE.MAIN_MENU}`,
            function: () => onClickMainMenu(),
            svg: (
                <svg
                    width='20'
                    height='14'
                    viewBox='0 0 20 14'
                    className='w-full h-full object-cover'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M1.25 7H15.25M1.25 1H19.25M1.25 13H19.25'
                        stroke='var(--sub-color)'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            ),
        },
        // {
        //     id: ROLES.MOBILE008,
        //     src: icMap,
        //     label: '稼働状況 ',
        //     isLimited: true,
        //     link: `/${CONSTANT_ROUTE.OPERATION_STATUS}`,
        //     function: () => onClickMenuOperationStatus(),
        //     svg: (
        //         <svg
        //             width='20'
        //             height='24'
        //             viewBox='0 0 20 24'
        //             className='w-full h-full object-cover'
        //             fill='none'
        //             xmlns='http://www.w3.org/2000/svg'
        //         >
        //             <path
        //                 d='M18.75 10C18.75 17 9.75 23 9.75 23C9.75 23 0.75 17 0.75 10C0.75 7.61305 1.69821 5.32387 3.38604 3.63604C5.07387 1.94821 7.36305 1 9.75 1C12.1369 1 14.4261 1.94821 16.114 3.63604C17.8018 5.32387 18.75 7.61305 18.75 10Z'
        //                 stroke='var(--sub-color)'
        //                 strokeLinecap='round'
        //                 strokeLinejoin='round'
        //             />
        //             <path
        //                 d='M9.75 13C11.4069 13 12.75 11.6569 12.75 10C12.75 8.34315 11.4069 7 9.75 7C8.09315 7 6.75 8.34315 6.75 10C6.75 11.6569 8.09315 13 9.75 13Z'
        //                 stroke='var(--sub-color)'
        //                 strokeLinecap='round'
        //                 strokeLinejoin='round'
        //             />
        //         </svg>
        //     ),
        // },
        {
            src: icSystem,
            label: 'システム設定',
            link: `/${CONSTANT_ROUTE.SYSTEM_SETTING}`,
            function: () => onClickMenuSystemSetting(),
            svg: (
                <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    className='w-full h-full object-cover'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M12.25 15C13.9069 15 15.25 13.6569 15.25 12C15.25 10.3431 13.9069 9 12.25 9C10.5931 9 9.25 10.3431 9.25 12C9.25 13.6569 10.5931 15 12.25 15Z'
                        stroke='var(--sub-color)'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M19.65 15C19.5169 15.3016 19.4772 15.6362 19.536 15.9606C19.5948 16.285 19.7495 16.5843 19.98 16.82L20.04 16.88C20.226 17.0657 20.3735 17.2863 20.4741 17.5291C20.5748 17.7719 20.6266 18.0322 20.6266 18.295C20.6266 18.5578 20.5748 18.8181 20.4741 19.0609C20.3735 19.3037 20.226 19.5243 20.04 19.71C19.8543 19.896 19.6337 20.0435 19.3909 20.1441C19.1481 20.2448 18.8878 20.2966 18.625 20.2966C18.3622 20.2966 18.1019 20.2448 17.8591 20.1441C17.6163 20.0435 17.3957 19.896 17.21 19.71L17.15 19.65C16.9143 19.4195 16.615 19.2648 16.2906 19.206C15.9662 19.1472 15.6316 19.1869 15.33 19.32C15.0342 19.4468 14.782 19.6572 14.6043 19.9255C14.4266 20.1938 14.3313 20.5082 14.33 20.83V21C14.33 21.5304 14.1193 22.0391 13.7442 22.4142C13.3691 22.7893 12.8604 23 12.33 23C11.7996 23 11.2909 22.7893 10.9158 22.4142C10.5407 22.0391 10.33 21.5304 10.33 21V20.91C10.3223 20.579 10.2151 20.258 10.0225 19.9887C9.8299 19.7194 9.56074 19.5143 9.25 19.4C8.94838 19.2669 8.61381 19.2272 8.28941 19.286C7.96502 19.3448 7.66568 19.4995 7.43 19.73L7.37 19.79C7.18425 19.976 6.96368 20.1235 6.72088 20.2241C6.47808 20.3248 6.21783 20.3766 5.955 20.3766C5.69217 20.3766 5.43192 20.3248 5.18912 20.2241C4.94632 20.1235 4.72575 19.976 4.54 19.79C4.35405 19.6043 4.20653 19.3837 4.10588 19.1409C4.00523 18.8981 3.95343 18.6378 3.95343 18.375C3.95343 18.1122 4.00523 17.8519 4.10588 17.6091C4.20653 17.3663 4.35405 17.1457 4.54 16.96L4.6 16.9C4.83054 16.6643 4.98519 16.365 5.044 16.0406C5.10282 15.7162 5.06312 15.3816 4.93 15.08C4.80324 14.7842 4.59276 14.532 4.32447 14.3543C4.05618 14.1766 3.74179 14.0813 3.42 14.08H3.25C2.71957 14.08 2.21086 13.8693 1.83579 13.4942C1.46071 13.1191 1.25 12.6104 1.25 12.08C1.25 11.5496 1.46071 11.0409 1.83579 10.6658C2.21086 10.2907 2.71957 10.08 3.25 10.08H3.34C3.67099 10.0723 3.992 9.96512 4.2613 9.77251C4.53059 9.5799 4.73572 9.31074 4.85 9C4.98312 8.69838 5.02282 8.36381 4.964 8.03941C4.90519 7.71502 4.75054 7.41568 4.52 7.18L4.46 7.12C4.27405 6.93425 4.12653 6.71368 4.02588 6.47088C3.92523 6.22808 3.87343 5.96783 3.87343 5.705C3.87343 5.44217 3.92523 5.18192 4.02588 4.93912C4.12653 4.69632 4.27405 4.47575 4.46 4.29C4.64575 4.10405 4.86632 3.95653 5.10912 3.85588C5.35192 3.75523 5.61217 3.70343 5.875 3.70343C6.13783 3.70343 6.39808 3.75523 6.64088 3.85588C6.88368 3.95653 7.10425 4.10405 7.29 4.29L7.35 4.35C7.58568 4.58054 7.88502 4.73519 8.20941 4.794C8.53381 4.85282 8.86838 4.81312 9.17 4.68H9.25C9.54577 4.55324 9.79802 4.34276 9.97569 4.07447C10.1534 3.80618 10.2487 3.49179 10.25 3.17V3C10.25 2.46957 10.4607 1.96086 10.8358 1.58579C11.2109 1.21071 11.7196 1 12.25 1C12.7804 1 13.2891 1.21071 13.6642 1.58579C14.0393 1.96086 14.25 2.46957 14.25 3V3.09C14.2513 3.41179 14.3466 3.72618 14.5243 3.99447C14.702 4.26276 14.9542 4.47324 15.25 4.6C15.5516 4.73312 15.8862 4.77282 16.2106 4.714C16.535 4.65519 16.8343 4.50054 17.07 4.27L17.13 4.21C17.3157 4.02405 17.5363 3.87653 17.7791 3.77588C18.0219 3.67523 18.2822 3.62343 18.545 3.62343C18.8078 3.62343 19.0681 3.67523 19.3109 3.77588C19.5537 3.87653 19.7743 4.02405 19.96 4.21C20.146 4.39575 20.2935 4.61632 20.3941 4.85912C20.4948 5.10192 20.5466 5.36217 20.5466 5.625C20.5466 5.88783 20.4948 6.14808 20.3941 6.39088C20.2935 6.63368 20.146 6.85425 19.96 7.04L19.9 7.1C19.6695 7.33568 19.5148 7.63502 19.456 7.95941C19.3972 8.28381 19.4369 8.61838 19.57 8.92V9C19.6968 9.29577 19.9072 9.54802 20.1755 9.72569C20.4438 9.90337 20.7582 9.99872 21.08 10H21.25C21.7804 10 22.2891 10.2107 22.6642 10.5858C23.0393 10.9609 23.25 11.4696 23.25 12C23.25 12.5304 23.0393 13.0391 22.6642 13.4142C22.2891 13.7893 21.7804 14 21.25 14H21.16C20.8382 14.0013 20.5238 14.0966 20.2555 14.2743C19.9872 14.452 19.7768 14.7042 19.65 15Z'
                        stroke='var(--sub-color)'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            ),
        },
    ];

    const [postSettingData, responseSettingData] = usePostSettingAuthMutation();
    const onClickMenuSystemSetting = () => {
        openConfirm({
            content: (
                <div className='flex justify-center text-center items-center text-md font-bold w-full'>
                    <div>
                        システム設定画面に移動しますが
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),

            onOk: () => {
                if (AuthMenu.includes('MOBILE011')) {
                    dispatch(
                        setPreviousPage({
                            previousUrl: location.pathname + location.search,
                            previousUrlOfPage: CONSTANT_ROUTE.SYSTEM_SETTING,
                        }),
                    );
                    navigate(`/${CONSTANT_ROUTE.SYSTEM_SETTING}`);
                } else {
                    setIsShowModalEnterPassword(true);
                }
            },
        });
    };

    const onClickMenuOperationStatus = () => {
        openConfirm({
            content: (
                <div className='flex justify-center text-center items-center text-md font-bold w-full'>
                    <div>
                        稼働状況画面に移動しますが
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),

            onOk: () => {
                dispatch(
                    setPreviousPage({
                        previousUrl: location.pathname + location.search,
                        previousUrlOfPage: CONSTANT_ROUTE.OPERATION_STATUS,
                    }),
                );
                navigate(`/${CONSTANT_ROUTE.OPERATION_STATUS}`);
            },
        });
    };

    const onClickMainMenu = () => {
        openConfirm({
            content: (
                <div className='flex justify-center text-center items-center text-md font-bold w-full'>
                    <div>
                        メニュー画面に移動しますが
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),

            onOk: () => {
                navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
            },
        });
    };

    const onClickMenuSelectVehicle = () => {
        openConfirm({
            content: (
                <div className='flex justify-center text-center items-center text-md font-bold w-full'>
                    <div>
                        車輛選択画面に戻ります。
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),

            onOk: () => {
                navigate(`/${CONSTANT_ROUTE.SELECT_VEHICLE}`);
            },
        });
    };

    const footerItems = useMemo(
        () =>
            footerItemsDefault.filter((item) => {
                if (item.id) {
                    return AuthMenu.includes(item.id);
                }
                if (item.isLimited) {
                    if (isSystemLimit === false) {
                        return true;
                    }
                    return false;
                }
                return true;
            }),
        [AuthMenu],
    );

    const handleSubmitPassWord = async () => {
        const response = await postSettingData({
            param: JSON.stringify(password),
        }).unwrap();
        if (response) {
            navigate(`/${CONSTANT_ROUTE.SYSTEM_SETTING}`);
        } else {
            showErrorToast('パスワードが間違っています。');
        }
        setPassword('');
    };

    return (
        <div>
            <div className='footer flex fixed bottom-0 w-full z-20 bg-[var(--background-footer)]'>
                {footerItems.length > 0 &&
                    footerItems.map((item) => {
                        const { label, link, src, svg } = item;
                        return (
                            <button
                                type='button'
                                onClick={() => item.function()}
                                className={`footer_item w-full flex flex-col items-center justify-center text-ssm no-underline border-b-2 border-t-2 mb-0 p-2 ${
                                    location.pathname === link
                                        ? 'bg-white text-[var(--background-footer)] hover:text-[var(--background-footer)] border-t-red2a border-b-white [&_path]:stroke-[var(--background-footer)]'
                                        : 'text-white hover:text-white bg-[var(--background-footer)] border-t-[var(--background-footer)] border-b-[var(--background-footer)] [&_path]:stroke-grayE9'
                                }`}
                                key={`${item?.src}`}
                            >
                                <div className='w-6 h-6'>{svg}</div>
                                <p className='text-[12px] mb-0'>{label}</p>
                            </button>
                        );
                    })}
            </div>
            {/* TODO: rename isShowModalTruck => is show modal confirm return page select vehicle ? */}
            {/* TODO: use openConfirm function instead */}
            {isShowModalEnterPassword && (
                <Modal
                    title={null}
                    open={isShowModalEnterPassword}
                    closable={false}
                    footer={[
                        <div className='flex justify-center items-center mt-3' key='button'>
                            <button
                                type='button'
                                className='bg-green1A text-white rounded-xl py-1 px-2 mr-5 w-[128px] h-[49px] text-sm'
                                onClick={handleSubmitPassWord}
                            >
                                はい
                            </button>
                            <button
                                type='button'
                                className='text-green1A border border-green1A rounded-xl py-1 px-2 w-[128px] h-[49px] text-sm'
                                onClick={() => setIsShowModalEnterPassword(false)}
                            >
                                キャンセル
                            </button>
                        </div>,
                    ]}
                >
                    <div className='flex flex-col justify-center items-center p-2'>
                        <div>
                            <p>システム設定画面の起動用パスワードを入力して下さい。</p>
                            <Input
                                name='passwordSetting'
                                className='mt-3'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
export default Footer;
