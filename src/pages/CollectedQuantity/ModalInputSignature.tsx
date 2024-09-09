/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/react-in-jsx-scope */
import { Button, Modal } from 'antd';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import SignatureCanvas from 'react-signature-canvas';

export interface ISelectValueModal {
    open: boolean;
    setOpen(value: boolean): void;
    handleSelectSignature(item: any): void;
}
const ModalInputSignature = React.forwardRef(
    ({ open, setOpen, handleSelectSignature }: ISelectValueModal, ref) => {
        const sigCanvas = useRef<any>();

        useEffect(() => {
            if (!open) {
                sigCanvas?.current?.clear();
            }
        }, [open]);

        useImperativeHandle(ref, () => ({
            setSignature,
        }));
        const witdhSignature = window.innerWidth > 390 ? 390 : window.innerWidth - 25;
        const setSignature = (base64) => {
            setTimeout(() => {
                sigCanvas?.current?.fromDataURL(base64, {
                    width: witdhSignature,
                    height: 300,
                });
            }, 0);
        };

        const create = () => {
            const url = sigCanvas?.current?.getCanvas()?.toDataURL('image/png');
            if (sigCanvas?.current?.isEmpty()) {
                handleSelectSignature({
                    url: '',
                    file: null,
                    blob: null,
                });
            } else {
                const canvas = sigCanvas?.current?.getCanvas();
                canvas.toBlob((blob) => {
                    const fd = new window.FormData();
                    fd.append('signature', blob, 'signature.png');
                    handleSelectSignature({
                        url,
                        file: fd.get('signature'),
                        blob,
                    });
                });
            }
        };

        return (
            <Modal
                className='main-menu__modal  font-inter'
                title={false}
                open={open}
                footer={false}
            >
                <div
                    className='fixed top-0 left-0 right-0 bottom-0 bg-overlay z-40'
                    onClick={() => setOpen(false)}
                />
                <div className='fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-2xl border w-auto border-gray-600 w-full'>
                    <div className='px-2'>
                        <h2 className='m-0 text-md text-green-darker text-center pt-3 md:pt-5 font-bold whitespace-nowrap'>
                            枠内に署名をお願いいたします
                        </h2>
                    </div>
                    <div className='p-3 md:p-5'>
                        <SignatureCanvas
                            penColor='black'
                            velocityFilterWeight={0}
                            canvasProps={{
                                className: 'm-auto border border-black',
                                width: witdhSignature,
                                height: 300,
                            }}
                            clearOnResize={false}
                            ref={sigCanvas}
                        />
                    </div>
                    <div className='flex justify-center items-center p-3 pt-0'>
                        <div className='pr-2 w-1/2'>
                            <Button
                                htmlType='button'
                                onClick={() => {
                                    sigCanvas?.current?.clear();
                                }}
                                className='h-btn-default text-center rounded text-black52 border-black52 bg-white w-full shadow-sm text-sm'
                            >
                                書き直し
                            </Button>
                        </div>
                        <div className='pl-2 w-1/2'>
                            <Button
                                htmlType='button'
                                onClick={create}
                                className='h-btn-default text-center rounded text-white border-green1A bg-green1A w-full shadow-sm text-sm'
                            >
                                確定
                            </Button>
                        </div>
                    </div>
                    <div className='p-3 pt-0'>
                        <Button
                            htmlType='button'
                            onClick={() => setOpen(false)}
                            className='h-btn-default text-center rounded text-black52 border-black52 bg-white w-full shadow-sm text-sm'
                        >
                            戻る
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    },
);
export default ModalInputSignature;
