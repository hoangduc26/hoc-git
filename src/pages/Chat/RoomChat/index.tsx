/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-lonely-if */
import * as signalR from '@microsoft/signalr';
import React, { MouseEvent, useEffect, useState } from 'react';
import './index.scss';
import { Avatar, Input, Skeleton, Tabs, TabsProps } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppSelector } from 'store/hooks';
import Layout from 'components/templates/Layout';
import iconClose from 'assets/icons/ic_close.svg';
import iconCloseBgWhite from 'assets/icons/ic_red_clear.svg';
import iconSearch from 'assets/icons/ic_search.svg';
import dayjs from 'dayjs';
import {
    ArrowDownOutlined,
    HeartFilled,
    LikeFilled,
    SendOutlined,
    SmileFilled,
    UserOutlined,
} from '@ant-design/icons';
import { UploadFile } from 'components/common/Files';
import { useLazyGetSizeUploadQuery } from 'services/settings';
import { openInformation } from 'utils/functions';
import { useLazyGetChatListQuery, usePostFiletChatMutation } from 'services/chat';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CONSTANT_ROUTE, PAGE_SIZE } from 'utils/constants';
import useDebounce from 'components/templates/hooks/useDebounce';
import { EmojiInformation, FileInformation, MesagesInformation } from 'models';
import Container from 'components/organisms/container';
import { UploadIcon } from 'components/icons/UploadIcon';
import FileChat from './FileChat';
import SearchMessage from './SearchMessage';
import EmojiChat from './EmojiChat';

const { TextArea } = Input;

export interface IRoomChat {
    groupId: string;
}

interface IMessage {
    messageId: string;
    fromUserId: string;
    sender: string;
    content: string;
    createDate?: string;
    chatEmojis?: EmojiInformation[];
    attachedFiles?: FileInformation[];
}

interface ImageMessage {
    ImageBinary: any[];
    ImageHeaders: string;
}

const TypeChat = {
    JOIN: 'Join',
    LEAVE: 'Leave',
};

const RoomChat: React.FC = () => {
    const { user }: any = useAppSelector((state) => state.reducer.user);
    const scrollableDiv: HTMLDivElement = document.querySelector('#scrollableDiv');
    const divMessages: HTMLDivElement = document.querySelector('#divMessages');
    const textAreaMessage: HTMLDivElement = document.querySelector('#textAreaMessage');

    const [params] = useSearchParams();
    const groupId = params.get('groupId');
    const cacheGroupName = useAppSelector((state) => state.reducer.groupsChat.infoGroupChat);

    const [connection, setConnection] = useState<signalR.HubConnection>();

    const [getChatList, responseApiGet] = useLazyGetChatListQuery();

    const [isReconnecting, setIsReconnecting] = useState(false);
    const [isShowScreenChat, setIsShowScreenChat] = useState(true);
    const [isShowScreenFile, setIsShowScreenFile] = useState(false);
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState<string>('');
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const [groupName, setGroupName] = useState(cacheGroupName.groupName);
    const [keyword, setKeyword] = useState('');
    const [isShowBtnNewMess, setIsShowBtnNewMess] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [heightDivMessage, setHeightDivMessage] = useState(65);

    const [indexShowSelectEmoji, setIndexShowSelectEmoji] = useState(0);
    const [isShowSelectEmoji, setIsShowSelectEmoji] = useState(false);
    const [relativeOffset, setRelativeOffset] = useState(0);

    const [getMaxSize] = useLazyGetSizeUploadQuery();
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const [uploadedFile, setUploadedFile] = useState([]);
    const [emojiList, setEmojiList] = useState([]);
    const [messageId, setMessageId] = useState('');

    const date = new Date();
    const milliSecond = 600000;
    let isSameDay: boolean;
    let day: string;
    let recentChatUsers: string;
    let recentChatUsersSameDay: string;
    let recentChatUsersMinutes: string;
    let isSameRecentChatUsers: boolean;
    let isToday: boolean;
    let isThisYear: boolean;
    const minHeightContenChat = 80;

    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.ROOM_CHAT],
    );

    const [postFileChat, { isLoading }] = usePostFiletChatMutation();

    const listEmoji = [
        {
            icon: <LikeFilled className='text-[#FACC15] text-md' />,
            value: '(y)',
        },
        {
            icon: <HeartFilled className='text-[#DC2626] text-md' />,
            value: '<3',
        },
        {
            icon: <SmileFilled className='text-[#FACC15] text-md' />,
            value: ':)',
        },
    ];

    // Connect SignalR
    useEffect(() => {
        setTimeout(() => {
            createConnect();
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createConnect = async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        const options = {
            // headers: { Authorization: `Bearer ${token}` },
            accessTokenFactory: () => token,
        };
        const connections = await new signalR.HubConnectionBuilder()
            // .configureLogging(signalR.LogLevel.Debug)
            .withUrl(`${process.env.REACT_APP_API_BASE_URL}/chatHub`, options)
            .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
            .withHubProtocol(new signalR.JsonHubProtocol())
            .build();

        setConnection(connections);
    };

    useEffect(() => {
        if (connection) {
            try {
                connection.start();
                setTimeout(() => {
                    connection?.invoke('JoinRoom', groupId, user.employeeName);
                }, 1000);
            } catch (error) {
                console.log(error);
            }
        }
        return () => {
            connection?.stop();
        };
    }, [connection]);

    useEffect(() => {
        if (connection) {
            try {
                connection.onreconnecting(async () => {
                    setIsReconnecting(true);
                });
                connection.onreconnected(async () => {
                    setIsShowBtnNewMess(false);
                    connection.start();
                    const params = {
                        SearchText: keyword,
                        PageNumber: 1,
                        PageSize: paging.PageSize,
                    };
                    await handleGetData(params, true);
                    await connection.invoke('JoinRoom', groupId, user.employeeName);
                    setIsReconnecting(false);
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [connection]);

    useEffect(() => {
        if (connection) {
            connection.on(
                'ReceiveMessage',
                (
                    users: string,
                    message: string,
                    chatMessageId: string,
                    fromUserId: string,
                    createdDate: string,
                    listFile: any[],
                    emojiId: string,
                ) => {
                    if (message === TypeChat.JOIN || message === TypeChat.LEAVE) {
                        const res: IMessage = {
                            messageId: chatMessageId,
                            fromUserId: users === user.employeeName ? user.employeeCd : '',
                            sender: users,
                            content: message,
                        };
                        setMessageList((prev) => [...prev, res]);
                        textAreaMessage.focus();
                        setTimeout(() => {
                            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
                        }, 500);
                    } else {
                        if (createdDate) {
                            const res: IMessage = {
                                messageId: chatMessageId,
                                fromUserId,
                                sender: users,
                                content: message,
                                createDate: createdDate,
                                chatEmojis: [],
                                attachedFiles: listFile?.length > 0 ? listFile : [],
                            };
                            setMessageList((prev) => [...prev, res]);
                            textAreaMessage.focus();
                            if (
                                fromUserId !== user.employeeCd &&
                                scrollableDiv.scrollTop < minHeightContenChat * -1
                            ) {
                                setIsShowBtnNewMess(true);
                            } else {
                                setTimeout(() => {
                                    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
                                }, 500);
                            }
                        } else {
                            const chatEmoji = {
                                group: groupId,
                                sender: users,
                                fromUserId: users === user.employeeName ? user.employeeCd : '',
                                emoji: message,
                                chatMessageId,
                                emojiId: fromUserId,
                            };
                            setMessageList((prev) =>
                                prev.map((item) =>
                                    item.messageId === chatMessageId
                                        ? (item.chatEmojis.length > 0 ? changeEmoji(item, chatEmoji) : { ...item, chatEmojis: [...item.chatEmojis, chatEmoji] })
                                        : item,
                                ),
                            );
                        }
                    }
                },
            );
        }
    }, [connection]);

    const changeEmoji = (list, chatEmoji) => {
        const listMess = { ...list };
        const index = listMess.chatEmojis.findIndex(x => x.sender === chatEmoji.sender);
        if (index >= 0) {
            const chatEmojisList = [...listMess.chatEmojis];
            let chatEmojis = { ...chatEmojisList[index] };
            chatEmojis = { ...chatEmojis, emoji: chatEmoji.emoji };
            chatEmojisList[index] = chatEmojis;
            listMess.chatEmojis = [...chatEmojisList];
        } else {
            listMess.chatEmojis = [...listMess.chatEmojis, chatEmoji];
        }

        return listMess;
    };

    // Send Mess
    const jsonToFormData = (jsonData: any, jsonDataFile?: any): FormData => {
        const formData = new FormData();
        formData.append('DataDto', JSON.stringify(jsonData));
        if (jsonDataFile) {
            Object.keys(jsonDataFile).forEach((key) =>
                formData.append('PostedFiles', jsonDataFile[key]),
            );
        }
        return formData;
    };

    const sendMsg = async () => {
        if (text || uploadedFile.length > 0) {
            if (connection) {
                if (uploadedFile.length > 0) {
                    const data = {
                        sender: user.employeeName,
                        fromUserId: user.employeeCd,
                        message: text,
                    };
                    const formData = jsonToFormData(data, uploadedFile);
                    await postFileChat({
                        groupId,
                        body: formData,
                    }).unwrap();
                    setText('');
                    setUploadedFile([]);
                } else {
                    await connection
                        .invoke(
                            'SendMessageToGroup',
                            user.employeeName,
                            groupId,
                            text,
                            user.employeeCd,
                        )
                        .then(() => {
                            setText('');
                        })
                        .catch((err) => {
                            console.error(err.toString());
                        });
                }
            }
        }
    };

    // Get list chat
    useDebounce(
        () => {
            const params = {
                SearchText: keyword,
                PageNumber: 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params, true);
        },
        300,
        [keyword],
    );

    useEffect(() => {
        const params = {
            SearchText: keyword,
            PageNumber: paging.PageNumber,
            PageSize: paging.PageSize,
        };
        handleGetData(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMoreData = async () => {
        try {
            const params = {
                SearchText: keyword,
                PageNumber: paging.PageNumber + 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetData = async (params, isSearch?) => {
        const response = await getChatList({ groupId, params }).unwrap();
        if (response) {
            setPaging({
                ...paging,
                PageNumber: params.PageNumber,
                totalRecords: response.totalRecords,
            });
            if (isSearch) {
                setMessageList([...response.items].reverse());
            } else {
                setMessageList([...response.items.slice().reverse(), ...messageList]);
            }
        }
    };

    // Upload File
    const validFileSize = async (file): Promise<{ isAllow:boolean, maxFileSize:number }> => {
        const maxFileSize = await getMaxSize().unwrap();
        if (maxFileSize) {
            const maxUploadSize = maxFileSize * 1000000;
            if (file.size > maxUploadSize) return { isAllow:false, maxFileSize };
            return { isAllow:true, maxFileSize };
        }
        return { isAllow:false, maxFileSize };
    };

    const handleFileUpload = async (file) => {
        const { isAllow, maxFileSize } = await validFileSize(file);
        if (isAllow) {
            const filesUpload = [...uploadedFile, file];
            setUploadedFile(filesUpload);
        } else {
            openInformation({
                content: (
                    <div className='text-center text-ssm font-bold'>
                        添付可能なサイズを超えています。
                        <br />
                        {maxFileSize}MB以下のファイルを
                        <br />
                        選択してください。
                    </div>
                ),
            });
        }
    };

    const fetchFile = (url: string) => {
        const token = localStorage.getItem('ACCESS_TOKEN');

        return fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }

            // Extract the file name from the Content-Disposition header
            const contentDispositionHeader = response.headers.get('Content-Disposition');
            const fileNameMatch = contentDispositionHeader.match(/filename\*?=([^;]+)/);
            const fileName = fileNameMatch
                ? fileNameMatch[1].trim().replace(/^"(.*)"$/, '$1')
                : 'filename'; // Set a default name if not found

            // Extract the file type from the Content-Type header
            const contentType = response.headers.get('Content-Type');
            setIsLoadingDownload(false);

            return response
                .blob()
                .then((blob) => new File([blob], fileName, { type: contentType }));
        });
    };

    const handleDownloadFile = async (file) => {
        if (file) {
            const fileData = {
                id: file.fileId,
                name: file.fileName,
                size: file.fileLength,
                extention: file.fileExtention,
            };
            handleDownload(fileData);
        }
    };

    const handleDownload = async (file) => {
        if (file) {
            let fileDownload = file;
            if (Number.isInteger(file.id)) {
                setIsLoadingDownload(true);
                fileDownload = await fetchFile(
                    `${process.env.REACT_APP_API_BASE_URL}/api/v1/files/${file.id}`,
                );
            }
            const downloadUrl = URL.createObjectURL(fileDownload);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.name;
            link.click();
            URL.revokeObjectURL(downloadUrl);
        }
    };

    const handleDeleteFile = (fileId: string) => {
        if (fileId) {
            const updatedFiles = uploadedFile.filter((file) => file.id !== fileId);
            setUploadedFile(updatedFiles);
        }
    };

    // send emoji
    const selectEmoji = (index: number) => {
        const topOffset = document.getElementById(`emoji${index}`)?.offsetTop;
        const scrollTop = scrollableDiv?.scrollTop;
        setRelativeOffset((topOffset ? topOffset : 0) - (scrollTop ? scrollTop : 0));
        setIsShowSelectEmoji(true);
        setIndexShowSelectEmoji(index);
    };

    const reactionsMessage = async (
        value: MesagesInformation,
        e: MouseEvent<HTMLDivElement>,
        emoji?: string,
    ) => {
        const message = messageList.find(x => x.messageId === value.messageId);
        const index = message.chatEmojis.findIndex(x => x.sender === user.employeeName);
        switch (e.detail) {
            case 1:
                if (isShowSelectEmoji && emoji) {
                    if (connection) {
                        await connection
                            .invoke(
                                'SendEmojiMessageToGroup',
                                user.employeeName,
                                groupId,
                                value.messageId,
                                emoji,
                                index >= 0 ? message.chatEmojis[0].emojiId : null,
                            )
                            .catch((err) => {
                                console.error(err.toString());
                            });
                        setIsShowSelectEmoji(false);
                    }
                }
                break;
            case 2: {
                if (connection) {
                    await connection
                        .invoke(
                            'SendEmojiMessageToGroup',
                            user.employeeName,
                            groupId,
                            value.messageId,
                            '(y)',
                            index >= 0 ? message.chatEmojis[0].emojiId : null,
                        )
                        .catch((err) => {
                            console.error(err.toString());
                        });
                }
                break;
            }
            default:
                break;
        }
    };

    // change height
    const getHeightDivMessage = () => {
        if (divMessages) {
            setTimeout(() => {
                setHeightDivMessage(divMessages?.offsetHeight);
            }, 10);
        }
    };

    useEffect(() => {
        getHeightDivMessage();
    }, [text, uploadedFile]);

    const scrollTop = () => {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        setIsShowBtnNewMess(false);
    };

    const checkHiddenBtnNewMess = () => {
        if (scrollableDiv.scrollTop === 0) {
            setIsShowBtnNewMess(false);
        }
    };

    const onChangeTab = (key: string) => {
        if (key === '1') {
            setIsShowScreenChat(true);
            setIsShowScreenFile(false);
        } else {
            setIsShowScreenChat(false);
            setIsShowScreenFile(true);
        }
    };

    const handleClickRollBack = async () => {
        connection?.stop();
        await navigate(previousUrl || `/${CONSTANT_ROUTE.GROUP_CHAT_LIST}`);
    };

    const showModal = (listEmoji) => {
        setOpen(true);
        setEmojiList(listEmoji);
    };

    let pageNumber = paging.PageNumber;
    let messageChat = [...messageList];
    const handleSelectItemSearch = async (item: any) => {
        setIsShowSearch(false);
        const findId = messageChat.find(x => x.messageId === item);
        if (findId) {
            setMessageList(messageChat);
            setMessageId(item);
        } else {
            const params = {
                SearchText: keyword,
                PageNumber: pageNumber + 1,
                PageSize: paging.PageSize,
            };
            const response = await getChatList({ groupId, params }).unwrap();
            if (response) {
                pageNumber = params.PageNumber;
                setPaging({
                    ...paging,
                    PageNumber: params.PageNumber,
                    totalRecords: response.totalRecords,
                });
                messageChat = [...response.items.slice().reverse(), ...messageChat];
                await setMessageList(messageChat);
                handleSelectItemSearch(item);
            }
        }
    };

    useEffect(() => {
        if (messageId) {
            const findId = messageList.find(x => x.messageId === messageId);
            if (findId) {
                document.getElementById(messageId).scrollIntoView();

                document.getElementById(messageId).classList.add('animation-pulse-find-mess');
                setTimeout(() => {
                    document.getElementById(messageId).classList.remove('animation-pulse-find-mess');
                }, 3000);
            }
            setMessageId('');
        }
    }, [messageList, messageId]);

    const listChatEmoji = (emojis?: EmojiInformation[]) => {
        const thumbUp = emojis?.filter((x: EmojiInformation) => x.emoji === '(y)')?.length;
        const heart = emojis?.filter((x: EmojiInformation) => x.emoji === '<3')?.length;
        const faceSmile = emojis?.filter((x: EmojiInformation) => x.emoji === ':)')?.length;
        const faceLaugh = emojis?.filter((x: EmojiInformation) => x.emoji === ':D')?.length;
        const faceSuprise = emojis?.filter((x: EmojiInformation) => x.emoji === ':O')?.length;
        let isShowThumbUp = false;
        let isShowHeart = false;
        let isShowFaceSmile = false;
        let isShowFaceLaugh = false;
        let isShowFaceSuprise = false;
        if (thumbUp && thumbUp > 0) {
            isShowThumbUp = true;
        }
        if (heart && heart > 0) {
            isShowHeart = true;
        }
        if (faceSmile && faceSmile > 0) {
            isShowFaceSmile = true;
        }
        if (faceLaugh && faceLaugh > 0) {
            isShowFaceLaugh = true;
        }
        if (faceSuprise && faceSuprise > 0) {
            isShowFaceSuprise = true;
        }
        return (
            <>
                {isShowThumbUp && (
                    <div className='flex items-center rounded-full p-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] translate-y-[-7px] bg-white' onClick={() => showModal(emojis)}>
                        <LikeFilled className='text-yellow-400 ml-1' />
                        <span className='mx-1 text-sm'>{thumbUp}</span>
                    </div>
                )}
                {isShowHeart && (
                    <div
                        className={`flex items-center rounded-full p-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] translate-y-[-7px] bg-white ${isShowThumbUp ? 'ml-1' : ''
                            } `} onClick={() => showModal(emojis)}>
                        <HeartFilled className='text-red-600 ml-1' />
                        <span className='mx-1 text-sm'>{heart}</span>
                    </div>
                )}
                {isShowFaceSmile && (
                    <div
                        className={`flex items-center rounded-full p-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] translate-y-[-7px] bg-white ${isShowThumbUp || isShowHeart ? 'ml-1' : ''
                            } `} onClick={() => showModal(emojis)}>
                        <SmileFilled className='text-yellow-400 ml-1' />
                        <span className='mx-1 text-sm'>{faceSmile}</span>
                    </div>
                )}
            </>
        );
    };

    const listAttachedFiles = (attachedFiles?: FileInformation[]) => (
        <>
            {attachedFiles.map((item: FileInformation, index: number) => (
                <div
                    key={index}
                    onClick={() => handleDownloadFile(item)}
                    className='text-[#DC2626] underline text-ssm'
                >
                    {item.fileName}
                </div>
            ))}
        </>
    );

    const listChat = messageList.map((item: MesagesInformation, index: any) => {
        const createdDate = dayjs(item.createDate).format('YYYY/MM/DD');
        const createdDateTime = dayjs(item.createDate).format('YYYY/MM/DD HH:mm');
        const lengthChatEmoji = item.chatEmojis ? item.chatEmojis?.length : 0;
        if (!isSameDay) {
            day = createdDate;
        }

        if (createdDate !== day) {
            isSameDay = false;
        } else {
            isSameDay = true;
        }

        if (dayjs(createdDate).isSame(dayjs(date).format('YYYY/MM/DD'))) {
            isToday = true;
        } else {
            isToday = false;
        }

        if (dayjs(item.createDate).format('YYYY') === dayjs(date).format('YYYY')) {
            isThisYear = true;
        } else {
            isThisYear = false;
        }

        if (recentChatUsers && recentChatUsersSameDay) {
            if (item.content !== TypeChat.JOIN && item.content !== TypeChat.LEAVE) {
                if (recentChatUsers === item.fromUserId && recentChatUsersSameDay === createdDate) {
                    if (
                        new Date(Date.parse(createdDateTime)).getTime() -
                        new Date(Date.parse(recentChatUsersMinutes)).getTime() <=
                        milliSecond
                    ) {
                        isSameRecentChatUsers = true;
                    } else {
                        isSameRecentChatUsers = false;
                        recentChatUsers = item.fromUserId;
                        recentChatUsersSameDay = createdDate;
                    }
                    recentChatUsersMinutes = createdDateTime;
                } else {
                    isSameRecentChatUsers = false;
                    recentChatUsers = item.fromUserId;
                    recentChatUsersSameDay = createdDate;
                    recentChatUsersMinutes = createdDateTime;
                }
            } else {
                isSameRecentChatUsers = false;
                recentChatUsers = '';
                recentChatUsersSameDay = createdDate;
                recentChatUsersMinutes = createdDateTime;
            }
        } else {
            recentChatUsers = item.fromUserId;
            recentChatUsersSameDay = createdDate;
            recentChatUsersMinutes = createdDateTime;
            isSameRecentChatUsers = false;
        }
        if (item.content !== TypeChat.JOIN && item.content !== TypeChat.LEAVE) {
            if (item.fromUserId === user.employeeCd) {
                return (
                    <div key={index}>
                        {!isSameDay && !isToday && !isThisYear && (
                            <span className='horizontal-line'>
                                {dayjs(item.createDate).format('YYYY年MM月DD日')}
                            </span>
                        )}
                        {!isSameDay && !isToday && isThisYear && (
                            <span className='horizontal-line'>
                                {dayjs(item.createDate).format('MM月DD日')}
                            </span>
                        )}
                        {!isSameDay && isToday && isThisYear && (
                            <span className='horizontal-line'>今日</span>
                        )}
                        <div
                            className={`${item.chatEmojis?.length ? '' : 'mb-2'}`}
                            id={'emoji' + index}
                        >
                            <div className='flex justify-end'>
                                <SmileFilled
                                    className='text-gray-300 m-1 text-sm h-fit'
                                    onClick={() => selectEmoji(index)}
                                    onMouseLeave={() => setIsShowSelectEmoji(false)}
                                />
                                <div
                                    onClick={(event) => reactionsMessage(item, event)}
                                    className='relative'
                                >
                                    <div className='mx-2 py-2 px-4 bg-green15 rounded-bl-2xl rounded-tl-2xl rounded-tr-xl text-white' id={item.messageId}>
                                        {listAttachedFiles(item.attachedFiles)}
                                        <p className='text-sm break-words'>{item.content}</p>
                                        <p className='text-right text-xs text-grey-dark mt-1'>
                                            {isToday
                                                ? dayjs(item.createDate).format('HH:mm')
                                                : isThisYear
                                                    ? dayjs(item.createDate).format('MM/DD HH:mm')
                                                    : dayjs(item.createDate).format('YYYY/MM/DD HH:mm')}
                                        </p>
                                    </div>
                                    {lengthChatEmoji > 0 && (
                                        <div className='flex justify-end mx-3'>
                                            {listChatEmoji(item.chatEmojis)}
                                        </div>
                                    )}
                                    {isShowSelectEmoji && indexShowSelectEmoji === index && (
                                        <div
                                            className={`absolute right-0 ${relativeOffset < 135 ? 'top-0' : 'top-[-30px]'
                                                } mr-2 z-10`}
                                        >
                                            <div className='flex items-center rounded-md p-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] translate-y-[7px] bg-white px-3 border'>
                                                {listEmoji.map((emoji, i) => (
                                                    <div
                                                        key={i}
                                                        className='ml-3 first:ml-0 flex items-center'
                                                        onClick={(event) =>
                                                            reactionsMessage(
                                                                item,
                                                                event,
                                                                emoji.value,
                                                            )
                                                        }
                                                    >
                                                        {emoji.icon}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {index === messageList.length - 1 &&
                            dayjs(item.createDate).format('DD/MM/YYYY') !==
                            dayjs(new Date().toISOString()).format('DD/MM/YYYY') && (
                                <span className='horizontal-line'>今日</span>
                            )}
                    </div>
                );
            }
            return (
                <div key={index}>
                    {!isSameDay && !isToday && !isThisYear && (
                        <span className='horizontal-line'>
                            {dayjs(item.createDate).format('YYYY年MM月DD日')}
                        </span>
                    )}
                    {!isSameDay && !isToday && isThisYear && (
                        <span className='horizontal-line'>
                            {dayjs(item.createDate).format('MM月DD日')}
                        </span>
                    )}
                    {!isSameDay && isToday && isThisYear && (
                        <span className='horizontal-line'>今日</span>
                    )}
                    <div className='mb-2' id={'emoji' + index}>
                        <div className='flex mx-2'>
                            {!isSameRecentChatUsers ? (
                                <Avatar
                                    icon={<UserOutlined />}
                                    size='large'
                                    className='flex justify-center items-center'
                                />
                            ) : (
                                <div className='px-5' />
                            )}
                            <div
                                className='max-w-[82%] relative'
                                onClick={(event) => reactionsMessage(item, event)}
                            >
                                <div className='ml-2 py-2 px-4 bg-grayBE rounded-br-2xl rounded-tr-2xl rounded-tl-xl text-white' id={item.messageId}>
                                    {!isSameRecentChatUsers && (
                                        <p className='text-sm font-bold'>{item.sender}</p>
                                    )}
                                    {listAttachedFiles(item.attachedFiles)}
                                    <p className='text-sm mt-1 break-words'>{item.content}</p>
                                    <p className='text-right text-xs text-grey-dark mt-1'>
                                        {isToday
                                            ? dayjs(item.createDate).format('HH:mm')
                                            : isThisYear
                                                ? dayjs(item.createDate).format('MM/DD HH:mm')
                                                : dayjs(item.createDate).format('YYYY/MM/DD HH:mm')}
                                    </p>
                                </div>
                                {lengthChatEmoji > 0 && (
                                    <div className='flex mx-3'>
                                        {listChatEmoji(item.chatEmojis)}
                                    </div>
                                )}
                                {isShowSelectEmoji && indexShowSelectEmoji === index && (
                                    <div
                                        className={`absolute ${relativeOffset < 135 ? 'top-0' : 'top-[-30px]'
                                            } ml-2 z-10 right-0`}
                                    >
                                        <div className='flex items-center rounded-md p-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] translate-y-[7px] bg-white px-3 border'>
                                            {listEmoji.map((emoji, i) => (
                                                <div
                                                    key={i}
                                                    className='ml-3 first:ml-0 flex items-center'
                                                    onClick={(event) =>
                                                        reactionsMessage(item, event, emoji.value)
                                                    }
                                                >
                                                    {emoji.icon}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <SmileFilled
                                className='text-gray-300 m-1 text-sm h-fit'
                                onClick={() => selectEmoji(index)}
                                onMouseLeave={() => setIsShowSelectEmoji(false)}
                            />
                        </div>
                    </div>
                    {index === messageList.length - 1 &&
                        dayjs(item.createDate).format('DD/MM/YYYY') !==
                        dayjs(new Date().toISOString()).format('DD/MM/YYYY') && (
                            <span className='horizontal-line'>今日</span>
                        )}
                </div>
            );
        }
        return (
            <div key={index}>
                {!isSameDay && isToday && isThisYear && (
                    <span className='horizontal-line'>今日</span>
                )}
                <div className='text-center mb-1'>
                    {item.sender}{' '}
                    {item.content === TypeChat.JOIN ? '参加されました!!' : '退出されました!!'}
                </div>
            </div>
        );
    });

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'チャット',
            children: (
                <div>
                    {isShowScreenChat && (
                        <div className='h-[calc(100vh_-_220px)] bg-white'>
                            <div
                                id='scrollableDiv'
                                className='overflow-auto flex flex-col-reverse'
                                style={{ height: `calc(100% - ${heightDivMessage}px )` }}
                            >
                                <InfiniteScroll
                                    dataLength={messageList.length ?? 0}
                                    next={loadMoreData}
                                    inverse
                                    className='flex flex-col-reverse mt-1 !overflow-visible'
                                    hasMore={messageList.length < paging?.totalRecords}
                                    loader={<Skeleton paragraph={{ rows: 1 }} active />}
                                    scrollableTarget='scrollableDiv'
                                    onScroll={checkHiddenBtnNewMess}
                                >
                                    {listChat.reverse()}
                                </InfiniteScroll>
                            </div>
                            <div>
                                {isShowBtnNewMess && (
                                    <div className='-translate-y-11 flex justify-end mr-1'>
                                        <span
                                            className='py-2 px-4 bg-[var(--main-color-light)] text-white border border-green1A w-fit rounded-md flex justify-center items-center text-ssm'
                                            onClick={scrollTop}
                                        >
                                            <ArrowDownOutlined className='mr-1' />
                                            新しいメッセージ
                                        </span>
                                    </div>
                                )}
                                <div
                                    className='fixed bottom-[62px] w-full bg-white shadow-inner'
                                    id='divMessages'
                                >
                                    {uploadedFile?.length > 0 && (
                                        <div className='grid grid-cols-4 gap-1 mx-2 mt-2'>
                                            {uploadedFile.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className='upload-file w-full rounded flex justify-between gap-1 py-1 px-2 bg-green15 relative'
                                                >
                                                    <div
                                                        className='flex items-center gap-1 w-full text-sm text-white'
                                                        onClick={() => handleDownload(file)}
                                                    >
                                                        <span className='truncate'>
                                                            {file.name}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className='w-5 h-5 absolute right-0 top-0'
                                                        onClick={() => handleDeleteFile(file.id)}
                                                    >
                                                        <img
                                                            src={iconCloseBgWhite}
                                                            className='w-full h-full object-cover bg-white flex items-center justify-center rounded-full'
                                                            alt='clear file'
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className='flex gap-2 my-3 justify-center items-center'>
                                        <UploadFile onFileUpload={handleFileUpload}>
                                            <div
                                                role='button'
                                                className='bg-white rounded-full w-8 h-8'
                                            >
                                                <UploadIcon className='w-full h-full object-cover p-2' />
                                            </div>
                                        </UploadFile>
                                        <TextArea
                                            id='textAreaMessage'
                                            className='textarea-message'
                                            size='large'
                                            autoSize={{ minRows: 1, maxRows: 3 }}
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                        <SendOutlined
                                            className='text-green1A text-xl flex items-center mr-2'
                                            onClick={sendMsg}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: '2',
            label: 'ファイル',
            children: (
                <div className='h-[calc(100vh_-_220px)] bg-white'>
                    {isShowScreenFile && <FileChat groupId={groupId} />}
                </div>
            ),
        },
    ];

    return (
        <Layout
            title='CHAT'
            isShowDate={false}
            isLoading={
                responseApiGet.isLoading ||
                responseApiGet.isFetching ||
                isLoadingDownload ||
                isLoading ||
                isReconnecting
            }
            isShowRollback
            onClickRollback={handleClickRollBack}
            isHiddenPageHeader
        >
            <div className='header_noti bg-green1A py-2'>
                <Container classnames='flex justify-between items-center'>
                    <p className='w-fit  text-[white] mb-0 text-md font-semibold font-inter truncate'>
                        {groupName}
                    </p>

                    <div
                        className={`${!isShowSearch ? 'bg-white rounded-full ml-3' : ''
                            } w-6 h-6 flex justify-center items-center`}
                    >
                        <div
                            className={`${!isShowSearch ? 'w-4 h-4' : 'w-6 h-6'
                                } flex justify-center items-center`}
                            onClick={() => {
                                setIsShowSearch(!isShowSearch);
                            }}
                        >
                            {!isShowSearch ? (
                                <img
                                    src={iconSearch}
                                    className='w-full h-full object-cover'
                                    alt='iconClose'
                                />
                            ) : (
                                <img
                                    src={iconClose}
                                    className='w-full h-full object-cover'
                                    alt='iconClose'
                                />
                            )}
                        </div>
                    </div>
                </Container>
            </div>
            <Tabs defaultActiveKey='1' items={items} className='tab-chat' onChange={onChangeTab} />
            {/* search */}
            {isShowSearch && (
                <div className='bg-white absolute top-[112px] w-full'>
                    <SearchMessage groupId={groupId} handleSelectItem={handleSelectItemSearch} />
                </div>
            )}
            {/* Modal  */}
            {open && (
                <EmojiChat
                    open={open}
                    setOpen={setOpen}
                    emojiList={emojiList}
                />
            )}
        </Layout>
    );
};

export default RoomChat;
