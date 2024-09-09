/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import { Button, Collapse, Input, InputNumber } from 'antd';
import Layout from 'components/templates/Layout';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';
import iconClock from 'assets/icons/ic_clock.svg';
import iconRedClear from 'assets/icons/ic_red_clear.svg';
import iconSearch from 'assets/icons/ic_search.svg';
import iconDelete from 'assets/icons/ic_delete.svg';
import iconSubmit from 'assets/icons/ic_submit.svg';
import iconWhiteDelete from 'assets/icons/ic-white-delete.svg';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import iconMSPPT from 'assets/icons/ic_ms_ppt.svg';
import iconMsWord from 'assets/icons/ic_ms_word.svg';
import iconMsExcel from 'assets/icons/ic_ms_excel.svg';
import iconDocumentTxt from 'assets/icons/ic_document_txt.svg';
import React, { useEffect, useRef, useState } from 'react';
import FuncBlock from 'components/common/FuncBlock';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { CONSTANT_ROUTE, STATUS_CODE, WEEKDAYLIST } from 'utils/constants';
import dayjs from 'dayjs';
import { useAppSelector } from 'store/hooks';
import { openConfirm, openInformation } from 'utils/functions';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Calendar from 'components/common/Calendar';
import './index.scss';
import {
    useDeleteReceiptRecordsMutation,
    useLazyGetReceiptRecordDetailQuery,
    usePostReceiptRecordsMutation,
    usePutReceiptRecordsMutation,
} from 'services/receiptRecords';
import Container from 'components/organisms/container';
import { UploadFile } from 'components/common/Files';
import { useLazyGetSizeUploadQuery } from 'services/settings';
import { ParamsReceiptRecordDetail } from 'models';
import ModalSelectProductHasSearchType from 'components/common/Modal/ModalSelectProductHasSearchType';
import CustomTimePicker from 'components/common/TimePicker';
import { FilterSvg } from 'components/icons/FilterSvg';
import { DownloadIcon } from 'components/icons/DownloadIcon';
import { UploadIcon } from 'components/icons/UploadIcon';
import ModalWorker from '../ModalWorker';

const FILE_ICON = {
    EXCEL: iconMsExcel,
    WORD: iconMsWord,
    NOTE: iconDocumentTxt,
    POWERPOINT: iconMSPPT,
};

const FILE_TYPE = {
    EXCEL: 'sheet',
    WORD: 'word',
    NOTE: 'text/plain',
    POWERPOINT: 'presentation',
};

const FILE_EXTENSION = {
    EXCEL: ['.xls', '.xlsx'],
    WORD: ['.doc', '.docx'],
    NOTE: ['.txt'],
    POWERPOINT: ['.ppt', '.pptx'],
};

interface IFormValue {
    orderType: number;
    slipSystemId: number;
    slipNumber: number;
    slipDate: string;
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    slipNote: string;
    temporaryNote: string;
    carrierCd: string;
    carrierName: string;
    vehicleCd: string;
    vehicleName: string;
    vehicleTypeCd: string;
    vehicleTypeName: string;
    driverCd: string;
    driverName: string;
    customerCd: string;
    customerName: string;
    salesPersonCd: string;
    salesPersonName: string;
    seq: number;
    workDate: string;
    workTime: string;
    workerCd: string;
    workerName: string;
    workNote: string;
    detailDtos: IDetailDtosValue[];
    fileDataDtos: IFileDataDtosValue[];
    timeStamp: string;
}

interface IDetailDtosValue {
    detailSystemId?: number;
    detailSeq: number;
    productCd: string;
    productName: string;
    quantity: number;
}

interface IFileDataDtosValue {
    fileId: number;
    fileName: string;
    fileExtention: string;
    fileLength: number;
}

const ReceiptRecordInput: React.FC = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [openModalProduct, setOpenModalProduct] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const [uploadedFile, setUploadedFile] = useState([]);
    const [filesData, setFilesData] = useState([]);
    const [params] = useSearchParams();
    const isDelete = params.get('isDelete');
    const orderType = params.get('orderType');
    const slipSystemId = params.get('slipSystemId');
    const seq = params.get('seq');

    const [isOpenSearchConditions, setIsOpenSearchConditions] = useState(false);
    const fixedElementRef = useRef();
    const collapsedElementRef = useRef();
    const contentElementRef = useRef();

    const [getMaxSize] = useLazyGetSizeUploadQuery();
    const [getReceiptRecordInput, responseGetReceiptRecordInput] =
        useLazyGetReceiptRecordDetailQuery();
    const [postReceiptRecords, responsePostReceiptRecords] = usePostReceiptRecordsMutation();
    const [putReceiptRecords, responsePutReceiptRecords] = usePutReceiptRecordsMutation();
    const [deleteReceiptRecords, responseDeleteReceiptRecords] = useDeleteReceiptRecordsMutation();

    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.RECEIPT_RECORD_INPUT],
    );
    const { user }: any = useAppSelector((state) => state.reducer.user);
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);

    const date = dayjs(new Date());

    const defaultValues: IFormValue = {
        orderType: orderType ? +orderType : 1,
        slipSystemId: slipSystemId ? +slipSystemId : 0,
        slipNumber: 0,
        slipDate: date.format('YYYY-MM-DD'),
        companyCd: null,
        companyName: null,
        siteCd: null,
        siteName: null,
        slipNote: null,
        temporaryNote: null,
        carrierCd: null,
        carrierName: null,
        vehicleCd: null,
        vehicleName: null,
        vehicleTypeCd: null,
        vehicleTypeName: null,
        driverCd: null,
        driverName: null,
        customerCd: null,
        customerName: null,
        salesPersonCd: null,
        salesPersonName: null,
        seq: null,
        workDate: date.format('YYYY-MM-DD'),
        workTime: date.format('HH:mm'),
        workerCd: user.employeeCd,
        workerName: user.employeeName,
        workNote: null,
        detailDtos: [],
        fileDataDtos: [],
        timeStamp: null,
    };

    const { control, watch, setValue, handleSubmit, reset } = useForm<IFormValue>({
        defaultValues,
    });
    const { fields, append } = useFieldArray({
        control,
        name: 'detailDtos',
    });

    const detailValues = useWatch({
        name: 'detailDtos',
        control,
    });

    const { fields: fieldsFileData, remove } = useFieldArray({
        control,
        name: 'fileDataDtos',
    });
    const fileDataDtos = watch('fileDataDtos');
    const workDateData = watch('workDate');
    const workTimeData = watch('workTime');

    useEffect(() => {
        const detailDtos = systemSetting?.productDefault.map((item, index) => {
            const detail: IDetailDtosValue = {
                detailSeq: index + 1,
                productCd: item.productCd,
                productName: item.productName,
                quantity: null,
            };
            return detail;
        });
        reset({ ...defaultValues, detailDtos });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleGetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGetData = async () => {
        let paramsRequest: ParamsReceiptRecordDetail = null;
        if (seq) {
            setIsEdit(true);
            paramsRequest = {
                seq: +seq,
            };
        }
        await getReceiptRecordInput({
            orderType: +orderType,
            slipSystemId: +slipSystemId,
            params: paramsRequest,
        }).unwrap();
    };

    useEffect(() => {
        if (
            responseGetReceiptRecordInput.data &&
            responseGetReceiptRecordInput.status === STATUS_CODE.fulfilled
        ) {
            if (responseGetReceiptRecordInput.data.fileDataDtos) {
                responseGetReceiptRecordInput.data.fileDataDtos?.forEach((element) => {
                    let icon;
                    if (FILE_EXTENSION.EXCEL.find((x) => x === element.fileExtention))
                        icon = FILE_ICON.EXCEL;
                    if (FILE_EXTENSION.WORD.find((x) => x === element.fileExtention))
                        icon = FILE_ICON.WORD;
                    if (FILE_EXTENSION.NOTE.find((x) => x === element.fileExtention))
                        icon = FILE_ICON.NOTE;
                    if (FILE_EXTENSION.POWERPOINT.find((x) => x === element.fileExtention))
                        icon = FILE_ICON.POWERPOINT;
                    const item = {
                        id: element.fileId,
                        name: element.fileName,
                        size: element.fileLength,
                        icon,
                    };
                    setFilesData((prev) => [...prev, item]);
                });
            }
            let workerCd: string;
            if (responseGetReceiptRecordInput.data.workerCd) {
                workerCd = responseGetReceiptRecordInput.data.workerCd;
            }

            let workerName: string;
            if (responseGetReceiptRecordInput.data.workerName) {
                workerName = responseGetReceiptRecordInput.data.workerName;
            }

            let workDate: string;
            if (responseGetReceiptRecordInput.data.workDate) {
                workDate = dayjs(responseGetReceiptRecordInput.data.workDate).format('YYYY-MM-DD');
            }

            let workTime: string;
            if (responseGetReceiptRecordInput.data.workTime) {
                workTime = responseGetReceiptRecordInput.data.workTime?.slice(0, 5);
            }

            if (!isEdit) {
                const detailDtos = systemSetting?.productDefault.map((item, index) => {
                    const detail: IDetailDtosValue = {
                        detailSeq: index + 1,
                        productCd: item.productCd,
                        productName: item.productName,
                        quantity: null,
                    };
                    return detail;
                });
                const receiptRecordData: any = {
                    ...responseGetReceiptRecordInput.data,
                    workerCd: workerCd ? workerCd : user.employeeCd,
                    workerName,
                    workDate: workDate ? workDate : date.format('YYYY-MM-DD'),
                    workTime,
                    detailDtos,
                };
                reset(receiptRecordData);
            } else {
                const receiptRecordData: any = {
                    ...responseGetReceiptRecordInput.data,
                    workerCd: workerCd ? workerCd : user.employeeCd,
                    workerName,
                    workDate: workDate ? workDate : date.format('YYYY-MM-DD'),
                    workTime,
                };
                reset(receiptRecordData);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responseGetReceiptRecordInput]);

    useEffect(() => {
        calculateTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailValues]);

    const calculateTotal = () => {
        const totalItems = detailValues?.reduce((total, value) => total + value.quantity, 0);
        setTotalQuantity(totalItems);
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

    const handleSelectReceiptDate = (item: any) => {
        setValue('workDate', dayjs(item).format('YYYY-MM-DD'));
    };

    const handleClickInputTimePicker = (e) => {
        if (e.target.tagName === 'BUTTON') {
            return;
        }
        setOpenTimePicker(true);
    };

    const handleSelectTime = (t) => {
        setValue('workTime', t);
    };

    const handleSelectModal = (d) => {
        setValue('workerCd', d.cd);
        setValue('workerName', d.name);
        setOpenModal(false);
    };

    const handleSelectModalProduct = (d) => {
        append({
            detailSeq: fields.length + 1,
            productCd: d.productCd,
            productName: d.productName,
            quantity: null,
        });
        setOpenModalProduct(false);
    };

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
            const files = [...filesData, file];
            setFilesData(files);
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
            const fileUpdate = filesData.filter((file) => file.id !== fileId);
            if (Number.isInteger(fileId)) {
                const index = fileDataDtos.findIndex((file) => file.fileId === +fileId);
                remove(index);
            } else {
                const updatedFiles = uploadedFile.filter((file) => file.id !== fileId);
                setUploadedFile(updatedFiles);
            }
            setFilesData(fileUpdate);
        }
    };

    const onSubmit = (data: any) => {
        if (fields.length === 0) {
            openInformation({
                content: (
                    <div className='text-center text-ssm font-bold'>品名は選択してください</div>
                ),
            });
        } else if (totalQuantity !== 100) {
            openInformation({
                content: (
                    <div className='text-center text-ssm font-bold'>
                        数量割合の合計値が不正です。
                    </div>
                ),
            });
        } else if (isDelete) {
            openConfirm({
                content: (
                    <div className='flex justify-center items-center mt-3 text-xl font-semibold text-red2a text-center w-full mb-4'>
                        <div>
                            受入実績データを削除しますか？
                            <br />
                            ※削除後は、データを元に戻す事はできません
                        </div>
                    </div>
                ),
                onOk: () => {
                    deleteReceiptRecord(data);
                },
            });
        } else {
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
                        updateReceiptRecord(data);
                    } else {
                        insertReceiptRecord(data);
                    }
                },
            });
        }
    };

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

    const insertReceiptRecord = async (data: IFormValue) => {
        try {
            const body = jsonToFormData(data, uploadedFile);
            const response: any = await postReceiptRecords({
                orderType: +orderType,
                slipSystemId: +slipSystemId,
                body,
            });
            if (response && !response.error) {
                // success
                handleClickRollBack();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateReceiptRecord = async (data: IFormValue) => {
        try {
            const body = jsonToFormData(data, uploadedFile);
            const response: any = await putReceiptRecords({
                orderType: +orderType,
                slipSystemId: +slipSystemId,
                seq: +seq,
                body,
            });
            if (response && !response.error) {
                // success
                handleClickRollBack();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteReceiptRecord = async (data: IFormValue) => {
        try {
            const body = {
                timeStamp: data.timeStamp,
            };
            const response: any = await deleteReceiptRecords({
                orderType: +orderType,
                slipSystemId: +slipSystemId,
                seq: +seq,
                body,
            });
            if (response && !response.error) {
                // success
                handleClickRollBack();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleWeighingInfo = () => {
        navigate(`/${CONSTANT_ROUTE.WEIGHING_INFORMATION_SELECTION}`);
    };

    const handleChangeCollapse = (tabActive) => {
        setTimeout(() => {
            if (tabActive?.length > 0) {
                setIsOpenSearchConditions(true);
                window.scrollTo(0, 0);
            } else {
                setIsOpenSearchConditions(false);
            }
        }, 0);
    };

    useEffect(() => {
        const functionHandleScroll = ($event) => {
            checkStyleElement();
        };

        window.addEventListener('scroll', functionHandleScroll);
        return () => {
            window.removeEventListener('scroll', functionHandleScroll);
        };
    }, []);

    useEffect(() => {
        checkStyleElement();
    }, [isOpenSearchConditions]);

    const checkStyleElement = () => {
        const { documentElement } = document;
        if (fixedElementRef.current && collapsedElementRef.current && contentElementRef.current) {
            const collapsed = collapsedElementRef.current as HTMLElement; // Collapse
            const elementFixedOnScroll = fixedElementRef.current as HTMLElement; // Element cần cố định khi scroll
            const content = contentElementRef.current as HTMLElement; // Danh sách || nội dung || dữ liệu trang

            if (collapsed.classList.contains('opening')) {
                // Collapse OPEN
                if (documentElement.scrollTop >= 459) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '159px';
                    elementFixedOnScroll.style.zIndex = '10';
                    elementFixedOnScroll.style.borderTop = '1px solid white';
                    content.style.marginTop = '47px';
                } else {
                    elementFixedOnScroll.style.position = 'unset';
                    elementFixedOnScroll.style.borderTop = 'none';
                    content.style.marginTop = 'unset';
                }
            } else {
                // Collapse CLOSE
                elementFixedOnScroll.style.position = 'fixed';
                elementFixedOnScroll.style.width = '100%';
                elementFixedOnScroll.style.top = '159px';
                elementFixedOnScroll.style.zIndex = '10';
                elementFixedOnScroll.style.borderTop = '1px solid white';
                content.style.marginTop = '204px';
            }
        }
    };

    const handleClickRollBack = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.WEIGHING_INFORMATION_SELECTION}`);
    };

    return (
        <Layout
            title='受入実績登録'
            isShowDate={false}
            isLoading={
                responseGetReceiptRecordInput.isLoading ||
                responseGetReceiptRecordInput.isFetching ||
                responsePostReceiptRecords.isLoading ||
                responsePutReceiptRecords.isLoading ||
                responseDeleteReceiptRecords.isLoading ||
                isLoadingDownload
            }
            isShowRollback
            fixedHeader
            onClickRollback={handleClickRollBack}
        >
            <Collapse
                defaultActiveKey={null}
                expandIconPosition='end'
                onChange={($event) => handleChangeCollapse($event)}
                ref={collapsedElementRef}
                className={`border !border-green15 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:top-header 
                    [&_.ant-collapse-header]:bg-green15 
                    [&_.ant-collapse-header]:w-full 
                    [&_.ant-collapse-header]:z-10
                    [&_.ant-collapse-header]:!p-[8px_16px]
                    [&_.ant-collapse-header]:left-0
                    [&_.ant-collapse-content-box]:!p-0
                    [&_.ant-collapse-content]:!rounded-none
                    [&_.ant-collapse-header]:!transition-none
                    [&_.ant-collapse-header]:!rounded-none
                    sitenote-collapse ${
                        isOpenSearchConditions
                            ? `
                           opening 
                       [&_.ant-collapse-content]:mt-[157px]
                       `
                            : ``
                    }`}
                expandIcon={({ isActive }) =>
                    isActive ? (
                        <div className='w-5 h-5'>
                            <img src={iconChevronUp} className='w-full h-full' alt='info' />
                        </div>
                    ) : (
                        <div className='w-5 h-5'>
                            <img src={iconChevronDown} className='w-full h-full' alt='info' />
                        </div>
                    )
                }
                items={[
                    {
                        key: '1',
                        label: (
                            <span className='font-semibold text-white text-md mb-0 mr-3'>
                                受入伝票情報
                            </span>
                        ),
                        className: 'collapse-panel-custom',
                        children: isOpenSearchConditions && (
                            <div className='flex flex-col'>
                                <div className=''>
                                    <div className='bg-white shadow-md w-full py-4'>
                                        {/* info */}
                                        <div className='flex items-center gap-3 relative px-4 h-full'>
                                            <div className='w-full grid gap-y-2'>
                                                <div className='grid grid-cols-2 '>
                                                    <div className='grid grid-cols-[81px_auto] gap-2'>
                                                        <div className='text-gray68 text-sm'>
                                                            伝票種類 :
                                                        </div>
                                                        <div className='text-sm text-black27 truncate w-full'>
                                                            {watch('orderType') === 1
                                                                ? '計量'
                                                                : watch('orderType') === 2
                                                                ? '受入'
                                                                : ''}
                                                        </div>
                                                    </div>
                                                    <div className='grid grid-cols-[81px_auto] gap-2'>
                                                        <div className='text-gray68 text-sm'>
                                                            伝票番号:
                                                        </div>
                                                        <div className='text-sm text-black27 truncate w-full'>
                                                            {watch('slipNumber')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        伝票日付 :
                                                    </div>
                                                    <div className='text-sm text-black27 truncate w-full'>
                                                        {dayjs(watch('slipDate')).format(
                                                            'YYYY/MM/DD',
                                                        )}
                                                        (
                                                        {
                                                            WEEKDAYLIST[
                                                                dayjs(watch('slipDate')).format('d')
                                                            ]
                                                        }
                                                        )
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        業者名　 :
                                                    </div>
                                                    <div className='text-sm text-black27 w-full truncate'>
                                                        {watch('companyName')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        現場名　 :
                                                    </div>
                                                    <div className='text-sm text-black27 w-full truncate'>
                                                        {watch('siteName')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        伝票備考 :
                                                    </div>
                                                    <div className='text-sm text-black27 w-full truncate'>
                                                        {watch('slipNote')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        滞留備考 :
                                                    </div>
                                                    <div className='text-sm text-black27 w-full truncate'>
                                                        {watch('temporaryNote')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        運搬業者 :
                                                    </div>
                                                    <div className='text-sm text-black27 truncate w-full'>
                                                        {watch('carrierName')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        車輌名　 :
                                                    </div>
                                                    <div className='text-sm text-black27 truncate w-full'>
                                                        {watch('vehicleName')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        車種名　 :
                                                    </div>
                                                    <div className='text-sm text-black27 truncate w-full'>
                                                        {watch('vehicleTypeName')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        運転者　 :
                                                    </div>
                                                    <div className='text-sm text-black27 truncate w-full'>
                                                        {watch('driverName')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        取引先名 :
                                                    </div>
                                                    <div className='text-sm text-black27 w-full truncate'>
                                                        {watch('customerName')}
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[81px_auto]  gap-2'>
                                                    <div className='text-gray68 text-sm'>
                                                        営業担当 :
                                                    </div>
                                                    <div className='text-sm text-black27 w-full truncate'>
                                                        {watch('salesPersonName')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
            <div ref={fixedElementRef}>
                <FuncBlock
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>作業情報</h2>
                        </div>
                    }
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} ref={contentElementRef}>
                {isDelete && (
                    <div className='flex justify-between items-center p-4 py-3'>
                        <div className='text-sm text-black11'>作業日: </div>
                        <div className='flex items-center'>
                            <div className='flex items-center pr-2 border-r-2 border-grayD4 text-md'>
                                <img src={iconCalendar} alt='iconCalendar' className='mr-2' />
                                {dayjs(workDateData).format('YYYY/MM/DD')}
                            </div>
                            <div className='flex items-center pl-2 text-md'>
                                <img src={iconClock} alt='iconClock' className='mr-2' />
                                {workTimeData}
                            </div>
                        </div>
                    </div>
                )}

                <div className='bg-white'>
                    {!isDelete && (
                        <div className='border-b-[6px] mt-[1px] border-grayE9'>
                            <Calendar
                                defaultDate={workDateData || null}
                                selectedDate={workDateData}
                                handleSelectDate={handleSelectReceiptDate}
                            />
                            <div className='flex items-center gap-2 border-t border-grayE9 px-4 py-4'>
                                <div className='text-md text-green1A whitespace-nowrap min-w-[60px] md:min-w-[112px]'>
                                    時 刻
                                </div>
                                <div
                                    className='w-[130px] '
                                    onClick={(e) => {
                                        handleClickInputTimePicker(e);
                                    }}
                                    role='button'
                                >
                                    <Controller
                                        control={control}
                                        name='workTime'
                                        render={({ field }) => (
                                            <Input
                                                className='h-input-default disabled-bg-white'
                                                {...field}
                                                disabled
                                                prefix={
                                                    <img src={iconClock} alt='icon input search' />
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='flex items-center gap-2 border-b border-grayE9 p-4'>
                        <div className='text-md text-green1A whitespace-nowrap md:min-w-[112px]'>
                            作業者
                        </div>
                        <Controller
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    readOnly
                                    size='middle'
                                    className='!border-grayD4'
                                    onChange={handleSubmit(onSubmit)}
                                    prefix={
                                        <div className='w-5 h-5'>
                                            <img
                                                src={iconSearch}
                                                className='w-full h-full object-cover'
                                                alt='iconSearch'
                                            />
                                        </div>
                                    }
                                    suffix={
                                        field.value &&
                                        !isDelete && (
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    setValue('workerName', '');
                                                    setValue('workerCd', '');
                                                }}
                                            >
                                                <img src={iconRedClear} alt='iconRedClear' />
                                            </button>
                                        )
                                    }
                                />
                            )}
                            name='workerName'
                            control={control}
                            defaultValue=''
                        />
                        {!isDelete && (
                            <Button
                                onClick={() => setOpenModal(true)}
                                className='border-green15 min-w-[40px]'
                                icon={
                                    <div className='w-6 h-6'>
                                        <FilterSvg className='w-full h-full object-cover' />
                                    </div>
                                }
                                size='large'
                            />
                        )}
                    </div>

                    <div className='p-4'>
                        <div className='text-md text-green1A mb-1'>
                            作業備考<span className='text-black52'>（20文字以内）</span>
                        </div>
                        <Controller
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    maxLength={20}
                                    size='middle'
                                    allowClear={{
                                        clearIcon: (
                                            <div className='w-5 h-5'>
                                                <img
                                                    className='w-full h-full object-cover'
                                                    src={iconRedClear}
                                                    alt='iconRedClear'
                                                />
                                            </div>
                                        ),
                                    }}
                                    readOnly={isDelete === 'true'}
                                    className='!border-grayD4'
                                />
                            )}
                            name='workNote'
                            control={control}
                            defaultValue=''
                        />
                    </div>
                </div>
                <FuncBlock
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>品名情報</h2>
                            <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold'>
                                {fields ? fields?.length : 0}
                            </span>
                        </div>
                    }
                    isShowRightIcon={!isDelete ? true : false}
                    onClickIcon={() => setOpenModalProduct(true)}
                />
                {fields?.length > 0 && (
                    <div className='flex flex-col'>
                        <div className='p-4'>
                            <div className='bg-white rounded-lg shadow-md w-fullmb-4'>
                                {/* info */}
                                <div className='flex items-center gap-3 relative h-full'>
                                    <div className='w-full font-semibold'>
                                        <div className='grid grid-cols-2 bg-[var(--main-color-light)] rounded-t-lg'>
                                            <div className='border-[#EEEEEE] border-r p-2 text-white text-sm'>
                                                品名
                                            </div>
                                            <div className='p-2 text-white text-sm'>
                                                数量割合（％）
                                            </div>
                                        </div>
                                        {fields?.length > 0 &&
                                            fields.map((item, index) => (
                                                <div
                                                    className={`grid grid-cols-2 border-b border-[#EEEEEE] ${
                                                        index % 2 === 0
                                                            ? 'bg-white'
                                                            : 'bg-[#F9F9F9]'
                                                    }`}
                                                    key={item.id}
                                                >
                                                    <div className='text-gray3C text-sm border-[#EEEEEE] border-r p-2 truncate'>
                                                        {item.productName}
                                                    </div>
                                                    <div>
                                                        <Controller
                                                            render={({ field }) => (
                                                                <InputNumber
                                                                    {...field}
                                                                    size='large'
                                                                    bordered={false}
                                                                    className='w-full h-full input-quantity'
                                                                    onBlur={calculateTotal}
                                                                    onPressEnter={calculateTotal}
                                                                    readOnly={isDelete === 'true'}
                                                                    maxLength={3}
                                                                />
                                                            )}
                                                            name={`detailDtos.${index}.quantity`}
                                                            control={control}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        <div className='grid grid-cols-2 rounded-b-lg'>
                                            <div className='text-sm text-white bg-[var(--main-color-light)] p-2 rounded-bl-lg'>
                                                数量割合合計
                                            </div>
                                            <div
                                                className={`text-sm ${
                                                    totalQuantity !== 100
                                                        ? 'text-red2a'
                                                        : 'text-gray3C'
                                                } truncate w-full bg-[var(--main-color-lighter)] p-2 rounded-br-lg`}
                                            >
                                                {totalQuantity}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {fields?.length === 0 && <div className='border border-white' />}

                <div className='w-full px-4  py-2 flex justify-between items-center bg-green15 receipt-upload'>
                    <div className='flex items-center'>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>添付ファイル</h2>
                    </div>

                    {isDelete !== 'true' && (
                        <UploadFile onFileUpload={handleFileUpload} accept='image/*,.pdf'>
                            <div role='button' className='bg-white rounded-full w-8 h-8'>
                                <UploadIcon className='w-full h-full object-cover p-2' />
                            </div>
                        </UploadFile>
                    )}
                </div>
                <div className='p-3'>
                    {filesData?.length > 0 &&
                        filesData.map((file) => (
                            <div
                                key={file.id}
                                className='upload-file w-full rounded flex justify-between gap-1 py-1'
                            >
                                <div className='flex items-center gap-1 text-sm w-[80%] h-[50px] bg-white pl-2'>
                                    <img src={file.icon} alt='' />
                                    <span className='truncate'>{file.name}</span>
                                </div>
                                <div className='flex gap-1 h-[50px] bg-white p-1 items-center'>
                                    <button type='button' onClick={() => handleDownload(file)}>
                                        <DownloadIcon className='' />
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => handleDeleteFile(file.id)}
                                        disabled={isDelete === 'true'}
                                    >
                                        <img src={iconDelete} alt='delete' />
                                    </button>
                                </div>
                            </div>
                        ))}

                    {filesData?.length === 0 && (
                        <p className='font-medium text-lg text-yellow-600 tracking-wide'>
                            添付ファイルはありません
                        </p>
                    )}
                </div>
                {!isDelete && (
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
                )}

                {isDelete && (
                    <div className='pb-7 pt-5'>
                        <Container>
                            <Button
                                className='bg-red2a text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center gap-3 btn-receipt'
                                htmlType='submit'
                            >
                                削除
                                <img src={iconWhiteDelete} alt='submit' />
                            </Button>
                        </Container>
                    </div>
                )}
                {openModal && (
                    <ModalWorker
                        open={openModal}
                        setOpen={setOpenModal}
                        handleSelectItem={handleSelectModal}
                    />
                )}
                {openModalProduct && (
                    <ModalSelectProductHasSearchType
                        open={openModalProduct}
                        setOpen={setOpenModalProduct}
                        handleSelectItem={handleSelectModalProduct}
                    />
                )}

                <CustomTimePicker
                    defaultTime={watch('workTime')}
                    open={openTimePicker}
                    setOpen={setOpenTimePicker}
                    handleSelect={handleSelectTime}
                />
            </form>
        </Layout>
    );
};
export default ReceiptRecordInput;
