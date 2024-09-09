/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Input, Modal, Select, Form, Button } from 'antd';
import iconGrayClock from 'assets/icons/ic_gray_clock.svg';
import iconRedDelete from 'assets/icons/ic-red-delete.svg';
import iconWhiteDown from 'assets/icons/ic_white_down.svg';
import iconWhiteSend from 'assets/icons/ic_white_send.svg';
import FuncBlock from 'components/common/FuncBlock';
import SubHeader from 'components/organisms/SubHeader';
import Container from 'components/organisms/container';
import Layout from 'components/templates/Layout';
import { CollectionDetail, ICollectionPrint, IProductTypes, Product, UnitsResponse } from 'models';
import useDeviceSize from 'components/templates/hooks/useDeviceSize';
import React, { useEffect, useRef, useState } from 'react';
import {
    setCacheCollectedQuantityInput,
    useLazyGetCollectionBySeqNoQuery,
    useLazyGetCollectionPrintInfoQuery,
    useLazyGetSignatureCollectionQuery,
    useUpdateCollectionBySeqNoMutation,
} from 'services/collection';
import {
    useLazyGetProductsWithTypeQuery,
    useLazyGetTypeProductsQuery,
    useLazyGetUnitsQuery,
} from 'services/product';
import { useGetQuantityFormatQuery } from 'services/settings';
// eslint-disable-next-line import/no-extraneous-dependencies
import './index.scss';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
    CONSTANT_ROUTE,
    SPOT_CONVERT,
    STATUS_CODE,
    WORK_LINE_VOUCHER_SETTING,
} from 'utils/constants';
import { useAppSelector } from 'store/hooks';
import { v4 as uuidv4 } from 'uuid';
import { openConfirm, openInformation, showErrorToast } from 'utils/functions';
import { endPrint, startPrint } from 'services/print/print';
import { IResponsePrint } from 'models/print';
import { useDispatch } from 'react-redux';
import { convertPackageQuantity, convertQuantityCollection } from 'utils/number';
import { ModalSelectProduct } from 'components/common/Modal';
import CustomTimePicker from 'components/common/TimePicker';
import { setPreviousPage } from 'services/page';
import { useLazyGetAllPackagingsQuery } from 'services/packagings';
import SelectValueModalDefault from 'components/common/Modal/SelectValueModalDefault';
import { CalendarIcon } from 'components/icons/CalendarIcon';
import { SaveIcon } from 'components/icons/SaveIcon';
import { SkylineIcon } from 'components/icons/SkylineIcon';
import { EditIcon } from 'components/icons/EditIcon';
import { CloseIcon } from 'components/icons/CloseIcon';
import { blobToBase64, openFileInNewTab } from 'utils/file';
import { useLazyGetFileQuery } from 'services/files';
import sendMessagePrintCollection from 'services/print/handle-print-by-passPrnt';
import ModalInputSignature from './ModalInputSignature';

const initPaginationProductType = {
    SearchText: '',
    PageNumber: 1,
    PageSize: 10,
};

const initPaginationProductHaveType = {
    productTypeCd: '',
    SearchText: '',
    PageNumber: 1,
    PageSize: 10,
};

const CollectedQuantity: React.FC = () => {
    const location = useLocation();
    const systemSetting = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);
    const convertedPackagingSetting =
        systemSetting?.collectionResultInputSetting.convertedPackagingSetting;

    const [isInputPackage, setIsInputPackage] = useState(false);
    const isPrintAfterUpdateSuccess =
        systemSetting.workLineVoucherSetting === WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT;
    const isPrintWithSignatureAfterUpdateSuccess =
        systemSetting.workLineVoucherSetting ===
        WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT_WITH_SIGNATURE;
    const isPrintCopy = systemSetting.isPrintCopy;
    const isViewPdfAfterUpdateSuccess =
        systemSetting?.workLineVoucherSetting === WORK_LINE_VOUCHER_SETTING.DISPLAY_PDF;
    const [getPrintInfo, responseGetPrintInfo] = useLazyGetCollectionPrintInfoQuery();
    const dispatch = useDispatch();
    const [numberCount, setCountNumber] = useState(0);
    const deviceType = useDeviceSize();
    const currentTime = dayjs().format('HH:mm');

    const [typeTitle, setTypeTitle] = useState('');
    const [searchType, setSearchType] = useState('');

    const [openModalSelectProduct, setOpenModalSelectProduct] = useState(false);
    const [openModalProductType, setOpenModalProductType] = useState(false);
    const [openProductHaveType, setOpenProductHaveType] = useState(false);
    const [openModalSignature, setOpenModalSignature] = useState(false);

    const [paginationProductType, setPaginationProductType] = useState(initPaginationProductType);
    const [paginationProductHaveType, setPaginationProductHaveType] = useState(
        initPaginationProductHaveType,
    );
    const [listProductTypeState, setListProductTypeState] = useState<IProductTypes[]>([]);
    const [listProductsWithTypeState, setListProductsWithTypeState] = useState<Product[]>([]);
    const refSignature: { current: { setSignature: any } } = useRef();
    const [getSignatureCollection, responseGetSignatureCollection] =
        useLazyGetSignatureCollectionQuery();

    const [openChangeTime, setOpenChangeTime] = useState(false);
    const [isCreateNew, setCreateNew] = useState(false);
    const [form] = Form.useForm();
    const [isEdit, setEdit] = useState(false);
    const [time, setTime] = useState(currentTime);
    const [listCollectionState, setListCollectionState] = useState<any[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const maxValueInput = 999999999;
    const maxValueInputPackagingQuantity = 99999;

    const [formState, setFormState] = useState<CollectionDetail>();
    const [getUnits, { data: unitList }] = useLazyGetUnitsQuery();
    const [getAllPackings, { data: packagingList }] = useLazyGetAllPackagingsQuery();
    const [updateCollectionBySeqNo, responseUpdateCollectionBySeqNo] =
        useUpdateCollectionBySeqNoMutation();
    const { data: formatQuantity } = useGetQuantityFormatQuery();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const arrNumber = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 190];
    const seqNo = searchParams.get('seqNo');
    const isViewOnly = searchParams.get('viewOnly') == 'true' ? true : false;
    const [getCollectionBySeqNo, { data: collectionBySeqNo, isLoading: isLoadingData }] =
        useLazyGetCollectionBySeqNoQuery();
    const [getFile, responseGetFile] = useLazyGetFileQuery();

    const [
        getProductType,
        {
            data: productTypeList,
            isLoading: isLoadingGetProductTypes,
            isFetching: isFetchingGetProductTypes,
        },
    ] = useLazyGetTypeProductsQuery();

    const [
        getProductsWithType,
        {
            data: productsWithTypeList,
            isLoading: isLoadingGetProductsWType,
            isFetching: isFetchingGetProductsWType,
        },
    ] = useLazyGetProductsWithTypeQuery();

    const [signatureObj, setSignatureObj] = useState({
        url: '',
        blob: null,
        file: null,
    });

    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.COLLECTED_SUMMARY],
    );

    const previousUrlWhenUpdateSuccess = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.WORK_SELECTION] || previousUrl,
    );

    const cacheCollectedQuantityInput = useAppSelector(
        (state) => state.reducer.collection.collectedQuantityInput,
    );

    const settingProductType: any = useAppSelector(
        (state) => state.reducer.systemSetting?.systemSetting?.settingProductType,
    );

    useEffect(() => {
        getCollectionBySeqNo({
            seqNo: +seqNo,
        });

        getSignatureCollection({
            seqNo: +seqNo,
        });

        getUnits().unwrap();
        if (convertedPackagingSetting === SPOT_CONVERT.PACKAGE_QUANTITY) {
            getAllPackings();
        }
    }, []);

    useEffect(() => {
        if (productTypeList) {
            setListProductTypeState(productTypeList.items);
        }
        if (productsWithTypeList) {
            setListProductsWithTypeState(productsWithTypeList.items);
        }
    }, [productTypeList, productsWithTypeList]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = 'このページを離れてもよろしいですか?';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (
            collectionBySeqNo?.operationTime === null ||
            collectionBySeqNo?.operationTime === undefined ||
            collectionBySeqNo?.operationTime === ''
        ) {
            setTime(currentTime);
        } else {
            setTime(dayjs(collectionBySeqNo?.operationTime).format('HH:mm') || currentTime);
        }

        if (
            collectionBySeqNo &&
            collectionBySeqNo?.sourceCd == 1 &&
            convertedPackagingSetting === SPOT_CONVERT.PACKAGE_QUANTITY
        ) {
            setIsInputPackage(true);
        }
    }, [collectionBySeqNo]);

    useEffect(() => {
        if (cacheCollectedQuantityInput?.seqNo === seqNo) {
            setCreateNew(cacheCollectedQuantityInput.isCreateNew);
            setEdit(cacheCollectedQuantityInput.isEdit);

            setFormState(cacheCollectedQuantityInput.formState);
            setListCollectionState(cacheCollectedQuantityInput.listCollectionState);
            setCountNumber(cacheCollectedQuantityInput.listCollectionState.length || 0);
            setTime(cacheCollectedQuantityInput?.time || currentTime);

            if (cacheCollectedQuantityInput.formState) {
                form.setFieldsValue({ ...cacheCollectedQuantityInput.formState });
            }
        } else if (collectionBySeqNo?.collectionDetails?.length > 0 && formatQuantity) {
            const listCollectionConvert = collectionBySeqNo?.collectionDetails?.map((value) => ({
                ...value,
                quantity: convertQuantityCollection(value?.quantity, formatQuantity),
                convertedQuantity: convertQuantityCollection(
                    value?.convertedQuantity,
                    formatQuantity,
                ),

                packagingQuantity: convertPackageQuantity(value?.packagingQuantity),
            }));
            setCountNumber(listCollectionConvert.length);
            setListCollectionState(listCollectionConvert);
        }
    }, [collectionBySeqNo, collectionBySeqNo?.collectionDetails, formatQuantity]);

    useEffect(() => {
        if (openModalSelectProduct || openModalProductType || openProductHaveType || isEdit) {
            try {
                // if (openModalSelectProduct) {
                //     getProducts(paginations).unwrap();
                // }
                if (openModalProductType) {
                    getProductType(paginationProductType).unwrap();
                }
                if (openProductHaveType) {
                    getProductsWithType(paginationProductHaveType).unwrap();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [openModalSelectProduct, openModalProductType, openProductHaveType, isEdit]);

    useEffect(() => {
        window.addEventListener('error', (e) => {
            if (e.message === 'ResizeObserver loop limit exceeded') {
                const resizeObserverErrDiv = document.getElementById(
                    'webpack-dev-server-client-overlay-div',
                );
                const resizeObserverErr = document.getElementById(
                    'webpack-dev-server-client-overlay',
                );
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute('style', 'display: none');
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute('style', 'display: none');
                }
            }
        });
    }, []);

    useEffect(() => {
        if (
            responseGetSignatureCollection.status === STATUS_CODE.fulfilled &&
            responseGetSignatureCollection.data
        ) {
            if (
                responseGetSignatureCollection.data &&
                responseGetSignatureCollection.data?.size !== 0
            ) {
                convertBlobSignatureToBase64(responseGetSignatureCollection.data);
            }
        }
    }, [responseGetSignatureCollection]);

    const convertBlobSignatureToBase64 = async (blob) => {
        const base64: any = await blobToBase64(blob);
        setSignatureObj({
            url: base64,
            blob,
            file: null,
        });
    };

    const handleSelectSignature = (signature: { url: string; file: any; blob: any }) => {
        setOpenModalSignature(null);
        setSignatureObj(signature);
    };

    const handleSetSignatureOfModal = () => {
        if (refSignature.current) {
            if (signatureObj.url) {
                refSignature.current.setSignature(signatureObj.url);
            }
        }
    };

    const handleBlurInput = (event) => {
        if (event.target.value < maxValueInput) {
            const newVal: any = convertQuantityCollection(event.target.value, formatQuantity);
            setFormState((prev: any) => ({ ...prev, quantity: newVal }));
            form.setFieldValue('quantity', newVal);
        } else {
            const newVal: any = convertQuantityCollection(maxValueInput, formatQuantity);
            setFormState((prev: any) => ({ ...prev, quantity: newVal }));
            form.setFieldValue('quantity', newVal);
        }
    };

    const handleBlurConvertInput = (event) => {
        if (event.target.value < maxValueInput) {
            const newVal: any = convertQuantityCollection(event.target.value, formatQuantity);
            setFormState((prev: any) => ({ ...prev, convertedQuantity: newVal }));
            form.setFieldValue('convertedQuantity', newVal);
        } else {
            const newVal: any = convertQuantityCollection(maxValueInput, formatQuantity);
            setFormState((prev: any) => ({ ...prev, convertedQuantity: newVal }));
            form.setFieldValue('convertedQuantity', newVal);
        }
    };

    const handleBlurPackagingQuantityInput = (event) => {
        if (!Number(event.target.value)) {
            setFormState((prev: any) => ({ ...prev, packagingQuantity: '' }));
            form.setFieldValue('packagingQuantity', '');
        } else if (Number(event.target.value) < maxValueInputPackagingQuantity) {
            const newVal: any = convertPackageQuantity(event.target.value);
            setFormState((prev: any) => ({ ...prev, packagingQuantity: newVal }));
            form.setFieldValue('packagingQuantity', newVal);
        } else {
            const newVal: any = convertPackageQuantity(maxValueInputPackagingQuantity);
            setFormState((prev: any) => ({ ...prev, packagingQuantity: newVal }));
            form.setFieldValue('packagingQuantity', newVal);
        }
    };
    const onUpdateCollection = async () => {
        const dateCollection = dayjs(collectionBySeqNo?.collectionDate).format('YYYY-MM-DD');
        const operationTime = `${dateCollection}T${time}:00`;

        const collectionDetails = listCollectionState.map((collection) => ({
            rowNo: collection?.rowNo ?? null,
            productCd: collection?.productCd,
            quantity: collection?.quantity?.replaceAll(',', ''),
            unitCd: collection?.unitCd,
            convertedQuantity:
                collection?.convertedQuantity !== undefined && collection?.convertedQuantity !== ''
                    ? collection?.convertedQuantity.replaceAll(',', '')
                    : null,
            convertedUnitCd: collection?.convertedUnitCd ?? null,
            packagingCd: collection.packagingCd,
            packagingName: collection.packagingName,
            packagingQuantity:
                collection?.packagingQuantity !== undefined && collection?.packagingQuantity !== ''
                    ? collection?.packagingQuantity.replaceAll(',', '')
                    : null,
            maniPatternSystemId: collection.maniPatternSystemId,
            jwnetFlg: collection.jwnetFlg || false,
            timeStamp: collection?.timeStamp ?? null,
        }));

        if (!collectionDetails || collectionDetails.length === 0) {
            openInformation({
                content: (
                    <div className='text-center text-ssm font-bold'>
                        回収品名が入力されていません。
                    </div>
                ),
            });
            return;
        }

        const isHasEmptyQuantity = collectionDetails.some(
            (e) => e.quantity === '' || e.quantity === null || e.quantity === undefined,
        );
        if (isHasEmptyQuantity) {
            openInformation({
                content: (
                    <div className='text-center text-ssm font-bold'>
                        数量は必須項目です。入力してください。
                    </div>
                ),
            });
            return;
        }

        const dataDto = {
            collectionDate: collectionBySeqNo?.collectionDate,
            operationTime: operationTime || collectionBySeqNo?.operationTime,
            timeStamp: collectionBySeqNo?.timeStamp,
            collectionDetails,
            convertedPackagingSetting,
        };

        const formData = new FormData();
        formData.append('DataDto', JSON.stringify(dataDto));

        formData.append('PostedFile', signatureObj.blob || null);
        if (isViewPdfAfterUpdateSuccess) {
            onUpdateCollectionCaseViewPDF(formData);
        } else if (isPrintAfterUpdateSuccess || isPrintWithSignatureAfterUpdateSuccess) {
            onUpdateCollectionCasePrint(formData);
        } else {
            try {
                const response: any = await handleCallApiUpdateCollection(formData);
                navigateWhenUpdateSuccess();
            } catch (error) {
                //
            }
        }
    };

    const handleViewFilePdf = async (fileId) => {
        if (fileId) {
            const response = await getFile({ fileId });
            if (response.data && response.data?.size !== 0) {
                openFileInNewTab(response.data);
            }
        }
        navigateWhenUpdateSuccess();
    };

    const onUpdateCollectionCasePrint = async (formData) => {
        try {
            const response: any = await handleCallApiUpdateCollection(formData);
            if (response) {
                if (
                    (isPrintAfterUpdateSuccess || isPrintWithSignatureAfterUpdateSuccess) &&
                    isInputPackage === false
                ) {
                    openConfirmPrint();
                } else if (
                    isInputPackage &&
                    (isPrintAfterUpdateSuccess || isPrintWithSignatureAfterUpdateSuccess)
                ) {
                    const detailUnRegisteredValid = listCollectionState.filter(
                        (e) => !e.jwnetFlg && e.quantity && e.packagingCd && e.maniPatternSystemId,
                    );
                    if (detailUnRegisteredValid.length > 0) {
                        dispatch(
                            setPreviousPage({
                                previousUrl: previousUrlWhenUpdateSuccess,
                                previousUrlOfPage: CONSTANT_ROUTE.MANIFEST_REGISTER,
                            }),
                        );
                        navigate(`/${CONSTANT_ROUTE.MANIFEST_REGISTER}?seqNo=${seqNo}`);
                    } else {
                        openConfirmPrint();
                    }
                } else {
                    navigateWhenUpdateSuccess();
                }
            }
        } catch (error) {
            // do something
        }
    };

    const onUpdateCollectionCaseViewPDF = async (formData) => {
        try {
            if (signatureObj.blob) {
                // confirm create PDF.
                openConfirm({
                    content: (
                        <div className='flex justify-center text-center items-center text-md font-bold w-full'>
                            <div>
                                PDFファイルを作成します。
                                <br />
                                よろしいですか？
                            </div>
                        </div>
                    ),
                    onOk: async () => {
                        const response: any = await handleCallApiUpdateCollection(formData, true);
                        if (response) {
                            handleViewFilePdf(response.data);
                        }
                    },

                    onCancel: async () => {
                        const response: any = await handleCallApiUpdateCollection(formData);
                        if (response) {
                            navigateWhenUpdateSuccess();
                        }
                    },
                });
            } else {
                const response: any = await handleCallApiUpdateCollection(formData);
                if (response) {
                    navigateWhenUpdateSuccess();
                }
            }
        } catch (error) {
            // do something
        }
    };

    const handleCallApiUpdateCollection = async (formData, isExportPdf?) => {
        const response: any = await updateCollectionBySeqNo({
            seqNo: +seqNo,
            body: formData,
            isExportPdf: isExportPdf ? true : false,
        });
        if (response?.error) {
            return null;
        }
        return response;
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
                try {
                    handlePrint();
                } catch (error) {
                    dispatch(endPrint());
                    if (error.data?.message) {
                        openInformation({
                            content: (
                                <div className='text-center text-ssm font-bold'>
                                    {error.data?.message}
                                </div>
                            ),
                            onOk: () => {
                                navigateWhenUpdateSuccess();
                            },
                        });
                    }
                }
            },

            onCancel: () => {
                navigateWhenUpdateSuccess();
            },
        });
    };

    const navigateWhenUpdateSuccess = () => {
        navigate(previousUrlWhenUpdateSuccess || `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`);
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
        if (isPrintWithSignatureAfterUpdateSuccess) {
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
                    navigateWhenUpdateSuccess();
                },

                onCancel: () => {
                    navigateWhenUpdateSuccess();
                },
            });
        } else {
            navigateWhenUpdateSuccess();
        }
    };

    const changePackagingListFormat = (list: { cd: string; name: string }[]) => {
        if (list && list.length > 0) {
            return list.map((unitItem) => ({
                value: unitItem.cd,
                label: unitItem.name,
            }));
        }
        return null;
    };

    const changeUnitListFormat = (unitListParams: Array<UnitsResponse>) => {
        if (unitListParams && unitListParams.length > 0) {
            return unitListParams.map((unitItem: UnitsResponse) => ({
                value: unitItem.unitName,
                label: unitItem.unitName,
            }));
        }
        return null;
    };

    const renderKeyUp = (event: any) => {
        if (!arrNumber.includes(event.which)) {
            event.preventDefault();
        }
    };

    const handleSelectProduct = (item: Product) => {
        setOpenModalSelectProduct(false);
        setOpenProductHaveType(false);
        setCreateNew(true);
        setFormState((prev) => ({
            ...prev,
            id: uuidv4(),
            productName: item.productName,
            productCd: item.productCd,
            convertedQuantity: undefined,
            quantity: undefined,
            convertedUnitName: '',
            unitName: '',
        }));
    };

    const handleSelectProductType = (item: any) => {
        setTypeTitle(item.name);
        setSearchType(item.cd);
        setPaginationProductHaveType((prev) => ({
            ...prev,
            productTypeCd: item.cd,
        }));
        setOpenModalProductType(false);
        setPaginationProductType((prev) => ({
            ...prev,
            SearchText: '',
        }));
        setOpenProductHaveType(true);
    };

    const handleClickBack = () => {
        setOpenModalProductType(true);
        setOpenProductHaveType(false);
        setPaginationProductType({
            ...initPaginationProductType,
            PageNumber: 1,
        });
        setListProductsWithTypeState([]);
    };

    const handleInputChangeType = async (event: any) => {
        const value = event;
        setPaginationProductType({
            ...initPaginationProductType,
            SearchText: value,
            PageNumber: 1,
        });
        const response = await getProductType({
            ...initPaginationProductType,
            SearchText: value,
            PageNumber: 1,
        }).unwrap();
        if (response) {
            setListProductTypeState(response.items);
        }
    };

    const handleInputChangeProduct = async (event: any) => {
        const value = event;
        setPaginationProductHaveType({
            ...initPaginationProductHaveType,
            SearchText: value,
            productTypeCd: searchType,
            PageNumber: 1,
        });
        const response = await getProductsWithType({
            ...initPaginationProductHaveType,
            SearchText: value,
            productTypeCd: searchType,
            PageNumber: 1,
        }).unwrap();
        if (response) {
            setListProductsWithTypeState([...response.items]);
        }
    };

    const loadMoreData = async () => {
        if (openModalProductType) {
            setPaginationProductType({
                ...paginationProductType,
                PageNumber: paginationProductType.PageNumber + 1,
            });
            const newPaginations = {
                ...paginationProductType,
                PageNumber: paginationProductType.PageNumber + 1,
            };
            try {
                const response = await getProductType(newPaginations).unwrap();
                if (response) {
                    setListProductTypeState([...listProductTypeState, ...response.items]);
                }
            } catch (error) {
                //
            }
        } else if (openProductHaveType) {
            setPaginationProductHaveType({
                ...paginationProductHaveType,
                PageNumber: paginationProductHaveType.PageNumber + 1,
            });
            const newPaginations = {
                ...paginationProductHaveType,
                PageNumber: paginationProductHaveType.PageNumber + 1,
            };

            try {
                const response = await getProductsWithType(newPaginations).unwrap();
                if (response) {
                    setListProductsWithTypeState([...listProductsWithTypeState, ...response.items]);
                }
            } catch (error) {
                //
            }
        }
    };
    const handleChangeSelectUnit = (value: string) => {
        const { unitCd } = unitList.find((unit) => unit.unitName === value);

        setFormState((prev) => ({
            ...prev,
            unitName: value,
            unitCd,
        }));
    };

    const handleSelectAfterChange = (value: string) => {
        if (unitList.length > 0 && value) {
            const { unitCd } = unitList.find((unit) => unit.unitName === value);

            setFormState((prev) => ({
                ...prev,
                convertedUnitName: value,
                convertedUnitCd: unitCd || 1,
            }));
        } else {
            setFormState((prev) => ({
                ...prev,
                convertedUnitCd: undefined,
            }));
        }
    };

    const handleChangePackaging = (packagingCd) => {
        if (packagingList.length > 0 && packagingCd) {
            const packagingSelected = packagingList.find(
                (packaging) => packaging.cd === packagingCd,
            );
            setFormState((prev) => ({
                ...prev,
                packagingCd: packagingSelected.cd,
                packagingName: packagingSelected.name,
            }));
        } else {
            setFormState((prev) => ({
                ...prev,
                packagingCd: undefined,
                packagingName: undefined,
            }));
        }
    };

    // const handleChangeInputUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value, name } = event.target;
    //     const valueParse = parseInt(value, 10);
    // };

    const handleSubmitForm = (values: any) => {
        form.validateFields().then(
            (res) => {
                if (isCreateNew) {
                    setListCollectionState((prev) => [...prev, formState]);
                    setFormState(null);
                    setCreateNew(false);
                    setCountNumber(listCollectionState.length + 1);
                    form.resetFields();
                } else {
                    const index = listCollectionState.findIndex((i) =>
                        i.rowNo ? i.rowNo === formState.rowNo : i.id === formState.id,
                    );
                    const newList = [...listCollectionState];
                    newList[index] = formState;
                    setListCollectionState(newList);
                    setEdit(false);
                    setFormState(null);
                    form.resetFields();
                }
            },
            (err) => {},
        );
    };

    const onEditCollection = async (collect: CollectionDetail) => {
        setEdit(true);
        if (isCreateNew) {
            setCreateNew(false);
        }
        setFormState(collect);
        form.setFieldsValue({
            ...collect,
            unitCd: collect.unitName,
            convertedUnitCd: collect.convertedUnitName,
        });
    };

    const onAddNewCollection = async () => {
        if (settingProductType === 1) {
            setOpenModalProductType(true);
            // console.log('first');
        } else {
            setOpenModalSelectProduct(true);
        }
        if (isEdit) {
            setEdit(false);
        }
        setFormState(null);
        form.resetFields();
    };

    const openDeleteModal = (item) => {
        setShowDeleteModal(true);
        setItemToDelete(item);
    };

    const onCloseForm = () => {
        if (isCreateNew) {
            setCreateNew(false);
        } else {
            setEdit(false);
        }

        setFormState(null);
        form.resetFields();
    };

    const handleClickRollBack = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.WORK_SELECTION}?seqNo=${seqNo}`);
    };

    const handleOpenPopupChangeTime = () => {
        if (isViewOnly) {
            return;
        }
        setOpenChangeTime(true);
    };

    const handleSelectTime = (t: any) => {
        setTime(t);
    };

    const handleFocusInput = (e) => {
        if (deviceType < 3) {
            setTimeout(() => {
                e.target.select();
            }, 0);
        }
        const inputValue = e.target.value;
        const updatedValue = inputValue.replaceAll(',', '');
        e.target.value = updatedValue;
        const newVal: any = updatedValue;
        setFormState((prev: any) => ({ ...prev, quantity: newVal }));
        form.setFieldValue('quantity', newVal);
    };

    const navigateToManifestConfirm = (collectionDetail: CollectionDetail) => {
        dispatch(
            setCacheCollectedQuantityInput({
                seqNo,
                formState: formState ? formState : null,
                listCollectionState,
                isCreateNew,
                isEdit,
                time,
                selectedCollection: collectionDetail,
                collectionDate: collectionBySeqNo?.collectionDate,
            }),
        );
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.MANIFEST_CONFIRM,
            }),
        );
        navigate({
            pathname: `/${CONSTANT_ROUTE.MANIFEST_CONFIRM}`,
            search: `?seqNo=${seqNo}&maniPatternSystemId=${collectionDetail.maniPatternSystemId}`,
        });
    };

    const handleFocusConvertedInput = (e) => {
        if (deviceType < 3) {
            setTimeout(() => {
                e.target.select();
            }, 0);
        }
        const inputValue = e.target.value;
        const updatedValue = inputValue.replaceAll(',', '');
        e.target.value = updatedValue;
        const newVal: any = updatedValue;
        setFormState((prev: any) => ({ ...prev, convertedQuantity: newVal }));
        form.setFieldValue('convertedQuantity', newVal);
    };

    const handleFocusPackagingQuantityInput = (e) => {
        if (deviceType < 3) {
            setTimeout(() => {
                e.target.select();
            }, 0);
        }
        const inputValue = e.target.value;
        const updatedValue = inputValue.replaceAll(',', '');
        e.target.value = updatedValue;
        const newVal: any = updatedValue;
        setFormState((prev: any) => ({ ...prev, packagingQuantity: newVal }));
        form.setFieldValue('packagingQuantity', newVal);
    };
    // const productNameValue = Form.useWatch('productName', form);
    // const quantityValue = Form.useWatch('quantity', form);
    // const convertedQuantityValue = Form.useWatch('convertedQuantity', form);
    // const convertedUnitCdValue = Form.useWatch('convertedUnitCd', form);
    // const unitNameValue = Form.useWatch('unitName', form);
    // const unitCdValue = Form.useWatch('unitCd', form);
    // const convertedUnitNameValue = Form.useWatch('convertedUnitName', form);

    return (
        <Layout
            isShowDate={false}
            isLoading={
                responseGetSignatureCollection.isLoading ||
                responseGetSignatureCollection.isFetching ||
                isLoadingData ||
                responseUpdateCollectionBySeqNo.isLoading
            }
            title='回収数量入力'
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <div className='mt-header'>
                <SubHeader
                    title={collectionBySeqNo?.companyName}
                    desc={collectionBySeqNo?.siteName}
                    svgIcon={<SkylineIcon />}
                />
                <FuncBlock
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>回収品名</h2>
                            <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                                {numberCount}
                            </div>
                        </div>
                    }
                    isShowRightIcon={isViewOnly ? false : true}
                    onClickIcon={onAddNewCollection}
                />
                <div className=' px-3 collected-quantity'>
                    <div className='flex items-center justify-between gap-4 mt-4'>
                        {/* Date  */}
                        <div className='flex items-center justify-center gap-4 bg-greenDC  py-3 rounded-xl border-[1px]  border-green1A w-3/5'>
                            <div className='w-6  h-6'>
                                <CalendarIcon className='w-full h-full object-cover' />
                            </div>
                            <p className='font-zenMaru text-md text-green1A font-medium mb-0'>
                                {dayjs(collectionBySeqNo?.collectionDate).format('YYYY/MM/DD')}
                            </p>
                        </div>

                        {/* Clock  */}
                        <div
                            onClick={() => handleOpenPopupChangeTime()}
                            className='flex items-center justify-center gap-3 bg-white w-2/5 py-2 rounded-lg'
                        >
                            <img src={iconGrayClock} alt='icon clock' />
                            <p className='font-zenMaru text-lg text-black11 font-medium mb-0 tracking-[4px]'>
                                {time}
                            </p>
                        </div>
                    </div>

                    {isCreateNew && (
                        <Form
                            form={form}
                            name='create-form'
                            className='px-4 py-4  rounded-xl  mt-4 border border-green1A bg-greenDC '
                        >
                            <div className='font-zenMaru grid grid-cols-[auto_46px] justify-between items-start pb-3 border-b border-green1A'>
                                <h2 className='text-green1A text-xl font-bold mb-0 break-words w-auto'>
                                    {formState?.productName}
                                </h2>
                                <div onClick={onCloseForm}>
                                    <CloseIcon className='w-full h-full' />
                                </div>
                            </div>

                            {/* Input Group  */}
                            <div className='mt-4 flex justify-between gap-2'>
                                <div className='w-7/12'>
                                    {/* quantity */}
                                    <div className='flex flex-col gap-2'>
                                        <Form.Item
                                            name='quantity'
                                            label='数量'
                                            rules={[{ required: true, message: '数量 必要です' }]}
                                        >
                                            <Input
                                                onFocus={handleFocusInput}
                                                type='tel'
                                                className='h-input-default leading-input-default text-md !rounded-md'
                                                name='quantity'
                                                inputMode='tel'
                                                onBlur={handleBlurInput}
                                                onKeyDown={renderKeyUp}
                                                value={formState?.quantity}
                                                // onChange={handleChangeInputUnit}
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* convertedQuantity */}
                                    {isInputPackage === false && (
                                        <div className='flex flex-col gap-2'>
                                            <Form.Item
                                                name='convertedQuantity'
                                                label='換算後数量'
                                                rules={[
                                                    {
                                                        required:
                                                            formState?.convertedUnitCd !==
                                                                undefined &&
                                                            formState?.convertedUnitCd !== '',
                                                        message: '換算後数量 必要です',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    type='tel'
                                                    name='convertedQuantity'
                                                    className='h-input-default leading-input-default text-md !rounded-md'
                                                    value={formState?.convertedQuantity}
                                                    inputMode='tel'
                                                    onBlur={handleBlurConvertInput}
                                                    onFocus={handleFocusConvertedInput}
                                                    onKeyDown={renderKeyUp}
                                                    // onChange={handleChangeInputUnit}
                                                />
                                            </Form.Item>
                                        </div>
                                    )}
                                </div>

                                <div className='w-5/12'>
                                    {/* unitCd */}
                                    <div className='flex flex-col gap-2'>
                                        <Form.Item
                                            name='unitCd'
                                            label='単位'
                                            rules={[{ required: true, message: '単位 必要です' }]}
                                        >
                                            <Select
                                                suffixIcon={
                                                    <div className='w-4 h-4'>
                                                        <img
                                                            src={iconWhiteDown}
                                                            className='w-full h-full object-cover'
                                                            alt='info'
                                                        />
                                                    </div>
                                                }
                                                className='!h-input-default'
                                                dropdownStyle={{ position: 'fixed' }}
                                                value={formState?.unitName}
                                                style={{ width: '100%' }}
                                                onChange={handleChangeSelectUnit}
                                                options={changeUnitListFormat(unitList)}
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* convertedUnitCd */}
                                    {isInputPackage === false && (
                                        <div className='flex flex-col gap-2 mb-2'>
                                            <Form.Item
                                                name='convertedUnitCd'
                                                label='単位'
                                                rules={[
                                                    {
                                                        required:
                                                            formState?.convertedQuantity !==
                                                                undefined &&
                                                            formState?.convertedQuantity !== '' &&
                                                            formState?.convertedQuantity !== null,
                                                        message: '単位 必要です',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    allowClear
                                                    suffixIcon={
                                                        <div className='w-4 h-4'>
                                                            <img
                                                                src={iconWhiteDown}
                                                                className='w-full h-full object-cover'
                                                                alt='info'
                                                            />
                                                        </div>
                                                    }
                                                    className='!h-input-default'
                                                    dropdownStyle={{ position: 'fixed' }}
                                                    value={formState?.convertedUnitName}
                                                    style={{ width: '100%' }}
                                                    onChange={handleSelectAfterChange}
                                                    options={changeUnitListFormat(unitList)}
                                                />
                                            </Form.Item>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* case 荷姿数量 */}
                            {isInputPackage && (
                                <div className='flex  mt-4 gap-2 justify-between'>
                                    <div className='w-5/12'>
                                        {/* packagingCd */}
                                        <div className='flex flex-col gap-2 mb-2'>
                                            <Form.Item
                                                name='packagingCd'
                                                label='荷姿'
                                                rules={[
                                                    {
                                                        required:
                                                            formState?.packagingQuantity !==
                                                                undefined &&
                                                            formState?.packagingQuantity !== '' &&
                                                            formState?.packagingQuantity !== null,
                                                        message: '荷姿 必要です',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    allowClear
                                                    suffixIcon={
                                                        <div className='w-4 h-4'>
                                                            <img
                                                                src={iconWhiteDown}
                                                                className='w-full h-full object-cover'
                                                                alt='info'
                                                            />
                                                        </div>
                                                    }
                                                    className='!h-input-default'
                                                    dropdownStyle={{ position: 'fixed' }}
                                                    value={formState?.packagingCd}
                                                    style={{ width: '100%' }}
                                                    onChange={handleChangePackaging}
                                                    options={changePackagingListFormat(
                                                        packagingList,
                                                    )}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className='w-7/12'>
                                        <div className='flex flex-col gap-2'>
                                            <Form.Item
                                                name='packagingQuantity'
                                                label='荷姿数量'
                                                rules={[
                                                    {
                                                        required:
                                                            formState?.packagingCd !== undefined &&
                                                            formState?.packagingCd !== '',
                                                        message: '荷姿数量 必要です',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    type='text'
                                                    autoComplete='off'
                                                    name='packagingQuantity'
                                                    className='h-input-default leading-input-default text-md !rounded-md'
                                                    value={formState?.packagingQuantity}
                                                    pattern='\d*'
                                                    maxLength={5}
                                                    onBlur={handleBlurPackagingQuantityInput}
                                                    onFocus={handleFocusPackagingQuantityInput}
                                                    onKeyDown={renderKeyUp}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Save button  */}
                            <div className='flex justify-center'>
                                <button
                                    type='button'
                                    onClick={handleSubmitForm}
                                    className='w-fit flex justify-center items-center gap-2 bg-white border-[1px] rounded-[4px] border-green1A px-3 py-1'
                                >
                                    <div className='w-6 h-6'>
                                        <SaveIcon className='w-full h-full object-cover' />
                                    </div>
                                    <h2 className='text-black37 text-sm font-medium mb-0'>保存</h2>
                                </button>
                            </div>
                        </Form>
                    )}

                    {/* Item  */}
                    {listCollectionState.map((item, index) =>
                        isEdit &&
                        (formState?.rowNo
                            ? formState?.rowNo === item?.rowNo
                            : formState?.id === item?.id) ? (
                            <Form
                                form={form}
                                key={item.rowNo}
                                name='create-form'
                                className='px-4 py-4  rounded-xl  mt-4 border border-green1A bg-greenDC  overflow-hidden'
                            >
                                <div className='grid grid-cols-[auto_46px] justify-between items-start pb-3 border-b border-green1A'>
                                    <h2 className='text-green1A text-xl font-bold mb-0'>
                                        {formState?.productName}
                                    </h2>
                                    <div onClick={onCloseForm} className='w-11 h-11'>
                                        <CloseIcon className='w-full h-full object-cover' />
                                    </div>
                                </div>

                                {/* Input Group  */}
                                <div className='mt-4 flex justify-between gap-2'>
                                    <div className='w-7/12'>
                                        {/* quantity */}
                                        <div className='flex flex-col'>
                                            <Form.Item
                                                name='quantity'
                                                label='数量'
                                                rules={[
                                                    { required: true, message: '数量 必要です' },
                                                ]}
                                            >
                                                <Input
                                                    type='tel'
                                                    name='quantity'
                                                    className='h-input-default leading-input-default text-md !rounded-md'
                                                    inputMode='tel'
                                                    onFocus={handleFocusInput}
                                                    onBlur={handleBlurInput}
                                                    onKeyDown={renderKeyUp}
                                                    value={formState?.quantity}
                                                    // onChange={handleChangeInputUnit}
                                                />
                                            </Form.Item>

                                            {/* <p className='text-black3C text-sm mb-0'>数量</p> */}
                                        </div>

                                        {/* convertedQuantity */}
                                        {isInputPackage === false && (
                                            <div className='flex flex-col'>
                                                <Form.Item
                                                    name='convertedQuantity'
                                                    label='換算後数量'
                                                    // rules={[{ required: true, message: '数量 必要です' }]}
                                                    rules={[
                                                        {
                                                            required:
                                                                formState?.convertedUnitCd !==
                                                                    undefined &&
                                                                formState?.convertedUnitCd !== '' &&
                                                                formState?.convertedUnitCd !== null,
                                                            message: '換算後数量 必要です',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        type='tel'
                                                        className='h-input-default leading-input-default text-md !rounded-md'
                                                        name='convertedQuantity'
                                                        value={formState?.convertedQuantity}
                                                        inputMode='tel'
                                                        onFocus={handleFocusConvertedInput}
                                                        onBlur={handleBlurConvertInput}
                                                        onKeyDown={renderKeyUp}
                                                        // onChange={handleChangeInputUnit}
                                                    />
                                                </Form.Item>
                                            </div>
                                        )}
                                    </div>

                                    <div className='w-5/12'>
                                        {/* unitCd */}
                                        <div className='flex flex-col gap-2'>
                                            <Form.Item
                                                name='unitCd'
                                                label='単位'
                                                rules={[
                                                    { required: true, message: '単位 必要です' },
                                                ]}
                                            >
                                                <Select
                                                    className='!h-input-default '
                                                    suffixIcon={
                                                        <div className='w-4 h-4'>
                                                            <img
                                                                src={iconWhiteDown}
                                                                className='w-full h-full object-cover'
                                                                alt='info'
                                                            />
                                                        </div>
                                                    }
                                                    dropdownStyle={{ position: 'fixed' }}
                                                    value={formState?.unitName}
                                                    style={{ width: '100%' }}
                                                    onChange={handleChangeSelectUnit}
                                                    options={changeUnitListFormat(unitList)}
                                                />
                                            </Form.Item>
                                        </div>

                                        {/* convertedUnitCd */}
                                        {isInputPackage === false && (
                                            <div className='flex flex-col gap-2 mb-2'>
                                                <Form.Item
                                                    name='convertedUnitCd'
                                                    label='単位'
                                                    rules={[
                                                        {
                                                            required:
                                                                formState?.convertedQuantity !==
                                                                    undefined &&
                                                                formState?.convertedQuantity !==
                                                                    '' &&
                                                                formState?.convertedQuantity !==
                                                                    null,
                                                            message: '単位 必要です',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        allowClear
                                                        className='!h-input-default'
                                                        suffixIcon={
                                                            <div className='w-4 h-4'>
                                                                <img
                                                                    src={iconWhiteDown}
                                                                    className='w-full h-full object-cover'
                                                                    alt='info'
                                                                />
                                                            </div>
                                                        }
                                                        dropdownStyle={{ position: 'fixed' }}
                                                        value={formState?.convertedUnitName}
                                                        style={{ width: '100%' }}
                                                        onChange={handleSelectAfterChange}
                                                        options={changeUnitListFormat(unitList)}
                                                    />
                                                </Form.Item>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* case 荷姿数量  */}
                                {isInputPackage && (
                                    <div className='flex mt-4 gap-2 justify-between'>
                                        <div className='w-5/12'>
                                            <div className='flex flex-col gap-2'>
                                                <Form.Item
                                                    name='packagingCd'
                                                    label='荷姿'
                                                    rules={[
                                                        {
                                                            required:
                                                                formState?.packagingQuantity !==
                                                                    undefined &&
                                                                formState?.packagingQuantity !==
                                                                    '' &&
                                                                formState?.packagingQuantity !==
                                                                    null,
                                                            message: '荷姿 必要です',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        allowClear
                                                        className='!h-input-default'
                                                        suffixIcon={
                                                            <div className='w-4 h-4'>
                                                                <img
                                                                    src={iconWhiteDown}
                                                                    className='w-full h-full object-cover'
                                                                    alt='info'
                                                                />
                                                            </div>
                                                        }
                                                        dropdownStyle={{ position: 'fixed' }}
                                                        value={formState.packagingCd}
                                                        style={{ width: '100%' }}
                                                        onChange={handleChangePackaging}
                                                        options={changePackagingListFormat(
                                                            packagingList,
                                                        )}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className='w-7/12'>
                                            {/* packagingQuantity */}
                                            <div className='flex flex-col'>
                                                <Form.Item
                                                    name='packagingQuantity'
                                                    label='荷姿数量'
                                                    // rules={[{ required: true, message: '数量 必要です' }]}
                                                    rules={[
                                                        {
                                                            required:
                                                                formState?.packagingCd !==
                                                                    undefined &&
                                                                formState?.packagingCd !== '' &&
                                                                formState?.packagingCd !== null,
                                                            message: '荷姿数量 必要です',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        type='text'
                                                        autoComplete='off'
                                                        className='h-input-default leading-input-default text-md !rounded-md'
                                                        name='packagingQuantity'
                                                        value={formState?.packagingQuantity}
                                                        pattern='\d*'
                                                        maxLength={5}
                                                        onBlur={handleBlurPackagingQuantityInput}
                                                        onFocus={handleFocusPackagingQuantityInput}
                                                        onKeyDown={renderKeyUp}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Save button  */}
                                <div className='flex justify-center'>
                                    <button
                                        type='button'
                                        onClick={handleSubmitForm}
                                        className='w-fit flex justify-center items-center gap-2 bg-white border-[1px] rounded-[4px] border-green1A px-3 py-1'
                                    >
                                        <div className='w-6 h-6'>
                                            <SaveIcon className='w-full h-full object-cover' />
                                        </div>
                                        <h2 className='text-black37 text-sm font-medium mb-0'>
                                            保存
                                        </h2>
                                    </button>
                                </div>
                            </Form>
                        ) : (
                            <div
                                className='bg-white rounded-lg shadow-md w-full mt-4 p-4 '
                                key={item.rowNo}
                            >
                                <div className='flex justify-between items-center mb-3'>
                                    <h2 className='font-zenMaru text-green1A text-md font-bold mb-0 break-words basis-3/4'>
                                        {item.productName}
                                    </h2>
                                    {/* case 荷姿数量 */}
                                    {isInputPackage && !isViewOnly && (
                                        <button
                                            type='button'
                                            className='bg-green1A py-1 w-[100px] text-white rounded-md text-md disabled:bg-grayD4'
                                            onClick={() => navigateToManifestConfirm(item)}
                                            disabled={
                                                !Number(item.quantity) ||
                                                !item.maniPatternSystemId ||
                                                (item.maniPatternSystemId &&
                                                    (!item.quantity || !item.packagingCd))
                                            }
                                        >
                                            確認
                                        </button>
                                    )}
                                </div>

                                <div className='flex pb-1'>
                                    <div className='w-1/2'>
                                        <h3 className='font-zenMaru text-md text-black3C mb-1'>
                                            数量
                                        </h3>
                                        <p className='font-zenMaru text-md text-black3A font-bold mb-0'>
                                            {item.quantity
                                                ? `${item.quantity}${item.unitName}`
                                                : '--'}
                                        </p>
                                    </div>

                                    {/* case 荷姿数量 */}
                                    {isInputPackage ? (
                                        <div className='w-1/2'>
                                            <h3 className='font-zenMaru text-md text-black3C mb-1'>
                                                荷姿数量
                                            </h3>
                                            <p className='font-zenMaru text-md text-black3A font-bold mb-0'>
                                                {item.packagingQuantity
                                                    ? `${item.packagingName}${'　'}${
                                                          item.packagingQuantity
                                                      }`
                                                    : '--'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='w-1/2'>
                                            <h3 className='font-zenMaru text-md text-black3C mb-1'>
                                                換算後数量
                                            </h3>
                                            <p className='font-zenMaru text-md text-black3A font-bold mb-0'>
                                                {item.convertedQuantity
                                                    ? `${item.convertedQuantity}${item.convertedUnitName}`
                                                    : '--'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {!isViewOnly && (
                                    <div className='flex justify-between w-full '>
                                        <div className='w-[50%] border-r-2 '>
                                            <button
                                                type='button'
                                                className='basis-1/4  flex items-center justify-end gap-2'
                                                onClick={() => onEditCollection(item)}
                                            >
                                                <div className='w-6 h-6'>
                                                    <EditIcon className='w-full h-full object-cover' />
                                                </div>

                                                <p className='font-zenMaru text-ssm text-green15 mb-0'>
                                                    編集
                                                </p>
                                            </button>
                                        </div>
                                        <button
                                            type='button'
                                            className='basis-1/4  flex items-center justify-end gap-2  w-[50%]'
                                            onClick={() => openDeleteModal(item)}
                                        >
                                            <p className='font-zenMaru text-ssm text-red2a mb-0'>
                                                削除
                                            </p>

                                            <div className='w-6 h-6'>
                                                <img
                                                    src={iconRedDelete}
                                                    className='w-full h-full object-contain'
                                                    alt='edit'
                                                />
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ),
                    )}

                    <Modal
                        title='削除の確認'
                        visible={showDeleteModal}
                        okText='削除'
                        cancelText='キャンセル'
                        onOk={() => {
                            const updatedList = listCollectionState.filter(
                                (item) => item !== itemToDelete,
                            );
                            setListCollectionState(updatedList);
                            setCountNumber(numberCount - 1);
                            setShowDeleteModal(false);
                        }}
                        onCancel={() => setShowDeleteModal(false)}
                    >
                        <div>
                            <p>削除してよろしいですか？</p>
                        </div>
                    </Modal>
                </div>
                {(isViewPdfAfterUpdateSuccess || isPrintWithSignatureAfterUpdateSuccess) && (
                    <>
                        <div className='bg-green15 py-2 mt-4'>
                            <Container classnames='flex justify-between items-center'>
                                <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                    現場確認印
                                </span>
                            </Container>
                        </div>
                        <div className='p-3 h-[200px] bg-white border border-black'>
                            {signatureObj.url && (
                                <img
                                    src={signatureObj.url}
                                    alt='signature'
                                    className='max-h-full m-auto'
                                />
                            )}
                        </div>
                    </>
                )}
                {!isViewOnly &&
                    (isViewPdfAfterUpdateSuccess || isPrintWithSignatureAfterUpdateSuccess) && (
                        <Container>
                            <Button
                                htmlType='button'
                                className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center mt-3'
                                onClick={(event) => {
                                    setOpenModalSignature(true);
                                    handleSetSignatureOfModal();
                                }}
                            >
                                <svg
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M11 4.00001H4C3.46957 4.00001 2.96086 4.21073 2.58579 4.5858C2.21071 4.96087 2 5.46958 2 6.00001V20C2 20.5304 2.21071 21.0392 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0392 20 20.5304 20 20V13M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z'
                                        stroke='#fff'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                                <span className='ml-2'>電子サイン</span>
                            </Button>
                        </Container>
                    )}
                {/* button submit */}
                {!isViewOnly && (
                    <Container>
                        <button
                            type='button'
                            onClick={onUpdateCollection}
                            className=' bg-green1A py-[10px] w-full flex justify-center items-center gap-2 shadow-md !rounded-md mt-5 mb-5'
                        >
                            <span className='text-sm text-white font-medium mb-0'>登録</span>
                            <span className='w-5 h-5 block'>
                                <img
                                    src={iconWhiteSend}
                                    className='w-full h-full object-cover'
                                    alt='send'
                                />
                            </span>
                        </button>
                    </Container>
                )}
            </div>
            {(isPrintWithSignatureAfterUpdateSuccess || isViewPdfAfterUpdateSuccess) && (
                <ModalInputSignature
                    ref={refSignature}
                    handleSelectSignature={handleSelectSignature}
                    setOpen={setOpenModalSignature}
                    open={openModalSignature}
                />
            )}

            <CustomTimePicker
                defaultTime={time}
                open={openChangeTime}
                setOpen={setOpenChangeTime}
                handleSelect={handleSelectTime}
            />

            <ModalSelectProduct
                open={openModalSelectProduct}
                setOpen={setOpenModalSelectProduct}
                handleSelectItem={handleSelectProduct}
            />

            <SelectValueModalDefault
                open={openModalProductType || openProductHaveType}
                setOpen={openModalProductType ? setOpenModalProductType : setOpenProductHaveType}
                showBackButton={!!openProductHaveType}
                onClickBack={handleClickBack}
                handleInputChange={
                    openModalProductType ? handleInputChangeType : handleInputChangeProduct
                }
                handleSelectItem={
                    openModalProductType ? handleSelectProductType : handleSelectProduct
                }
                loadMoreData={loadMoreData}
                isLoading={isFetchingGetProductTypes || isFetchingGetProductsWType}
                listProducts={
                    openModalProductType ? listProductTypeState : listProductsWithTypeState
                }
                products={openModalProductType ? productTypeList : productsWithTypeList}
                title={openModalProductType ? '種類一覧' : '品名一覧'}
                placeholder='検索する'
                subtitle={openModalProductType ? '' : typeTitle}
            />
        </Layout>
    );
};
export default CollectedQuantity;
