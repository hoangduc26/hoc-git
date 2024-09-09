/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from 'services/auth';
import { CONSTANT_ROUTE } from 'utils/constants';

export default function PopUpConfirmLogin() {
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const userToken = useSelector((state: any) => state.reducer?.user?.tokenStatus);
    const dispatch = useDispatch();
    useEffect(() => {
        if (userToken === false) {
            setIsShowConfirm(true);
        }
    }, [userToken]);

    return (
        <div>
            {isShowConfirm && (
                <Modal
                    title='一定時間操作が行われなかったため、再度ログインをお願い致します。'
                    open={isShowConfirm}
                    closable={false}
                    className='pt-[160px]'
                    footer={[
                        <div className='flex justify-center items-center mt-4' key='button'>
                            <button
                                type='button'
                                onClick={() => {
                                    dispatch(logOut());
                                }}
                                className='bg-green1A text-white rounded-xl py-1 px-2 mr-5 w-[128px] h-[49px] text-sm'
                            >
                                はい
                            </button>
                        </div>,
                    ]}
                />
            )}
        </div>
    );
}
