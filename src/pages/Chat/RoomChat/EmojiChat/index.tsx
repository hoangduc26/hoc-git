/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { Avatar, Modal, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import iconCloseModal from 'assets/icons/ic_close.svg';
import { HeartFilled, LikeFilled, SmileFilled, UserOutlined } from '@ant-design/icons';
import './index.scss';

const EmojiChat = (props: {
    open: boolean;
    setOpen: any;
    emojiList: any[];
}) => {
    const {
        open,
        setOpen,
        emojiList,
    } = props;
    const myRef = useRef(null);
    useEffect(() => {
        add();
    }, []);

    const initialItems = [
        {
            label: '全て',
            key: '0',
            closable: false,
            children: (
                <div>
                    {emojiList?.map((item, index) => (
                        <div
                            key={index}
                            className={`py-3 px-2 ${index % 2 !== 0 ? 'bg-white' : 'bg-[#f4f4f4]'} last:mb-5`}>
                            <div className='flex items-center'>
                                <Avatar
                                    icon={<UserOutlined />}
                                    size='large'
                                    className='flex justify-center items-center'
                                />
                                <div className='w-[88%]'>
                                    <div className='ml-2'>
                                        <div className='flex justify-between items-center'>
                                            <p className='text-sm font-bold'>{item.sender}</p>
                                            <p className='text-right text-xl flex'>
                                                {item.emoji === '(y)' && <LikeFilled className='text-yellow-400' />}
                                                {item.emoji === '<3' && <HeartFilled className='text-red-600' />}
                                                {item.emoji === ':)' && <SmileFilled className='text-yellow-400' />}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            ),
        },
    ];
    const handleClose = () => {
        setOpen(false);
    };

    const [activeKey, setActiveKey] = useState(initialItems[0].key);
    const [items, setItems] = useState(initialItems);
    // const newTabIndex = useRef(0);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
        const collection = myRef.current.getElementsByClassName('ant-tabs-content-holder');
        collection[0].scrollTop = 0;
    };

    const add = () => {
        const newPanes = [...items];
        const emoji = emojiList
            .filter(
                (ele, ind) =>
                    ind ===
                    emojiList.findIndex(
                        (elem) =>
                            elem.emoji === ele.emoji,
                    ),
            )
            .map((x) => x.emoji);
        emoji.forEach(element => {
            let data;
            let title;
            let emojiSymbol;
            switch (element) {
                case '(y)':
                    emojiSymbol = '(y)';
                    data = emojiList.filter(x => x.emoji === '(y)');
                    title = <div className='flex items-center justify-center'><LikeFilled className='text-yellow-400 text-md' /> ({data.length})</div>;
                    break;

                case '<3':
                    emojiSymbol = '<3';
                    data = emojiList.filter(x => x.emoji === '<3');
                    title = <div className='flex items-center justify-center'><HeartFilled className='text-red-600 text-md' /> ({data.length})</div>;
                    break;

                case ':)':
                    emojiSymbol = ':)';
                    data = emojiList.filter(x => x.emoji === ':)');
                    title = <div className='flex items-center justify-center'><SmileFilled className='text-yellow-400 text-md' /> ({data.length})</div>;
                    break;

                default:
                    emojiSymbol = '';
                    data = '';
                    title = '';
                    break;
            }
            if (data && title) {
                // const newActiveKey = ++newTabIndex.current;
                const newActiveKey = emojiSymbol === '(y)' ? 1 : emojiSymbol === '<3' ? 2 : 3;
                newPanes.push({
                    label: title,
                    key: newActiveKey.toString(),
                    closable: false,
                    children: (
                        <div>
                            {data?.map((item, index) => (
                                <div
                                    key={index}
                                    className={`py-3 px-2 ${index % 2 !== 0 ? 'bg-white' : 'bg-[#f4f4f4]'} last:mb-5`}>
                                    <div className='flex items-center'>
                                        <Avatar
                                            icon={<UserOutlined />}
                                            size='large'
                                            className='flex justify-center items-center'
                                        />
                                        <div className='w-[88%]'>
                                            <div className='ml-2'>
                                                <div className='flex justify-between items-center'>
                                                    <p className='text-sm font-bold'>{item.sender}</p>
                                                    <p className='text-right text-xl flex'>
                                                        {item.emoji === '(y)' && <LikeFilled className='text-yellow-400' />}
                                                        {item.emoji === '<3' && <HeartFilled className='text-red-600' />}
                                                        {item.emoji === ':)' && <SmileFilled className='text-yellow-400' />}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ),
                });
                newPanes.sort((a, b) => (Number(a.key) - Number(b.key)));
            }
        });
        setItems(newPanes);
    };

    return (
        <Modal className='custom-antd-modal-select-bottom' title={false} open={open} footer={false}>
            <div className='header flex justify-between items-center px-4 p-4 bg-green1A'>
                <div className='flex items-center'>
                    <h2 className='font-semibold text-white text-xl mb-0 mr-3'>リアクション ({emojiList.length})</h2>
                </div>
                <button type='button' onClick={() => handleClose()}>
                    <img src={iconCloseModal} className='w-full h-full object-cover' alt='info' />
                </button>
            </div>
            <div className='px-4 pt-5 max-h-[500px] overflow-hidden' ref={myRef}>
                <Tabs
                    className='tab-emoji'
                    hideAdd
                    type="editable-card"
                    onChange={onChange}
                    activeKey={activeKey}
                    items={items}
                />
            </div>
        </Modal>
    );
};

export default EmojiChat;
