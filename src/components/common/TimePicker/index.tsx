import { Button, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import TimePicker from 'react-times';
import './index.scss';
import dayjs from 'dayjs';

interface ITImePickerProps {
    open: boolean;
    setOpen: any;
    handleSelect: any;
    defaultTime?: string;
}
const CustomTimePicker = (props: ITImePickerProps) => {
    const firstRender = useRef(true);
    const { open, handleSelect, setOpen, defaultTime } = props;
    const currentTime = dayjs().format('HH:mm');
    const [time, setTime] = useState(currentTime);

    useEffect(() => {
        if (!open) {
            return;
        }
        setTime(defaultTime);
    }, [open, defaultTime]);

    const onTimeChange = (options) => {
        const { hour, minute } = options;
        setTime(`${hour}:${minute}`);
    };

    const submit = () => {
        handleSelect(time || currentTime);
        setOpen(false);
    };

    return (
        <Modal
            className='time-modal font-inter'
            title={false}
            open={open}
            onOk={() => open}
            onCancel={() => !open}
            footer={false}
            centered
        >
            <div className='flex flex-col items-center gap-4 justify-center'>
                <h2 className='text-md font-medium  pb-4 text-black4F'>時間を選択してください</h2>

                <div className='w-full mb-6'>
                    <TimePicker time={time} minuteStep={1} limitDrag onTimeChange={onTimeChange} />
                </div>

                <div className='w-full grid grid-cols-2 gap-3 justify-between'>
                    <Button
                        htmlType='button'
                        onClick={() => {
                            setOpen(false);
                        }}
                        className=' bg-white border-green15 border-[1px] rounded-md h-btn-default text-green1A'
                    >
                        戻る
                    </Button>
                    <Button
                        htmlType='button'
                        onClick={() => submit()}
                        className=' bg-green1A border-green1A border-[1px] rounded-md h-btn-default text-white'
                    >
                        決定
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CustomTimePicker;
