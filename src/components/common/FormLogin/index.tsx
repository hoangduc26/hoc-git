/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import backgroundLoginGreen from 'assets/img/backgroundLoginGreen.png';
import backgroundLoginPurple from 'assets/img/backgroundLoginPurple.png';
import logoPurple from 'assets/img/logo_purple.png';
import classNames from 'classnames';
import Container from 'components/organisms/container';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn, usePostLoginMutation } from 'services/auth';
import { CONSTANT_ROUTE, DEFAULT_COLOR } from 'utils/constants';
import { showErrorToast } from 'utils/functions';
import * as yup from 'yup';
import './index.scss';
import { LogoLogin } from 'components/icons/LogoLogin';
import { useAppSelector } from 'store/hooks';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';

interface FormLoginProps {}

const FormLogin: React.FC<FormLoginProps> = () => {
    const [remember, setRemember] = useState(false);
    const [isErrCredentials, setErrCredentials] = useState(false);
    const systemSetting =
        useAppSelector((state) => state.reducer.systemSetting?.systemSetting) ||
        DEFAULT_SYSTEM_SETTING;
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                username: yup.string().required('ユーザー名を空白のままにすることはできません'),
                password: yup.string().required('パスワードを空白にすることはできません'),
            }),
        ),
    });
    const [postLogin, responseLogin] = usePostLoginMutation();

    useEffect(() => {
        if (errors?.password || errors?.username) {
            setErrCredentials(false);
        }
    }, [errors?.password, errors?.username]);

    const onSubmit = async (data: any) => {
        const response = await postLogin({
            username: data.username,
            password: data.password,
            rememberLogin: remember,
        }).unwrap();
        if (response) {
            if (response.isAuthenticated) {
                dispatch(logIn(response));
                navigate(CONSTANT_ROUTE.MAIN_MENU);
            } else if (response.message === 'Incorrect credentials') {
                setErrCredentials(true);
            }
        } else {
            showErrorToast('Login failed, please try again!');
        }
    };

    const handleCheck = () => setRemember(!remember);

    return (
        <div>
            <div className='login-page flex flex-col'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='login-banner relative'>
                        <div className='flex'>
                            <img
                                className='w-full sm:max-h-[300px] md:max-h-[500px] max-h-[500px] object-fill relative'
                                src={
                                    systemSetting?.defaultColor === DEFAULT_COLOR.GREEN
                                        ? backgroundLoginGreen
                                        : backgroundLoginPurple
                                }
                                alt='login-banner'
                            />

                            {systemSetting?.defaultColor === DEFAULT_COLOR.GREEN ? (
                                <LogoLogin className='min-w-full py-[40px] object-contain h-[200px] image-login absolute md:top-[100px] md:py-0' />
                            ) : (
                                <img
                                    className='min-w-full py-[50px] object-contain h-[185px] image-login absolute md:top-[100px] md:py-0'
                                    src={logoPurple}
                                    alt='logo'
                                />
                            )}
                        </div>
                    </div>
                    <div className='login-form pt-5'>
                        <Container variant='large'>
                            <div className='input-login-form mb-6'>
                                <h2 className='font-semibold mb-3 text-green1A text-md'>
                                    ユーザID
                                </h2>
                                <input
                                    className={classNames(
                                        isErrCredentials
                                            ? 'outline-none p-3 font-md w-full border-[1px] border-[#BD472A] rounded  bg-[white]'
                                            : 'outline-none p-3 font-md w-full border-[1px] rounded  bg-[white]',
                                        errors?.username || isErrCredentials
                                            ? 'border-red2a'
                                            : 'border-[#D4D4D4]',
                                    )}
                                    type='text'
                                    {...register('username')}
                                />
                                {errors?.username?.message && (
                                    <p className='mt-3 text-red2a py-1 px-3 bg-[#FCDCD6] text-[14px] font-inter rounded border-[1px] border-red2a border-solid'>
                                        {(errors?.username?.message ?? '').toString()}
                                    </p>
                                )}
                            </div>
                            <div className='input-login-form mb-6'>
                                <h2 className=' font-semibold mb-3 text-green1A text-md'>
                                    パスワード
                                </h2>
                                <input
                                    className={classNames(
                                        isErrCredentials
                                            ? 'input-password outline-none p-4 font-md w-full border-[1px] border-[#BD472A] rounded  bg-[white] input-style'
                                            : 'input-password outline-none p-4 font-md w-full border-[1px] rounded  bg-[white]',
                                        errors?.password || isErrCredentials
                                            ? 'border-red2a'
                                            : 'border-[#D4D4D4]',
                                    )}
                                    type='password'
                                    name='password'
                                    {...register('password')}
                                />
                                {errors?.password && (
                                    <p className='mt-3 text-red2a py-1 px-3 bg-[#FCDCD6] text-[14px] font-inter rounded border-[1px] border-red2a border-solid'>
                                        {(errors?.password?.message ?? '').toString()}
                                    </p>
                                )}

                                {isErrCredentials && (
                                    <p className='mt-3 text-red2a py-1 px-3 bg-[#FCDCD6] text-[14px] font-inter rounded border-[1px] border-red2a border-solid'>
                                        ユーザー名もしくはパスワードが無効です
                                    </p>
                                )}
                            </div>
                            <div className='flex gap-x-4 items-center mb-9 align-center'>
                                <div
                                    className={classNames(
                                        'cursor-pointer relative border-[1px] w-[28px] h-[28px] border-solid rounded-md',
                                        remember
                                            ? 'border-green15 bg-[var(--sub-color-lighter)] before:absolute before:bg-transparent before:w-[13px] before:h-[8px] before:border-[2px] before:border-t-0 before:border-r-0 before:border-solid before:border-green15 before:rounded-sm before:translate-x-[-50%] before:transform before:top-[30%] before:left-[50%] before:rotate-[-45deg]'
                                            : 'border-[#D0D5DD] bg-[white]',
                                    )}
                                    role='button'
                                    onClick={handleCheck}
                                />
                                <div>
                                    <p
                                        onClick={handleCheck}
                                        className='text-[#686868] text-[18px] font-inter mb-0'
                                    >
                                        ログインの情報を保持する
                                    </p>
                                </div>
                            </div>

                            <Button
                                htmlType='submit'
                                className='rounded-xl bg-[var(--background-button-login)] hover:bg-green1A hover:!border-green1A text-[18px]  h-full  w-full py-[12px] font-sm text-[white] hover:!text-[white] font-medium flex items-center justify-center gap-2'
                                loading={responseLogin.isLoading}
                            >
                                ログイン
                            </Button>
                        </Container>
                    </div>
                </form>
                <p className='text-[#A8A8A8] py-2 mt-auto text-center'>Version: 1.5</p>
            </div>
        </div>
    );
};
export default FormLogin;
