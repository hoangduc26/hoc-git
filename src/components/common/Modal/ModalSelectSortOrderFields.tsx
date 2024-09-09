import { Modal, Spin } from 'antd';
import iconClose from 'assets/icons/ic_close.svg';
import React, { useEffect, useState } from 'react';
import { PAGE_SIZE, SORT_ORDER_FIELDS } from 'utils/constants';

export interface ISelectValueModal {
    open: boolean;
    setOpen(value: boolean): void;
    handleSelectItem(item: any): void;
}

const ModalSelectSortOrderFields: React.FC<ISelectValueModal> = ({
    open,
    setOpen,
    handleSelectItem,
}) => {
    const onCloseModal = () => {
        setOpen(false);
    };

    return (
        <Modal className='main-menu__modal  font-inter' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-2'>並び順</h2>
                    <div className=' bg-yellow59 rounded-sm text-red2a font-bold flex items-center text-sm justify-center px-2 py-1'>
                        {SORT_ORDER_FIELDS.length}
                    </div>
                </div>
                <div role='button' onClick={onCloseModal}>
                    <img src={iconClose} className='w-full h-full object-cover' alt='info' />
                </div>
            </div>

            <div className='p-4'>
                <div id='scrollableDiv' className='overflow-auto h-[calc(100vh_-_80px)]'>
                    {SORT_ORDER_FIELDS.map((t) => (
                        <div
                            key={t.cd}
                            role='button'
                            onClick={() => handleSelectItem(t)}
                            className='rounded px-4 py-3 relative mb-3 bg-white  text-md pl-6 shadow-sm'
                        >
                            <div>
                                <span className='text-green1A text-md'>{t.name}</span>
                            </div>
                            <div className='absolute left-0 bg-green1A w-[6px] bottom-0 top-0 rounded-e-xl' />
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default ModalSelectSortOrderFields;
