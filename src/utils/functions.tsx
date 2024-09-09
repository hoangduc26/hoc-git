/* eslint-disable react/no-danger */
// *NOTE: mapModifiers('test', abc) => 'test test-abc'
import { Button, Modal, ModalFuncProps } from 'antd';
import { toast } from 'react-toastify';
import { MessageInstance, NoticeType } from 'antd/es/message/interface';
import React from 'react';
import { DEFAULT_COLOR } from './constants';

export function applyColorSystem(color) {
    try {
        if (color && color === DEFAULT_COLOR.GREEN) {
            (document.querySelector(':root') as any).style.setProperty('--main-color', '#22701A');
            (document.querySelector(':root') as any).style.setProperty('--sub-color', '#74a315');
            (document.querySelector(':root') as any).style.setProperty(
                '--sub-color-light',
                '#A7C860',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--sub-color-lighter',
                '#c6ebc2',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--main-color-light',
                '#3d8436',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--main-color-lighter',
                '#8fc28a',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--sub-color-lightest',
                '#EBF2DC',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--main-color-lightest',
                '#EAF9C5',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--background-button-login',
                '#22701A',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--background-footer',
                '#74a315',
            );
        } else {
            (document.querySelector(':root') as any).style.setProperty('--main-color', '#000000');
            (document.querySelector(':root') as any).style.setProperty('--sub-color', '#7f7f7f');
            (document.querySelector(':root') as any).style.setProperty(
                '--sub-color-light',
                '#9082EC',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--sub-color-lighter',
                '#E4DFFD',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--main-color-light',
                '#5569A2',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--main-color-lighter',
                '#C1D1F4',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--sub-color-lightest',
                '#E4DFFD',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--main-color-lightest',
                '#CFC5F9',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--background-button-login',
                '#4c4089',
            );
            (document.querySelector(':root') as any).style.setProperty(
                '--background-footer',
                '#4c4089',
            );
        }
        // eslint-disable-next-line no-empty
    } catch (error) {}
}

export function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = (R * (100 + percent)) / 100;
    G = (G * (100 + percent)) / 100;
    B = (B * (100 + percent)) / 100;

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);

    const RR = R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
    const GG = G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
    const BB = B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);

    return `#${RR + GG + BB}`;
}

export function compareString(string: string, keyword: string) {
    return string?.toLowerCase().trim().includes(keyword?.toLowerCase().trim());
}

export default undefined;

export const openConfirm = (props: ModalFuncProps) => {
    // eslint-disable-next-line react/react-in-jsx-scope
    const modal = Modal.confirm({
        ...props,
        closable: false,
        maskClosable: false,
    });
    const content = <div className=''>{props.content}</div>;
    const footer = (
        <div className='flex justify-center items-center mt-5'>
            <div className='pr-2 w-1/2'>
                <Button
                    htmlType='button'
                    onClick={() => {
                        if (props.onCancel) {
                            props.onCancel();
                        }
                        modal.destroy();
                    }}
                    className='h-btn-default text-center rounded-md text-black52 border-black52 bg-white w-full shadow-sm text-sm'
                >
                    いいえ
                </Button>
            </div>
            <div className='pl-2 w-1/2'>
                <Button
                    htmlType='button'
                    onClick={() => {
                        if (props.onOk) {
                            props.onOk();
                        }
                        modal.destroy();
                    }}
                    className='h-btn-default text-center rounded-md text-white border-green1A bg-green1A w-full shadow-sm text-sm'
                >
                    はい
                </Button>
            </div>
        </div>
    );

    modal.update({
        content,
        footer,
    });
};

export const openInformation = (props: ModalFuncProps) => {
    // eslint-disable-next-line react/react-in-jsx-scope
    const modal = Modal.confirm({
        ...props,
        closable: false,
        maskClosable: false,
    });
    const content = <div className=''>{props.content}</div>;
    const footer = (
        <div className='flex justify-center items-center mt-5'>
            <div className='pl-2 w-1/2'>
                <Button
                    htmlType='button'
                    onClick={() => {
                        if (props.onOk) {
                            props.onOk();
                        }
                        modal.destroy();
                    }}
                    className='h-btn-default text-center rounded text-white border-green1A bg-green1A w-full shadow-sm text-sm'
                >
                    はい
                </Button>
            </div>
        </div>
    );

    modal.update({
        content,
        footer,
    });
};

export function onFetchError(message: string, statusCode: number) {
    switch (statusCode) {
        case 409:
            showErrorToast(message);
            break;

        default:
            break;
    }
}

export function showErrorToast(message: string) {
    toast.error(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        className: 'custom-toast',
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
}

export function scrollTopInfiniteScrollComponent() {
    try {
        const arrElement =
            Array.from(document.querySelectorAll('.infinite-scroll-component')) || [];
        arrElement.forEach((e) => e.scrollTo(0, 0));
    } catch (error) {
        // do something
    }
}

export function vhToPixels(vh) {
    const windowHeight = window.innerHeight;
    return (vh * windowHeight) / 100;
}
