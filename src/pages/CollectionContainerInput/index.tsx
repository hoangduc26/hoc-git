/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-lonely-if */
import SubHeader from 'components/organisms/SubHeader';
import Layout from 'components/templates/Layout';
import React, { useEffect, useState } from 'react';
import iconRedClear from 'assets/icons/ic_red_clear.svg';
import iconSubmit from 'assets/icons/ic_submit.svg';
import iconQrCode from 'assets/icons/ic_qrcode.svg';
import FuncBlock from 'components/common/FuncBlock';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, InputNumber, Modal, Radio } from 'antd';
import './index.scss';
import Container from 'components/organisms/container';
import {
    useLazyGetContainersByContainerSeqNoQuery,
    useLazyGetInfoCollectionQuery,
    usePostContainersMutation,
    usePutContainersMutation,
} from 'services/collection';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CONSTANT_ROUTE } from 'utils/constants';
import { useAppSelector } from 'store/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { openConfirm, openInformation } from 'utils/functions';
import { QrReader } from 'react-qr-reader';
import { useLazyGetContainerByCdQuery, useLazyGetContainerTypeByCdQuery } from 'services/containers';
import { SkylineIcon } from 'components/icons/SkylineIcon';
import ModalContainer from './ModalContainer';

interface IFormValue {
    containerCd: string;
    containerName: string;
    containerTypeCd: string;
    containerTypeName: string;
    quantity: number;
    settingType: number;
    timeStamp: string;
}
const CollectionContainerInput: React.FC = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [isQR, setIsQR] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [params] = useSearchParams();
    const seqNo = params.get('seqNo');
    const containerSeqNo = params.get('containerSeqNo');
    const recordNo = params.get('recordNo');
    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.COLLECTION_CONTAINER_INPUT],
    );
    const { user }: any = useAppSelector((state) => state.reducer.user);

    const [getInfoCollection, { data: infoCollection, isLoading: isLoadingGetInfoCollection }] =
        useLazyGetInfoCollectionQuery();
    const [getContainer, { data: containers, isLoading: isloadingGetContainers }] =
        useLazyGetContainersByContainerSeqNoQuery();
    const [postContainers, { isLoading: isLoadingPostContainers }] = usePostContainersMutation();
    const [putContainers, { isLoading: isLoadingPutContainers }] = usePutContainersMutation();
    const [getContainerByCdQuery, { data: containersByCdQuery, isLoading: isloadingGetContainersByCdQuery }] = useLazyGetContainerByCdQuery();
    const [getContainerTypeByCdQuery, { data: containersTypeByCdQuery, isLoading: isloadingGetContainersTypeByCdQuery }] = useLazyGetContainerTypeByCdQuery();

    const dateTimeInfos = {
        title: '現場着:',
        date: infoCollection
            ? infoCollection.collectionDate
                ? new Date(infoCollection.collectionDate)
                : new Date()
            : new Date(),
        time: infoCollection?.arrivalTime?.slice(0, 5),
    };

    const constraints = {
        facingMode: 'environment',
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
        },
    };

    const { control, formState, setValue, handleSubmit, resetField, getValues } = useForm<IFormValue>({
        defaultValues: {
            containerCd: '',
            containerName: '',
            containerTypeCd: '',
            containerTypeName: '',
            quantity: undefined,
            settingType: 0,
            timeStamp: '',
        },

        resolver: yupResolver(
            yup.object().shape({
                containerTypeCd: yup.string().nullable().required('コンテナ種類を入力してください'),
                containerCd:
                    user.containerManagementType === 2
                        ? yup.string().nullable().required('コンテナ名称を入力してください')
                        : null,
                quantity:
                    user.containerManagementType === 1
                        ? yup
                            .number()
                            .nullable()
                            .required('台数を入力してください。')
                            .min(1, '台数には「1～999」を入力してください。')
                            .max(999, '台数には「1～999」を入力してください。')
                        : null,
            }),
        ),
    });

    useEffect(() => {
        if (seqNo) {
            getInfoCollection({ seqNo: +seqNo }).unwrap();
        }
    }, [seqNo]);

    useEffect(() => {
        if (containerSeqNo && recordNo) {
            setIsEdit(true);
            getContainers({ seqNo: +seqNo, containerSeqNo: +containerSeqNo, recordNo: +recordNo });
        }
    }, []);

    useEffect(() => {
        if (Object.keys(formState?.errors)?.length > 0) {
            let messageErr = '';
            const { errors } = formState;
            if (errors.containerTypeCd) {
                messageErr = errors.containerTypeCd.message;
            } else if (user.containerManagementType === 2 && errors.containerCd) {
                messageErr = errors.containerCd.message;
            } else if (user.containerManagementType === 1 && errors.quantity) {
                messageErr = errors.quantity.message;
            }
            openInformation({
                content: <div className='text-center text-ssm font-bold'>{messageErr}</div>,
            });
        }
    }, [formState.errors]);

    const getContainers = async (query) => {
        try {
            const response = await getContainer(query).unwrap();
            // get data
            if (response) {
                setValue('containerTypeCd', response.containerTypeCd);
                setValue('containerTypeName', response.containerTypeName);
                if (user.containerManagementType === 2) {
                    setValue('containerCd', response.containerCd);
                    setValue('containerName', response.containerName);
                } else {
                    setValue('quantity', response.quantity);
                }
                setValue('settingType', response.settingType);
                setValue('timeStamp', response.timeStamp);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = (data: any) => {
        openConfirm({
            content: (
                <div className='flex justify-center items-center text-md font-bold w-full'>
                    <div>
                        実績を登録します。
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),
            onOk: () => {
                if (isEdit) {
                    updateContainer(data);
                } else {
                    insertContainer(data);
                }
            },
        });
    };

    const insertContainer = async (data: IFormValue) => {
        try {
            const body = {
                containerCd: data.containerCd,
                containerTypeCd: data.containerTypeCd,
                quantity: user.containerManagementType === 1 ? +data.quantity : 1,
                settingType: data.settingType,
            };
            const response: any = await postContainers({ seqNo: +seqNo, body });
            if (response && !response.error) {
                // success
                handleRollback();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateContainer = async (data: IFormValue) => {
        try {
            const body = {
                containerCd: data.containerCd,
                containerTypeCd: data.containerTypeCd,
                quantity: user.containerManagementType === 1 ? +data.quantity : 1,
                settingType: data.settingType,
                timeStamp: data.timeStamp,
            };
            const response: any = await putContainers({
                seqNo: +seqNo,
                containerSeqNo: +containerSeqNo,
                recordNo: +recordNo,
                body,
            });
            if (response && !response.error) {
                // success
                handleRollback();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getValueContainerByQR = async (data: string) => {
        if (data) {
            const qrValue = data.split(';');
            const typeCd = qrValue[1]?.substring(18);
            const containerCd = qrValue[2]?.substring(11);

            if (!getValues('settingType')) {
                setValue('settingType', 9);
            }
            if (containerCd) {
                const response = await getContainerByCdQuery({ containerTypeCd: typeCd, containerCd }).unwrap();
                if (response) {
                    setValue('containerTypeCd', response.containerTypeCd);
                    setValue('containerTypeName', response.containerTypeName);
                    setValue('containerCd', response.containerCd);
                    setValue('containerName', response.containerName);
                }
            } else if (typeCd) {
                const response = await getContainerTypeByCdQuery({ typeCd }).unwrap();
                if (response) {
                    setValue('containerTypeCd', response.cd);
                    setValue('containerTypeName', response.name);
                }
            }
            setShowQRModal(false);
        }
    };

    const openQRModal = () => {
        setShowQRModal(true);
    };

    const handleSelectModal = (d) => {
        setValue('containerCd', d.containerCd);
        setValue('containerName', d.containerName);
        setValue('containerTypeCd', d.containerTypeCd);
        setValue('containerTypeName', d.containerTypeName);
        setValue('settingType', 9);
        setOpenModal(false);
    };

    const handleRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.COLLECTION_CONTAINER}?seqNo=${seqNo}`);
    };

    return (
        <Layout
            title='コンテナ作業入力'
            isLoading={
                isLoadingGetInfoCollection ||
                isloadingGetContainers ||
                isLoadingPostContainers ||
                isLoadingPutContainers
            }
            isShowRollback
            onClickRollback={handleRollback}
            fixedHeader
        >
            <div className='mt-header'>
            <SubHeader
                title={infoCollection?.companyName}
                desc={infoCollection?.siteName}
                svgIcon={<SkylineIcon />}
                dateTimeInfos={dateTimeInfos}
            />
            <FuncBlock
                leftChild={
                    <div className='flex items-center justify-between w-full'>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>作業内容</h2>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={openQRModal}
                                type='button'
                                className='flex justify-center items-center p-2 rounded bg-[var(--main-color)] text-white text-sm gap-2 w-20'
                            >
                                QR
                                <img src={iconQrCode} className='object-contain' alt='qrcode' />
                            </button>
                            {!isQR && <h2 className='text-white text-ssm mb-0 mr-1'>コンテナ変更</h2>}
                        </div>
                    </div>
                }
                isShowRightIcon={!isQR ? true : false}
                onClickIcon={() => setOpenModal(true)}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col bg-white'>
                    <div className='border-b-[6px] border-grayE9 p-4'>
                        <div className='flex items-center gap-3 mb-1'>
                            <div className='flex items-center gap-2'>
                                <div className='text-md text-green1A whitespace-nowrap'>種類</div>
                            </div>

                            <Controller
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        readOnly
                                        size='middle'
                                        className='!border-grayD4 container-input'
                                        prefix={<div className='hidden' />}
                                        suffix={
                                            field.value && (
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        setValue('containerTypeCd', null);
                                                        resetField('containerTypeName');
                                                    }}
                                                >
                                                    <img src={iconRedClear} alt='iconRedClear' />
                                                </button>
                                            )
                                        }
                                    />
                                )}
                                name='containerTypeName'
                                control={control}
                                defaultValue=''
                            />
                        </div>
                    </div>
                    {user.containerManagementType === 1 && (
                        <div className='border-b-[6px] border-grayE9 p-4'>
                            <div className='flex items-center gap-3 mb-1'>
                                <div className='flex items-center gap-2'>
                                    <div className='text-md text-green1A whitespace-nowrap'>
                                        台数
                                    </div>
                                </div>
                                <Controller
                                    render={({ field }) => (
                                        <InputNumber
                                            {...field}
                                            size='large'
                                            className='!border-grayD4 w-1/3 '
                                        />
                                    )}
                                    name='quantity'
                                    control={control}
                                />
                            </div>
                        </div>
                    )}
                    {user.containerManagementType === 2 && (
                        <div className='border-b-[6px] border-grayE9 p-4'>
                            <div className='flex items-center gap-3 mb-1'>
                                <div className='flex items-center gap-2'>
                                    <div className='text-md text-green1A whitespace-nowrap'>
                                        名称
                                    </div>
                                </div>
                                <Controller
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            readOnly
                                            size='middle'
                                            className='!border-grayD4 container-input'
                                            prefix={<div className='hidden' />}
                                            suffix={
                                                field.value && (
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            setValue('containerCd', null);
                                                            resetField('containerName');
                                                        }}
                                                    >
                                                        <img
                                                            src={iconRedClear}
                                                            alt='iconRedClear'
                                                        />
                                                    </button>
                                                )
                                            }
                                        />
                                    )}
                                    name='containerName'
                                    control={control}
                                    defaultValue=''
                                />
                            </div>
                        </div>
                    )}
                    <div className='flex items-center gap-3 p-4'>
                        <div className='text-md text-green1A whitespace-nowrap'>作業</div>
                        <Controller
                            control={control}
                            name='settingType'
                            render={({ field }) => (
                                <Radio.Group
                                    className='flex justify-between w-full'
                                    size='large'
                                    {...field}
                                >
                                    <Radio value={1} className='text-ssm whitespace-nowrap'>
                                        設置
                                    </Radio>
                                    <Radio value={2} className='text-ssm whitespace-nowrap'>
                                        引揚
                                    </Radio>
                                    <Radio value={9} className='text-ssm whitespace-nowrap'>
                                        未作業
                                    </Radio>
                                </Radio.Group>
                            )}
                        />
                    </div>
                </div>
                <div className='pb-7 pt-5'>
                    <Container>
                        <Button
                            className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center gap-3'
                            htmlType='submit'
                        >
                            登録
                            <img src={iconSubmit} alt='submit' />
                        </Button>
                    </Container>
                </div>
                {openModal && (
                    <ModalContainer
                        open={openModal}
                        setOpen={setOpenModal}
                        handleSelectItem={handleSelectModal}
                    />
                )}
                <Modal
                    title='QRスキャン'
                    style={{ width: '100%' }}
                    open={showQRModal}
                    footer={null}
                    onCancel={() => setShowQRModal(false)}
                >
                    <QrReader
                        constraints={constraints}
                        onResult={(result: any, error) => {
                            if (result) {
                                getValueContainerByQR(result?.text);
                            }
                        }}
                    />
                </Modal>
            </form>
            </div>
        </Layout>
    );
};
export default CollectionContainerInput;
