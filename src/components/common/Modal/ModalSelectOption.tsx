import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import iconCloseModal from 'assets/icons/ic_close.svg';

const ModalSelectOption = (props: {
    title: string;
    open: boolean;
    setOpen: any;
    handleSelect: any;
    dropdown: { label: string; value: any }[];
    defaultValue?: any;
    hideEmptyLabel?: boolean;
}) => {
    const {
        open,
        setOpen,
        handleSelect,
        title,
        dropdown,
        defaultValue,
        hideEmptyLabel = true,
    } = props;
    const [valueSelected, setValueSelected] = useState(-1);

    useEffect(() => {
        setValueSelected(defaultValue);
    }, [defaultValue]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectOption = (value) => {
        setValueSelected(value);
    };

    const submit = () => {
        if (valueSelected !== -1) {
            handleSelect(valueSelected);
        }
        handleClose();
    };

    return (
        <Modal className='custom-antd-modal-select-bottom' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-3'>{title}</h2>
                </div>
                <button type='button' onClick={() => handleClose()}>
                    <img src={iconCloseModal} className='w-full h-full object-cover' alt='info' />
                </button>
            </div>
            <div className='px-4 pt-5 max-h-[calc(100vh_-_180px)] overflow-auto'>
                {dropdown
                    .filter((e) => e.label)
                    .map((e) => (
                        <div
                            key={e.value}
                            onClick={() => handleSelectOption(e.value)}
                            role='button'
                        >
                            <div
                                className={`rounded border-2  py-3 text-center  text-md mb-4 shadow-sm  ${
                                    valueSelected === e.value
                                        ? 'text-green1A border-green15 bg-green3C'
                                        : 'text-black3C border-green15 bg-white'
                                }`}
                            >
                                {e.label}
                            </div>
                        </div>
                    ))}
            </div>
            <div className='px-4 py-6'>
                <div className='flex'>
                    <div className='pr-2 w-1/2'>
                        <Button
                            htmlType='button'
                            onClick={() => handleClose()}
                            className='h-btn-default text-center rounded text-black52 border-black52 bg-white w-full shadow-sm text-sm'
                        >
                            戻る
                        </Button>
                    </div>
                    <div className='pl-2 w-1/2'>
                        <Button
                            htmlType='button'
                            onClick={() => submit()}
                            className='h-btn-default text-center rounded text-white border-green1A bg-green1A w-full shadow-sm text-sm'
                        >
                            決定
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalSelectOption;
