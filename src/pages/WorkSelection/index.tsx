/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-useless-fragment */
// eslint-disable-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line react/no-danger
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */

import iconsDenied from 'assets/icons/ic_denied.svg';
import Layout from 'components/templates/Layout';
import SubHeader from 'components/organisms/SubHeader';
import FuncBlock from 'components/common/FuncBlock';
import React, { useEffect, useState } from 'react';
import './index.scss';
import { Modal } from 'antd';
import {
    useLazyGetInfoCollectionQuery,
    useUpdateExclusionStatusBySeqNoMutation,
    useLazyGetCollectionPrintInfoQuery,
    clearCacheCollectedQuantityInput,
    useLazyGetSignatureCollectionQuery,
} from 'services/collection';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CONSTANT_ROUTE, ROLES, WORK_LINE_VOUCHER_SETTING } from 'utils/constants';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setPreviousPage } from 'services/page';
import { endPrint, startPrint } from 'services/print/print';
import { ICollectionPrint } from 'models';
import { openConfirm, openInformation } from 'utils/functions';
import { convertQuantityCollection } from 'utils/number';
import { IResponsePrint } from 'models/print';
import dayjs from 'dayjs';
import { useGetQuantityFormatQuery } from 'services/settings';
import { PrinterSvg } from 'components/icons/PrinterSvg';
import { TrashbinSvg } from 'components/icons/TrashbinSvg';
import { TagSvg } from 'components/icons/TagSvg';
import { GarbageBagSvg } from 'components/icons/GarbageBagSvg';
import { MapIcon } from 'components/icons/MapIcon';
import { SkylineIcon } from 'components/icons/SkylineIcon';
import { ChatIcon } from 'components/icons/ChatIcon';
import { blobToBase64 } from 'utils/file';
import sendMessagePrintCollection from 'services/print/handle-print-by-passPrnt';

const WorkSelection: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [seqNoParams] = useSearchParams();
    const seqNo = seqNoParams.get('seqNo');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.WORK_SELECTION],
    );

    const systemSetting = useAppSelector((state) => state.reducer.systemSetting.systemSetting);
    const isPrintWithSignature =
        systemSetting.workLineVoucherSetting ===
        WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT_WITH_SIGNATURE;
    const isPrintCopy = systemSetting.isPrintCopy;
    const user = useAppSelector((state) => state.reducer.user);
    const AuthMenu = user?.user?.authorizedMenu;
    const [getPrintInfo, responseGetPrintInfo] = useLazyGetCollectionPrintInfoQuery();
    const [getSignatureCollection, responseGetSignatureCollection] =
        useLazyGetSignatureCollectionQuery();
    const { data: formatQuantity } = useGetQuantityFormatQuery();

    const [getInfoCollection, { data: infoCollection, isLoading }] =
        useLazyGetInfoCollectionQuery();

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const navigateCollectionRecordInput = () => {
        dispatch(clearCacheCollectedQuantityInput());
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.COLLECTED_SUMMARY,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.COLLECTED_SUMMARY}?seqNo=${seqNo}`);
    };

    const navigateSiteNoteInput = () => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.SITE_NOTE_INPUT,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.SITE_NOTE_INPUT}?seq=${seqNo}`);
    };

    const navigateCollectionContainer = () => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.COLLECTION_CONTAINER,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.COLLECTION_CONTAINER}?seqNo=${seqNo}`);
    };

    const navigateGroupChat = () => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.GROUP_CHAT_LIST,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.GROUP_CHAT_LIST}?seq=${seqNo}`);
    };
    const openConfirmPrint = () => {
        openConfirm({
            content: (
                <div className='flex justify-center text-center items-center text-md font-bold w-full'>
                    <div>
                        作業明細伝票発行をします。
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),
            onOk: async () => {
                handlePrint();
            },
        });
    };

    const handlePrint = async () => {
        let signatureBase64 = null;
        const responseGetInfoPrint = await getPrintInfo({ seqNo }).unwrap();
        const dataPrint: ICollectionPrint = JSON.parse(JSON.stringify(responseGetInfoPrint));
        dataPrint.collectionDetails.forEach((e) => {
            e.quantity = convertQuantityCollection(e.quantity, formatQuantity);
            e.convertedQuantity = convertQuantityCollection(e.convertedQuantity, formatQuantity);
        });
        dataPrint.createDate = dayjs(new Date(dataPrint.createDate)).format('YYYY/MM/DD');
        dataPrint.operationTime = dayjs(new Date(dataPrint.operationTime)).format('HH:mm');
        if (isPrintWithSignature) {
            // check is print with signature
            const resposneGetSignature = await getSignatureCollection({
                seqNo: +seqNo,
            });
            signatureBase64 = await blobToBase64(resposneGetSignature.data);
        }

        sendMessagePrintCollection(dataPrint, signatureBase64);

        if (isPrintCopy) {
            openConfirm({
                content: (
                    <div className='flex justify-center text-center items-center text-md font-bold w-full'>
                        <div>
                            作業明細伝票(控)を発行します。
                            <br />
                            よろしいですか？
                        </div>
                    </div>
                ),
                onOk: async () => {
                    sendMessagePrintCollection(
                        dataPrint,
                        signatureBase64,
                        true /* isPrintCopy = true */,
                    );
                },
            });
        }
    };

    const listItem = [
        {
            key: 1,
            svg: <GarbageBagSvg className='w-full h-full object-cover' />,
            label: `${
                infoCollection
                    ? infoCollection.receptionType === 2
                        ? '運搬数量入力'
                        : '回収数量入力'
                    : '回収数量入力'
            }`,
            funtion: navigateCollectionRecordInput,
        },
        {
            key: 2,
            svg: <TrashbinSvg className='w-full h-full object-cover' />,
            label: 'コンテナ<br/>作業入力',
            funtion: navigateCollectionContainer,
        },
        {
            key: 3,
            svg: <PrinterSvg className='w-full h-full object-cover' />,
            label: '作業明細<br/>伝票発行',
            funtion: handlePrint,
        },
        {
            key: 4,
            id: ROLES.MOBILE003,
            svg: <TagSvg className='w-full h-full object-cover' />,
            isLimited: true,
            label: '現場メモ登録',
            funtion: navigateSiteNoteInput,
        },
        {
            key: 5,
            svg: <MapIcon className='w-full h-full object-cover' />,
            label: '作業なし登録',
            funtion: showModal,
        },
        {
            key: 6,
            svg: <ChatIcon />,
            label: '現場チャット',
            funtion: navigateGroupChat,
        },
    ];

    useEffect(() => {
        getInfoCollection({ seqNo: +seqNo });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seqNo]);

    const [updateExclusionStatusBySeqNo, { isLoading: isLoadingUpdate }] =
        useUpdateExclusionStatusBySeqNoMutation();

    const onUpdateExclusionStatus = async () => {
        const body = {
            timeStamp: infoCollection?.timeStamp,
        };

        try {
            const response = await updateExclusionStatusBySeqNo({ seqNo: +seqNo, body }).unwrap();
            if (response?.success) {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
        hideModal();
        navigate(previousUrl || `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`);
    };

    const handleClickRollBack = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`);
    };

    // TODO: giao diện không đồng nhất với main menu. !!
    return (
        <Layout
            title='作業選択'
            isShowDate={false}
            isLoading={isLoading || isLoadingUpdate}
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <div className='mt-header'>
                <SubHeader
                    title={infoCollection?.companyName}
                    desc={infoCollection?.siteName}
                    svgIcon={<SkylineIcon />}
                />
                <FuncBlock
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>作業内容</h2>
                        </div>
                    }
                />
                <div className='flex flex-wrap justify-between px-4 py-6 gap-y-4'>
                    {listItem.length > 0 &&
                        listItem.map((item) => {
                            const { key, label, svg, funtion, isLimited, id } = item;
                            if (id) {
                                if (!AuthMenu.includes(item.id)) {
                                    return <></>;
                                }
                            }
                            if (isLimited) {
                                if (user.user?.isSystemLimit) {
                                    return <></>;
                                }
                            }
                            return (
                                <div
                                    key={key}
                                    className={`w-[47%] bg-white rounded-lg py-2 flex flex-col items-center justify-center gap-2 shadow-md min-h-[140px] ${
                                        key !== 2 ||
                                        (key === 2 &&
                                            infoCollection?.dispatchType &&
                                            infoCollection.dispatchType === 1)
                                            ? ''
                                            : 'hidden'
                                    }`}
                                    onClick={funtion}
                                >
                                    <div className='w-10 h-10'>{svg}</div>
                                    <p
                                        className='font-zenMaru text-black52 text-md mb-0'
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Modal  */}
            <Modal
                title={false}
                open={open}
                onOk={hideModal}
                onCancel={hideModal}
                closable={false}
                footer={[
                    <div className='flex justify-center items-center mt-3' key='button'>
                        <button
                            type='button'
                            className='bg-green1A text-white rounded-xl py-2 px-5 mr-5 w-[128px] h-[49px] text-sm'
                            onClick={onUpdateExclusionStatus}
                        >
                            はい
                        </button>
                        <button
                            type='button'
                            className='text-green1A border border-green1A rounded-xl py-2 px-5 w-[128px] h-[49px] text-sm'
                            onClick={hideModal}
                        >
                            いいえ
                        </button>
                    </div>,
                ]}
            >
                <div className='flex flex-col justify-center items-center p-3'>
                    <div className='w-[48px] h-[48px]'>
                        <img
                            src={iconsDenied}
                            alt='iconsDenied'
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <div>
                        <p className='text-red2a font-bold my-3 text-xl text-center'>
                            {!infoCollection?.isExclusion
                                ? '作業なしを登録します。'
                                : '作業なし登録を解除します。'}
                        </p>
                        <p className='text-md text-center'>よろしいですか。</p>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default WorkSelection;
