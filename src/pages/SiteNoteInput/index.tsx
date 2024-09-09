/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* eslint-disable no-lonely-if */
import { Button, Form, Input, RadioChangeEvent, Switch } from 'antd';
import iconClose from 'assets/icons/ic_close_bg_none.svg';
import iconDelete from 'assets/icons/ic_delete.svg';
import { SearchIcon } from 'components/icons/SearchIcon';
import iconSubmit from 'assets/icons/ic_submit.svg';
import iconCalendar from 'assets/icons/ic_calendar.svg';
import iconWhiteDelete from 'assets/icons/ic-white-delete.svg';
import { UploadFile } from 'components/common/Files';
import FuncBlock from 'components/common/FuncBlock';
import SelectValueModal from 'components/common/Modal/SelectValueModal';
import TimeInfo from 'components/organisms/SubHeader/TimeInfo';
import Layout from 'components/templates/Layout';
import {
    CompanyInformation,
    CustomerInformation,
    SiteNotesPostClass,
    SiteNotesPostDto,
    SitesInformation,
    TitlesInformation,
    TypesInformation,
} from 'models';
import React, { useEffect, useState } from 'react';
import 'react-times/css/classic/default.css';
import 'react-times/css/material/default.css';
import {
    useLazyGetCompanyQuery,
    useLazyGetCustomerQuery,
    useLazyGetSitesQuery,
    useLazyGetTitlesQuery,
    useLazyGetTypesQuery,
    usePostSiteNotesMutation,
    useLazyGetSiteNotesQuery,
    usePutSiteNotesMutation,
    useDeleteSiteNotesMutation,
    usePutCommentSiteNotesMutation,
} from 'services/siteNotes';
import { CONSTANT_ROUTE, SOURCE_CONST } from 'utils/constants';
import './index.scss';
import { useGetSizeUploadQuery, useLazyGetSizeUploadQuery } from 'services/settings';
import { useAppSelector } from 'store/hooks';
import { openConfirm, openInformation, showErrorToast } from 'utils/functions';
import dayjs from 'dayjs';
import iconMSPPT from 'assets/icons/ic_ms_ppt.svg';
import iconMsWord from 'assets/icons/ic_ms_word.svg';
import iconMsExcel from 'assets/icons/ic_ms_excel.svg';
import iconDocumentTxt from 'assets/icons/ic_document_txt.svg';
import { useNavigate } from 'react-router-dom';
import { useLazyGetInfoCollectionQuery } from 'services/collection';
import { useLazyGetSitesByCompanyQuery } from 'services/sites';
import { FilterSvg } from 'components/icons/FilterSvg';
import { FilterBorderSvg } from 'components/icons/FilterBorderSvg';
import { DownloadIcon } from 'components/icons/DownloadIcon';
import { UploadIcon } from 'components/icons/UploadIcon';
import SiteNoteModal from 'components/common/Modal/SiteNoteModal';

const FILE_TYPE = {
    EXCEL: 'sheet',
    WORD: 'word',
    NOTE: 'text/plain',
    POWERPOINT: 'presentation',
};

const FILE_ICON = {
    EXCEL: iconMsExcel,
    WORD: iconMsWord,
    NOTE: iconDocumentTxt,
    POWERPOINT: iconMSPPT,
};

const FILE_EXTENSION = {
    EXCEL: ['.xls', '.xlsx'],
    WORD: ['.doc', '.docx'],
    NOTE: ['.txt'],
    POWERPOINT: ['.ppt', '.pptx'],
};

const FUNNEL_TYPE = {
    CUSTOMER: 'customer',
    COMPANY: 'company',
    SITE: 'site',
    NOTE_TYPE: 'note_type',
    TITLE: 'title',
};

const listRadios: { id: number; text: string }[] = [
    { id: 0, text: '業者名' },
    { id: 1, text: '現場名' },
    { id: 2, text: '住所' },
    { id: 3, text: '全て' },
];

const SiteNoteInput: React.FC = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const [isUpdate, setIsUpdate] = useState(false);

    const systemId = urlParams.has('systemId') ? urlParams.get('systemId') : null;
    const seq = urlParams.has('seq') ? urlParams.get('seq') : null;
    const isDelete = urlParams.has('isDelete') ? urlParams.get('isDelete') : null;
    const isDispatchStatus = urlParams.has('dispatchStatus')
        ? urlParams.get('dispatchStatus')
        : null;
    const companyCD = urlParams.has('companyCd') ? urlParams.get('companyCd') : null;
    const siteCD = urlParams.has('siteCd') ? urlParams.get('siteCd') : null;

    const dispatchStatus = useAppSelector((state) => state.reducer.dispatchStatus.dispatchStatus);

    const { user }: any = useAppSelector((state) => state.reducer.user);
    const [sourceCd, setSourceCd] = useState('1');
    const [sourceNumber, setSourceNumber] = useState(null);
    const [sourceDetailNumber, setSourceDetailNumber] = useState(null);
    const [comments, setComments] = useState([]);

    const [formState, setFormState] = useState<SiteNotesPostDto>(new SiteNotesPostClass());
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [funnelType, setFunnelType] = useState('');
    const [seqNo, setSeqNo] = useState<number>();
    const [getMaxSize, { data: maxSize }] = useLazyGetSizeUploadQuery();

    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.SITE_NOTE_INPUT],
    );

    const [dateTimeInfoState, setDateTimeInfoState] = useState({
        title: null,
        date: new Date(),
        time: dayjs(new Date()).format('HH:mm'),
    });

    const [uploadedFile, setUploadedFile] = useState([]);
    const [listFile, setListFile] = useState([]);
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);

    const initPaginations = {
        search: '',
        page: 1,
        size: 10,
        field: 0,
    };

    const [paginations, setPaginations] = useState(initPaginations);
    const [isChangeable, setIsChangeable] = useState(true);

    const [searchCustomer, setSearchCustomer] = useState('');
    const [listCustomerState, setListCustomerState] = useState<CustomerInformation[]>([]);
    const [getCustomers, { data: customerList, isLoading: isLoadingGetCustomers }] =
        useLazyGetCustomerQuery();

    const [searchCompany, setSearchCompany] = useState('');
    const [listCompanyState, setListCompanyState] = useState<CompanyInformation[]>([]);
    const [getCompanies, { data: companyList, isLoading: isLoadingGetCompanies }] =
        useLazyGetCompanyQuery();

    const [searchSite, setSearchSite] = useState('');
    const [listSiteState, setListSiteState] = useState<SitesInformation[]>([]);
    const [getSites, { data: sitesList, isLoading: isLoadingGetSites }] = useLazyGetSitesQuery();

    const [searchNoteType, setSearchNoteType] = useState('');
    const [listNoteTypeState, setListNoteTypeState] = useState<TypesInformation[]>([]);
    const [getNoteTypes, { data: noteTypeList, isLoading: isLoadingGetNoteTypes }] =
        useLazyGetTypesQuery();

    const [searchTitle, setSearchTitle] = useState('');
    const [listTitleState, setListTitleState] = useState<TitlesInformation[]>([]);
    const [getTitles, { data: titleList, isLoading: isLoadingGetTitles }] = useLazyGetTitlesQuery();
    const [postSiteNotes, { isLoading: isLoadingPostSiteNote }] = usePostSiteNotesMutation();
    const [putSiteNotes, { isLoading: isLoadingPutSiteNote }] = usePutSiteNotesMutation();
    // const [getFiles, { data: fileList, isLoading: isLoadingGetFile }] = useGetFileMutation();
    const [putCommentSiteNotes, { isLoading: isLoadingPutCommentSiteNote }] =
        usePutCommentSiteNotesMutation();
    // const { data: maxSize } = useGetSizeUploadQuery();
    const [getSitesByCompany, { isLoading: isLoadingSiteByCompany }] =
        useLazyGetSitesByCompanyQuery();

    const [overText1Length, setOverText1Length] = useState(false);
    const [overText2Length, setOverText2Length] = useState(false);


    const [openFilter, setOpenFilter] = useState(false);
    const [titleModal, settitleModal] = useState('取引先');
    const [defaultValue, setDefaultValue] = useState('');
    const [valueHiddenSourcesModal, setValueHiddenSourcesModal] = useState('');
    const [typeModal, setTypeModal] = useState(1); // 1: customer, 2: company, 3: sites, 4: types
    // edit
    const [getSiteNotes, { data: siteNoteList, isLoading: isloadingGetSiteNote }] =
        useLazyGetSiteNotesQuery();
    const [getInfoCollection, { data: infoCollection, isLoading: isLoadingGetInfoCollection }] =
        useLazyGetInfoCollectionQuery();

    // delete
    const [deleteSiteNote, { isLoading: isLoadingDelete }] = useDeleteSiteNotesMutation();

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

    const GetUploadFile = async (fileInfos) => {
        if (fileInfos?.length > 0) {
            fileInfos.forEach(async (x) => {
                const { fileExtention, fileId, fileLength, fileName } = x;
                const file: any = await fetchFile(
                    `${process.env.REACT_APP_API_BASE_URL}/api/v1/files/${fileId}`,
                );
                if (file) {
                    file.id = fileId;
                    if (file?.type?.includes(FILE_TYPE.EXCEL)) file.icon = FILE_ICON.EXCEL;
                    if (file?.type?.includes(FILE_TYPE.WORD)) file.icon = FILE_ICON.WORD;
                    if (file?.type?.includes(FILE_TYPE.NOTE)) file.icon = FILE_ICON.NOTE;
                    if (file?.type?.includes(FILE_TYPE.POWERPOINT))
                        file.icon = FILE_ICON.POWERPOINT;

                    setListFile((prev) =>
                        !prev.find((t) => t.id === file.id) ? [...prev, file] : [...prev],
                    );
                }
            });
        }
    };

    const GetSiteNodeInfo = async (query) => {
        try {
            const response = await getSiteNotes(query).unwrap();
            // get data
            if (response) {
                setSeqNo(response.seq);
                setFormState((prev) => ({
                    ...prev,
                    customerCd: response?.customerCd,
                    customerName: response?.customerName,
                    companyCd: response?.companyCd,
                    companyName: response?.companyName,
                    changeable: response?.changeable,
                    siteCd: response?.siteCd,
                    siteName: response?.siteName,
                    siteNoteTypeCd: response?.siteNoteTypeCd,
                    siteNoteTypeName: response?.siteNoteTypeName,
                    title: response?.title,
                    content1: response?.content1,
                    content2: response?.content2,
                    sourceCd: response?.sourceCd,
                    sourceName: response?.sourceName,
                    sourceNumber: response?.sourceNumber,
                    sourceDetailNumber: response?.sourceDetailNumber,
                    // 'files': response?.files,
                    hidden: response?.isHidden ? '非表示' : '表示',
                    siteNoteNumber: response?.siteNoteNumber,
                    createdBy: response?.createdBy,
                    timeStamp: response?.timeStamp,
                }));
                setSourceCd(response?.sourceCd);
                setSourceNumber(response?.sourceNumber);
                setSourceDetailNumber(response?.sourceDetailNumber);
                if (listFile.length === 0) {
                    response?.files?.forEach((element) => {
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
                        setListFile((prev) =>
                            !prev.find((t) => t.id === item.id) ? [...prev, item] : [...prev],
                        );
                    });
                }
                setIsChangeable(response?.changeable);
                setComments(response?.comments);

                setDateTimeInfoState({
                    ...dateTimeInfoState,
                    date: dayjs(response.createdDate).toDate(),
                    time: dayjs(response.createdDate).format('HH:mm'),
                });

                form.setFieldsValue({
                    customerName: response?.customerName,
                    companyName: response?.companyName,
                    changeable: response?.changeable,
                    siteName: response?.siteName,
                    siteNoteTypeName: response?.siteNoteTypeName,
                    title: response?.title,
                    content1: response?.content1,
                    content2: response?.content2,
                    sourceCd: response?.sourceCd,
                    sourceName: response?.sourceName,
                    sourceNumber: response?.sourceNumber,
                    sourceDetailNumber: response?.sourceDetailNumber,
                });

                setIsUpdate(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const GetCollectionInfo = async (query) => {
        try {
            const response = await getInfoCollection(query).unwrap();
            // get data
            if (response) {
                let soureCD = '5';
                if (response?.receptionType === 1) {
                    soureCD = '2';
                } else if (response?.receptionType === 2) {
                    soureCD = '3';
                }
                setFormState((prev) => ({
                    ...prev,
                    customerCd: response?.customerCD,
                    customerName: response?.customerName,
                    companyCd: response?.companyCD,
                    companyName: response?.companyName,
                    siteCd: response?.siteCD,
                    siteName: response?.siteName,
                    sourceCd: soureCD,
                    sourceNumber: response?.sourceNumber,
                    sourceDetailNumber:
                        response?.receptionType === 5 ? response?.sourceDetailNumber : null,
                    hidden: '表示',
                    createdBy: user?.employeeName,
                }));
                setSourceCd(soureCD);
                setSourceNumber(response?.sourceNumber);
                setSourceDetailNumber(
                    response?.receptionType === 5 ? response?.sourceDetailNumber : null,
                );

                form.setFieldsValue({
                    customerName: response?.customerName,
                    companyName: response?.companyName,
                    siteName: response?.siteName,
                    sourceCd: soureCD,
                    sourceNumber: response?.sourceNumber,
                    sourceDetailNumber:
                        response?.receptionType === 5 ? response?.sourceDetailNumber : null,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const valueContent1 = Form.useWatch('content1', form);
    const valueContent2 = Form.useWatch('content2', form);
    const valueChangeable = Form.useWatch('changeable', form);

    const getSiteNoteWithDispatchStatus = async (
        dataDispatchStatus,
        companyCd: string,
        siteCd: string,
    ) => {
        try {
            const response = await getSitesByCompany({ companyCd, siteCd }).unwrap();
            if (dataDispatchStatus && response) {
                let sourceCD;
                if (dataDispatchStatus.slipTypeCd === 100) {
                    sourceCD = 2;
                } else if (dataDispatchStatus.slipTypeCd === 2) {
                    sourceCD = 3;
                }

                setFormState((prev) => ({
                    ...prev,
                    customerCd: response?.customerCd,
                    customerName: response?.customerName,
                    companyCd: dataDispatchStatus?.companyCd,
                    companyName: dataDispatchStatus?.companyName,
                    siteCd: dataDispatchStatus?.siteCd,
                    siteName: dataDispatchStatus?.siteName,
                    sourceCd: sourceCD,
                    sourceNumber: dataDispatchStatus?.dispatchSlipNo,
                    hidden: '表示',
                    createdBy: user?.employeeName,
                }));
                setSourceCd(sourceCD);
                setSourceNumber(dataDispatchStatus?.dispatchSlipNo);

                form.setFieldsValue({
                    customerName: response?.customerName,
                    companyName: dataDispatchStatus?.companyName,
                    changeable: true,
                    siteName: dataDispatchStatus?.siteName,
                    sourceCd: sourceCD,
                    sourceNumber: dataDispatchStatus?.sourceNumber,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (systemId) {
            GetSiteNodeInfo({ systemId: +systemId });
        } else if (seq) {
            GetCollectionInfo({ seqNo: +seq });
        } else if (isDispatchStatus) {
            if (dispatchStatus && companyCD && siteCD) {
                getSiteNoteWithDispatchStatus(dispatchStatus, companyCD, siteCD);
            }
        } else {
            setFormState((prev) => ({
                ...prev,
                changeable: true,
                hidden: '表示',
                createdBy: user?.employeeName,
            }));
        }
    }, [systemId, seq]);

    useEffect(() => {
        if (sourceCd) {
            setFormState((prev) => ({
                ...prev,
                sourceName: sourceCd ? SOURCE_CONST[sourceCd].name : '',
                sourceCd: sourceCd ? SOURCE_CONST[sourceCd].cd : '',
                sourceNumber,
                sourceDetailNumber,
                content2: null,
            }));
        }
    }, [sourceCd, sourceNumber, sourceDetailNumber]);

    useEffect(() => {
        if (customerList) {
            setListCustomerState(customerList.items);
        }

        if (companyList) {
            setListCompanyState(companyList.items);
        }

        if (sitesList) {
            setListSiteState(sitesList.items);
        }

        if (noteTypeList) {
            setListNoteTypeState(noteTypeList.items);
        }

        if (titleList) {
            setListTitleState(titleList.items);
        }
    }, [customerList, companyList, sitesList, noteTypeList, titleList]);

    const apifunnelFunc = (search: string, cb: any, field = 0): void => {
        const pagination = {
            search,
            field,
            page: 1,
            size: 10,
        };

        cb(pagination).unwrap();
    };

    const getApiFunnel = (): void => {
        try {
            switch (funnelType) {
                case FUNNEL_TYPE.CUSTOMER:
                    apifunnelFunc(searchCustomer, getCustomers);
                    break;
                case FUNNEL_TYPE.COMPANY:
                    apifunnelFunc(searchCompany, getCompanies);
                    break;
                case FUNNEL_TYPE.SITE:
                    apifunnelFunc(searchSite, getSites);
                    break;
                case FUNNEL_TYPE.NOTE_TYPE:
                    apifunnelFunc(searchNoteType, getNoteTypes);
                    break;
                case FUNNEL_TYPE.TITLE:
                    apifunnelFunc(searchTitle, getTitles);
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (open) {
            getApiFunnel();
        }
    }, [open, searchCustomer, searchCompany, searchSite, searchNoteType, searchTitle]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        if (type) {
            switch (type) {
                case FUNNEL_TYPE.CUSTOMER:
                    setSearchCustomer(event.target.value);
                    break;
                case FUNNEL_TYPE.COMPANY:
                    setSearchCompany(event.target.value);
                    break;
                case FUNNEL_TYPE.SITE:
                    setSearchSite(event.target.value);
                    break;
                case FUNNEL_TYPE.NOTE_TYPE:
                    setSearchNoteType(event.target.value);
                    break;
                case FUNNEL_TYPE.TITLE:
                    setSearchTitle(event.target.value);
                    break;
                default:
                    break;
            }
        }
    };

    const moreDataFunc = async (
        pagination: any,
        cb_1: any,
        cb_2: any,
        list_state: any,
    ): Promise<void> => {
        const response = await cb_1(pagination).unwrap();
        if (response) {
            cb_2([...list_state, ...response.items]);
        }
    };

    const loadMoreData = async (type: string) => {
        setPaginations({ ...paginations, page: paginations.page + 1 });
        const newPaginations = { ...paginations, page: paginations.page + 1 };
        try {
            switch (type) {
                case FUNNEL_TYPE.CUSTOMER:
                    moreDataFunc(
                        newPaginations,
                        getCustomers,
                        setListCustomerState,
                        listCustomerState,
                    );
                    break;
                case FUNNEL_TYPE.COMPANY:
                    moreDataFunc(
                        newPaginations,
                        getCompanies,
                        setListCompanyState,
                        listCompanyState,
                    );
                    break;
                case FUNNEL_TYPE.SITE:
                    moreDataFunc(
                        newPaginations,
                        getSites,
                        setListSiteState,
                        listSiteState,
                    );
                    break;

                case FUNNEL_TYPE.NOTE_TYPE:
                    moreDataFunc(newPaginations, getNoteTypes, setListNoteTypeState, listNoteTypeState);
                    break;
                case FUNNEL_TYPE.TITLE:
                    moreDataFunc(newPaginations, getTitles, setListTitleState, listTitleState);
                    break;

                default:
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const selectItemFunc = (
        field_state_code: string,
        field_state_name: string,
        code_val: string,
        name_val: string,
    ): void => {
        setFormState((prev) => ({
            ...prev,
            [field_state_name]: name_val,
            [field_state_code]: code_val,
        }));

        form.setFieldsValue({
            [field_state_name]: name_val,
        });
    };

    const handleSelectItem = async (item: any, type: string) => {
        setDefaultValue('');

        switch (type) {
            case FUNNEL_TYPE.CUSTOMER:
                setOpenFilter(false);
                await selectItemFunc('customerCd', 'customerName', item.cd, item.name);
                break;
            case FUNNEL_TYPE.COMPANY:
                setOpenFilter(false);
                await selectItemFunc('companyCd', 'companyName', item.cd, item.name);
                break;
            case FUNNEL_TYPE.SITE:
                setOpenFilter(false);
                await selectItemFunc('siteCd', 'siteName', item.cd, item.name);
                break;
            case FUNNEL_TYPE.NOTE_TYPE:
                setOpenFilter(false);
                await selectItemFunc('siteNoteTypeCd', 'siteNoteTypeName', item.cd, item.name);
                break;
            case FUNNEL_TYPE.TITLE:
                setOpen(false);
                await selectItemFunc('titleCd', 'title', item.key, item.name);
                break;

            default:
                break;
        }

        if (type === FUNNEL_TYPE.COMPANY) {
            setSearchSite(item.name);
            setFormState((prev) => ({
                ...prev,
                customerCd: item.customerCd,
                customerName: item.customerName,
                siteName: null,
                siteCd: null,
            }));

            form.setFieldsValue({
                customerName: item.customerName,
                siteName: null,
            });
        }

        if (type === FUNNEL_TYPE.SITE) {
            setFormState((prev) => ({
                ...prev,
                customerCd: item.customerCd,
                customerName: item.customerName,
                companyName: item.companyName,
                companyCd: item.companyCd,
            }));

            form.setFieldsValue({
                customerName: item.customerName,
                companyName: item.companyName,
            });
        }
    };

    const handleSwitchChange = () => {
        setIsChangeable(!isChangeable);
    };

    const handleFunnel = (type: string) => {
        setFunnelType(type);
        switch (type) {
            case FUNNEL_TYPE.CUSTOMER:
                setOpenFilter(true);
                setTypeModal(1);
                settitleModal('取引先');

                break;
            case FUNNEL_TYPE.COMPANY:
                setOpenFilter(true);
                setTypeModal(2);
                settitleModal('業者');

                break;
            case FUNNEL_TYPE.SITE:
                setOpenFilter(true);
                setTypeModal(3);
                settitleModal('現場');
                setDefaultValue(formState?.companyName);

                break;
            case FUNNEL_TYPE.NOTE_TYPE:
                setOpenFilter(true);
                setTypeModal(4);
                settitleModal('分類');

                break;
            case FUNNEL_TYPE.TITLE:
                setOpen(true);

                break;

            default:
                break;
        }
    };

    // const CheckUploadFileSize = (files): boolean => {
    //     if (maxSize) {
    //         const maxUploadSize = maxSize * 1000000;
    //         const fileSize = files.reduce((prev, cur) => prev + cur.size, 0);
    //         if (fileSize > maxUploadSize) return false;
    //         return true;
    //     }

    //     return false;
    // };

    const validFileSize = async (file): Promise<{ isAllow: boolean, maxFileSize: number }> => {
        const maxFileSize = await getMaxSize().unwrap();
        if (maxFileSize) {
            const maxUploadSize = maxFileSize * 1000000;
            if (file.size > maxUploadSize) return { isAllow: false, maxFileSize };
            return { isAllow: true, maxFileSize };
        }
        return { isAllow: false, maxFileSize };
    };

    const handleFileUpload = async (file) => {
        const { isAllow, maxFileSize } = await validFileSize(file);
        if (isAllow) {
            const files = [...uploadedFile, file];
            const fileList = [...listFile, file];
            setUploadedFile(files);
            setListFile(fileList);

            setFormState((prev) => ({
                ...prev,
                files,
            }));
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

    const handleDelete = (fileId: string) => {
        if (fileId) {
            const listFiles = listFile.filter((file) => file.id !== fileId);
            const deleteFileId = +fileId
                ? [...formState.deleteFileIds, +fileId]
                : [...formState.deleteFileIds];
            if (!Number.isInteger(fileId)) {
                const updatedFiles = uploadedFile.filter((file) => file.id !== fileId);
                setUploadedFile(updatedFiles);
            }
            setListFile(listFiles);

            setFormState((prev) => ({
                ...prev,
                files: listFiles,
                deleteFileIds: deleteFileId,
            }));
        }
    };

    const clearInputFunc = (cb, code: string, name: string) => {
        cb('');

        setFormState((prev) => ({
            ...prev,
            [name]: null,
            [code]: null,
        }));

        form.setFieldsValue({
            [name]: null,
        });
    };

    const handleClearInput = (type: string) => {
        let isClear = true;
        if (
            isDelete === 'true' ||
            (!valueChangeable && formState.createdBy !== user?.employeeName)
        ) {
            isClear = false;
        }
        if (isClear) {
            switch (type) {
                case FUNNEL_TYPE.CUSTOMER:
                    clearInputFunc(setSearchCustomer, 'customerCd', 'customerName');

                    break;
                case FUNNEL_TYPE.COMPANY:
                    clearInputFunc(setSearchCompany, 'companyCd', 'companyName');
                    clearInputFunc(setSearchSite, 'siteCd', 'siteName');

                    break;
                case FUNNEL_TYPE.SITE:
                    clearInputFunc(setSearchSite, 'siteCd', 'siteName');

                    break;
                case FUNNEL_TYPE.NOTE_TYPE:
                    clearInputFunc(setSearchNoteType, 'siteNoteTypeCd', 'siteNoteTypeName');

                    break;
                case FUNNEL_TYPE.TITLE:
                    clearInputFunc(setSearchTitle, 'titleCd', 'title');

                    break;

                default:
                    break;
            }
        }
    };

    const handleChangeRadio = (event: RadioChangeEvent, type: string) => {
        if (type === FUNNEL_TYPE.SITE) {
            const pagination = {
                search: searchSite,
                field: event.target.value,
                page: 1,
                size: 10,
            };

            getSites(pagination).unwrap();
        }
    };

    const handleOnChangeContent1 = (event) => {
        let text = event.target.value;
        // const byteLength = new TextEncoder().encode(text).length;
        let textLength = text.length;
        const japaneseRegex =
            /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーａ-ｚＡ-Ｚ０-９々〆〤（）]+/gu;
        const japaneseWords = text.match(japaneseRegex);
        if (japaneseWords) {
            let totalCharacter = 0;
            japaneseWords.forEach(element => {
                totalCharacter += element.length;
                text = text.split(element).join('');
                textLength = text.length;
            });
            if (totalCharacter > 10) {
                setOverText1Length(true);
            } else {
                totalCharacter *= 2;
                if ((textLength + totalCharacter) > 20) {
                    setOverText1Length(true);
                } else {
                    setOverText1Length(false);
                }
            }
        } else {
            if (textLength > 20) {
                setOverText1Length(true);
            } else {
                setOverText1Length(false);
            }
        }
    };

    const handleOnChangeContent2 = (event) => {
        let text = event.target.value;
        let textLength = text.length;
        const japaneseRegex =
            /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーａ-ｚＡ-Ｚ０-９々〆〤（）]+/gu;
        const japaneseWords = text.match(japaneseRegex);
        if (japaneseWords) {
            let totalCharacter = 0;
            japaneseWords.forEach(element => {
                totalCharacter += element.length;
                text = text.split(element).join('');
                textLength = text.length;
            });
            if (totalCharacter > 10) {
                setOverText2Length(true);
            } else {
                totalCharacter *= 2;
                if ((textLength + totalCharacter) > 20) {
                    setOverText2Length(true);
                } else {
                    setOverText2Length(false);
                }
            }
        } else {
            if (textLength > 20) {
                setOverText2Length(true);
            } else {
                setOverText2Length(false);
            }
        }
    };

    const handleDeleteComment = (id: number) => {
        setComments(comments.filter((x) => x.detailSystemId !== id));
        let deleteCommentId = [id];
        if (formState.deleteCommentSystemIds) {
            deleteCommentId = [...formState.deleteCommentSystemIds, id];
        }
        setFormState((prev) => ({
            ...prev,
            deleteCommentSystemIds: deleteCommentId,
        }));
    };

    const jsonToFormData = (jsonData: any, jsonDataFile: any): FormData => {
        const formData = new FormData();
        formData.append('DataDto', JSON.stringify(jsonData));
        if (jsonDataFile) {
            Object.keys(jsonDataFile).forEach((key) =>
                formData.append('PostedFiles', jsonDataFile[key]),
            );
        }
        return formData;
    };

    const checkMaxLength = (value, maxLength1Byte) => {
        if (value) {
            let text = value;
            let textLength = text.length;
            const japaneseRegex =
                /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーａ-ｚＡ-Ｚ０-９々〆〤（）]+/gu;
            const japaneseWords = text.match(japaneseRegex);
            if (japaneseWords) {
                let totalCharacter = 0;
                japaneseWords.forEach(element => {
                    totalCharacter += element.length;
                    text = text.split(element).join('');
                    textLength = text.length;
                });
                if (totalCharacter > (maxLength1Byte / 2)) {
                    return true;
                }
                totalCharacter *= 2;
                if ((textLength + totalCharacter) > maxLength1Byte) {
                    return true;
                }
            } else {
                if (textLength > maxLength1Byte) {
                    return true;
                }
            }
        }
        return false;
    };

    const onFinish = async () => {
        formState.changeable = isChangeable;
        formState.title = form.getFieldValue('title') || null;
        formState.comment = form.getFieldValue('comment') || null;
        formState.content1 = form.getFieldValue('content1') || null;
        formState.content2 = form.getFieldValue('content2') || null;
        const { title, content1, customerName, companyName, siteName, siteNoteTypeName } =
            formState;

        let textConfirm = null;

        if (!customerName && !companyName && !siteName) {
            textConfirm = '取引先、業者、現場のいずれかを入力してください。';
        } else if (title === '' || title === null || title === 'null') {
            textConfirm = '表題を入力してください。';
        } else if (content1 === '' || content1 === null || content1 === 'null') {
            textConfirm = '内容をご入力ください。';
        } else if (checkMaxLength(title, 20)) {
            textConfirm = '表題は全角20文字以内で入力してください。';
        } else if (overText1Length || overText2Length) {
            textConfirm = '内容は全角20文字以内で入力してください。';
        }

        if (textConfirm) {
            openInformation({
                content: <div className='text-center text-ssm font-bold'>{textConfirm}</div>,
            });
        } else {
            if (isDelete) {
                openConfirm({
                    content: (
                        <div className='flex justify-center items-center mt-3 text-xl font-semibold text-red2a text-center w-full mb-4'>
                            <div>
                                現場メモデータを削除しますか？
                                <br />
                                ※削除後はデータをもとに戻すことはできません
                            </div>
                        </div>
                    ),
                    onOk: () => {
                        onHandleConfirm();
                    },
                });
            } else {
                openConfirm({
                    content: (
                        <div className='flex justify-center items-center text-md font-bold w-full text-center'>
                            <div>
                                現場メモ登録を行います。
                                <br />
                                よろしいですか？
                            </div>
                        </div>
                    ),
                    onOk: () => {
                        onHandleConfirm();
                    },
                });
            }
        }
    };

    const onHandleConfirm = async () => {
        const formData = jsonToFormData(formState, uploadedFile);
        try {
            if (isDelete && systemId) {
                const body = {
                    timeStamp: formState.timeStamp,
                };
                await deleteSiteNote({ systemId: +systemId, seq: seqNo, body }).unwrap();
            } else if (isUpdate && systemId) {
                if (
                    valueChangeable ||
                    (!valueChangeable && formState.createdBy === user?.employeeName)
                ) {
                    await putSiteNotes({
                        systemId: +systemId,
                        seq: seqNo,
                        body: formData,
                    }).unwrap();
                } else {
                    const body = {
                        comment: formState.comment,
                        timeStamp: formState.timeStamp,
                    };
                    const formDataComment = jsonToFormData(body, uploadedFile);
                    await putCommentSiteNotes({
                        systemId: +systemId,
                        seq: seqNo,
                        body: formDataComment,
                    }).unwrap();
                }
            } else {
                await postSiteNotes({ body: formData }).unwrap();
            }
            handleClickRollBack();
        } catch (error) {
            if (error?.data?.message) {
                // showErrorToast(error?.data?.message);
                return;
            }
            showErrorToast('Error');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleClickRollBack = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.SITE_NOTES}`);
    };

    return (
        <Layout
            isShowDate={false}
            isLoading={
                isloadingGetSiteNote ||
                isLoadingGetInfoCollection ||
                isLoadingDelete ||
                isLoadingSiteByCompany ||
                isLoadingDownload ||
                isLoadingPostSiteNote ||
                isLoadingPutSiteNote ||
                isLoadingPutCommentSiteNote
            }
            title='現場メモ登録'
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <div className='mt-header'>
                <TimeInfo {...dateTimeInfoState} />
                <Form
                    name='basic'
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'
                    className='form-memo'
                    form={form}
                >
                    <div className='grid grid-cols-2 gap-3 bg-white p-2'>
                        <Form.Item name='distinct'>
                            <div className='h-[40px] p-1'>
                                <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1'>
                                    区 分
                                </h3>
                            </div>
                            <Input
                                className='bg-grayE9 h-[40px] rounded w-full'
                                value={formState?.hidden}
                                readOnly
                                disabled={isDelete === 'true'}
                            />
                        </Form.Item>
                        <Form.Item name='distinct'>
                            <div className='h-[40px] p-1'>
                                <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1'>
                                    メモ番号
                                </h3>
                            </div>
                            <Input
                                className='bg-grayE9 h-[40px] rounded w-full'
                                value={formState?.siteNoteNumber}
                                readOnly
                                disabled={isDelete === 'true'}
                            />
                        </Form.Item>
                    </div>
                    {/* filter funnel */}
                    <div>
                        <div className='flex items-center bg-white mt-2 py-4 pl-[10px] gap-3'>
                            <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px]'>
                                取引先
                            </h3>
                            <div className='flex relative items-center justify-center h-[40px] w-[65%] rounded-md'>
                                <Form.Item name='customerName'>
                                    {valueChangeable ||
                                        (!valueChangeable && formState.createdBy === user?.employeeName) ? (
                                        <Input
                                            readOnly
                                            prefix={<SearchIcon className='searchSvg' />}
                                            suffix={
                                                formState?.customerName && (
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            handleClearInput(FUNNEL_TYPE.CUSTOMER);
                                                        }}
                                                    >
                                                        <img src={iconClose} alt='search' />
                                                    </button>
                                                )
                                            }
                                            disabled={isDelete === 'true'}
                                        />
                                    ) : (
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            readOnly
                                            disabled
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            {valueChangeable ||
                                (!valueChangeable && formState.createdBy === user?.employeeName) ? (
                                <button
                                    type='button'
                                    className='w-[50px] mr-[10px]'
                                    onClick={() => handleFunnel(FUNNEL_TYPE.CUSTOMER)}
                                    disabled={
                                        isDelete === 'true' ||
                                        (!valueChangeable && formState.createdBy !== user?.employeeName)
                                    }
                                >
                                    <FilterBorderSvg />
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='w-[50px] mr-[10px]'
                                    // onClick={() => handleFunnel(FUNNEL_TYPE.CUSTOMER)}
                                    disabled
                                >
                                    <FilterBorderSvg />
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center bg-white mt-2 py-4 pl-[10px] gap-3'>
                            <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px]'>
                                業者名
                            </h3>
                            <div className='flex relative items-center justify-center h-[40px] w-[65%] rounded-md'>
                                <Form.Item name='companyName'>
                                    {valueChangeable ||
                                        (!valueChangeable && formState.createdBy === user?.employeeName) ? (
                                        <Input
                                            readOnly
                                            prefix={<SearchIcon className='searchSvg' />}
                                            suffix={
                                                formState?.companyName && (
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            handleClearInput(FUNNEL_TYPE.COMPANY);
                                                        }}
                                                    >
                                                        <img src={iconClose} alt='search' />
                                                    </button>
                                                )
                                            }
                                            disabled={isDelete === 'true'}
                                        />
                                    ) : (
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            readOnly
                                            disabled
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            {valueChangeable ||
                                (!valueChangeable && formState.createdBy === user?.employeeName) ? (
                                <button
                                    type='button'
                                    className='w-[50px] mr-[10px]'
                                    onClick={() => handleFunnel(FUNNEL_TYPE.COMPANY)}
                                    disabled={
                                        isDelete === 'true' ||
                                        (!valueChangeable && formState.createdBy !== user?.employeeName)
                                    }
                                >
                                    <FilterBorderSvg />
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='w-[50px] mr-[10px]'
                                    // onClick={() => handleFunnel(FUNNEL_TYPE.CUSTOMER)}
                                    disabled
                                >
                                    <FilterBorderSvg />
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center bg-white mt-2 py-4 pl-[10px] gap-3'>
                            <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px]'>
                                現場名
                            </h3>
                            <div className='flex relative items-center justify-center h-[40px] w-[65%] rounded-md'>
                                <Form.Item name='siteName'>
                                    {valueChangeable ||
                                        (!valueChangeable && formState.createdBy === user?.employeeName) ? (
                                        <Input
                                            readOnly
                                            prefix={<SearchIcon className='searchSvg' />}
                                            suffix={
                                                formState?.siteName && (
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            handleClearInput(FUNNEL_TYPE.SITE);
                                                        }}
                                                    >
                                                        <img src={iconClose} alt='search' />
                                                    </button>
                                                )
                                            }
                                            disabled={isDelete === 'true'}
                                        />
                                    ) : (
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            readOnly
                                            disabled
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            {valueChangeable ||
                                (!valueChangeable && formState.createdBy === user?.employeeName) ? (
                                <button
                                    type='button'
                                    className='w-[50px] mr-[10px]'
                                    onClick={() => handleFunnel(FUNNEL_TYPE.SITE)}
                                    disabled={
                                        isDelete === 'true' ||
                                        (!valueChangeable && formState.createdBy !== user?.employeeName)
                                    }
                                >
                                    <FilterBorderSvg />
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='w-[50px] mr-[10px]'
                                    // onClick={() => handleFunnel(FUNNEL_TYPE.CUSTOMER)}
                                    disabled
                                >
                                    <FilterBorderSvg />
                                </button>
                            )}
                        </div>
                    </div>
                    {/* origin */}
                    <div>
                        <Form.Item name='sourceName'>
                            <div className='bg-white mt-2 py-4  pl-[10px]'>
                                <div className='flex gap-3'>
                                    <div>
                                        <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px]'>
                                            発生元
                                        </h3>
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            className='w-[96%] h-[40px] rounded bg-grayE9'
                                            value={sourceCd ? SOURCE_CONST[sourceCd].name : ''}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-3 pt-4'>
                                    <div>
                                        <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px] whitespace-nowrap'>
                                            伝票番号
                                        </h3>
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            className='w-[96%] h-[40px] rounded bg-grayE9'
                                            value={sourceNumber}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name='loginName'>
                            <div className='flex bg-white mt-2 py-4  pl-[10px] gap-3'>
                                <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px]'>
                                    登録者
                                </h3>
                                <div className='w-full'>
                                    <Input
                                        className='w-[96%] h-[40px] rounded bg-grayE9'
                                        value={formState?.createdBy}
                                        disabled
                                    />
                                </div>
                            </div>
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item name='changeable' valuePropName='checked'>
                            <div className='flex bg-white mt-2 py-4 pl-[10px] gap-3'>
                                <Switch
                                    className='mt-2'
                                    checked={!isChangeable}
                                    onChange={handleSwitchChange}
                                    disabled={
                                        isDelete === 'true' ||
                                        (!valueChangeable && formState.createdBy !== user?.employeeName)
                                    }
                                />
                                <p className='text-lg text-orange-700 tracking-wider'>
                                    初回登録者以外の修正/削除を禁止する
                                    <br />
                                    ※コメント/添付ファイルの追加は可
                                </p>
                            </div>
                        </Form.Item>
                    </div>
                    <FuncBlock
                        leftChild={
                            <div className='flex items-center '>
                                <h2 className='font-semibold text-white text-md mb-0 mr-3'>メモ</h2>
                            </div>
                        }
                    />
                    <div>
                        <div className='flex items-center bg-white py-4 pl-[10px] gap-3'>
                            <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px]'>
                                分類
                            </h3>
                            <div className='flex relative items-center justify-center h-[40px] w-[65%] rounded-md'>
                                <Form.Item name='siteNoteTypeName'>
                                    {valueChangeable ||
                                        (!valueChangeable && formState.createdBy === user?.employeeName) ? (
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            suffix={
                                                formState?.siteNoteTypeName && (
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            handleClearInput(FUNNEL_TYPE.NOTE_TYPE);
                                                        }}
                                                    >
                                                        <img src={iconClose} alt='search' />
                                                    </button>
                                                )
                                            }
                                            readOnly
                                            disabled={isDelete === 'true'}
                                        />
                                    ) : (
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            readOnly
                                            disabled
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <button
                                type='button'
                                className='w-[50px] mr-[10px]'
                                onClick={() => handleFunnel(FUNNEL_TYPE.NOTE_TYPE)}
                                disabled={
                                    isDelete === 'true' ||
                                    (!valueChangeable && formState.createdBy !== user?.employeeName)
                                }
                            >
                                <FilterBorderSvg />
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center bg-white mt-2 py-4 pl-[10px] gap-3'>
                            <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px]'>
                                表題
                            </h3>
                            <div className='flex relative items-center justify-center h-[40px] w-[65%] rounded-md'>
                                <Form.Item name='title'>
                                    {valueChangeable ||
                                        (!valueChangeable && formState.createdBy === user?.employeeName) ? (
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            suffix={
                                                formState?.title && (
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            handleClearInput(FUNNEL_TYPE.TITLE);
                                                        }}
                                                    >
                                                        <img src={iconClose} alt='search' />
                                                    </button>
                                                )
                                            }
                                            disabled={isDelete === 'true'}
                                        />
                                    ) : (
                                        <Input
                                            prefix={<SearchIcon className='searchSvg' />}
                                            readOnly
                                            disabled
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <button
                                type='button'
                                className='w-[50px] mr-[10px]'
                                onClick={() => handleFunnel(FUNNEL_TYPE.TITLE)}
                                disabled={
                                    isDelete === 'true' ||
                                    (!valueChangeable && formState.createdBy !== user?.employeeName)
                                }
                            >
                                <FilterBorderSvg />
                            </button>
                        </div>
                    </div>
                    <div>
                        <Form.Item name='content1'>
                            <div className='flex bg-white mt-2 py-4  pl-[10px] gap-3'>
                                <h3 className='text-lg font-medium leading-[100%] tracking-wide text-green1A py-1 min-w-[90px]'>
                                    内容
                                </h3>
                                <div className='w-full'>
                                    <Input
                                        value={valueContent1}
                                        className='w-[96%] h-[40px] rounded '
                                        onChange={(e) => handleOnChangeContent1(e)}
                                        disabled={
                                            isDelete === 'true' ||
                                            (!valueChangeable && formState.createdBy !== user?.employeeName)
                                        }
                                    />
                                </div>
                            </div>
                        </Form.Item>
                        <Form.Item name='content2'>
                            <div className='flex bg-white pb-4  pl-[10px] gap-3'>
                                <div className='text-lg font-medium leading-[100%] tracking-wide py-1 min-w-[90px]' />
                                <div className='w-full'>
                                    <Input
                                        value={valueContent2}
                                        className='w-[96%] h-[40px] rounded '
                                        onChange={(e) => handleOnChangeContent2(e)}
                                        disabled={
                                            isDelete === 'true' ||
                                            (!valueChangeable && formState.createdBy !== user?.employeeName)
                                        }
                                    />
                                </div>
                            </div>
                        </Form.Item>
                    </div>

                    <FuncBlock
                        leftChild={
                            <div className='flex items-center '>
                                <h2 className='font-semibold text-white text-md mb-0 mr-3'>コメント</h2>
                            </div>
                        }
                    />
                    <div className='p-3'>
                        <Form.Item name='comment'>
                            <Input
                                className='w-full h-[40px] rounded'
                                placeholder='新しいコメントを入力してください'
                                disabled={isDelete === 'true'}
                            />
                        </Form.Item>

                        {comments?.length === 0 && (
                            <p className='font-medium text-lg text-yellow-600 tracking-wide mt-1'>
                                コメント情報はありません
                            </p>
                        )}

                        {comments?.length > 0 &&
                            comments?.map((comment) => (
                                <div
                                    className='mt-4 p-3 bg-white rounded-lg'
                                    key={comment?.detailSystemId}
                                >
                                    <div className='py-2 border-b-2'>
                                        <div className='text-lg font-semibold comment-employee-name'>
                                            <span className='ml-3'>{comment?.commentedBy}</span>
                                        </div>
                                        <div className='text-black52'>
                                            {comment?.comment !== 'null' ? comment?.comment : ''}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 py-2'>
                                        <div className='flex gap-2 items-center'>
                                            <img
                                                src={iconCalendar}
                                                className='text-black52 object-contain w-[20px]'
                                                alt='icon'
                                            />
                                            <h2 className='text-sm text-black52 font-medium capitalize mb-0'>
                                                {dayjs(comment?.commentedDate).format('YYYY/MM/DD')}
                                            </h2>
                                        </div>
                                        {(valueChangeable ||
                                            (!valueChangeable &&
                                                formState.createdBy === user?.employeeName)) && (
                                                <div className='border-l-2 flex gap-2 justify-end items-center text-sm text-red2a'>
                                                    削除
                                                    <button
                                                        disabled={isDelete === 'true'}
                                                        type='button'
                                                        onClick={() =>
                                                            handleDeleteComment(comment?.detailSystemId)
                                                        }
                                                        className='w-[20px]'
                                                    >
                                                        <img src={iconDelete} alt='delete' />
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                    </div>

                    {user?.allowSiteNotesFileUpload === true && (
                        <>
                            <div className='w-full px-4  py-2 flex justify-between items-center bg-green15'>
                                <div className='flex items-center'>
                                    <h2 className='font-semibold text-white text-md mb-0 mr-3'>添付ファイル</h2>
                                </div>

                                {user?.allowSiteNotesFileUpload === true && isDelete !== 'true' && (
                                    <UploadFile onFileUpload={handleFileUpload}>
                                        <div role='button' className='bg-white rounded-full w-8 h-8'>
                                            <UploadIcon className='w-full h-full object-cover p-2' />
                                        </div>
                                    </UploadFile>
                                )}
                            </div>

                            <div className='p-3'>
                                {listFile?.length > 0 &&
                                    listFile.map((file) => (
                                        <div
                                            key={file.id}
                                            className='upload-file w-full rounded flex justify-between gap-1 py-1'
                                        >
                                            <div
                                                className={`flex items-center gap-1 text-sm ${!valueChangeable &&
                                                    formState.createdBy !== user?.employeeName
                                                    ? 'w-[88%]'
                                                    : 'w-[80%]'
                                                    } h-[50px] bg-white pl-2`}
                                            >
                                                <img src={file.icon} alt='' />
                                                <span className='truncate'>{file.name}</span>
                                            </div>
                                            <div className='flex gap-1 h-[50px] bg-white p-1 items-center'>
                                                <button type='button' onClick={() => handleDownload(file)}>
                                                    <DownloadIcon className='' />
                                                </button>
                                                {(valueChangeable ||
                                                    (!valueChangeable &&
                                                        formState.createdBy === user?.employeeName)) && (
                                                        <button
                                                            type='button'
                                                            onClick={() => handleDelete(file.id)}
                                                            disabled={isDelete === 'true'}
                                                        >
                                                            <img src={iconDelete} alt='delete' />
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    ))}

                                {listFile?.length === 0 && (
                                    <p className='font-medium text-lg text-yellow-600 tracking-wide'>
                                        添付ファイルはありません
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {!isDelete && (
                        <Form.Item>
                            <div className='p-3'>
                                <Button
                                    htmlType='submit'
                                    block
                                    className='bg-green1A px-3 h-11 rounded text-white'
                                >
                                    <div className='flex justify-center gap-3 text-sm'>
                                        登録 <img src={iconSubmit} alt='submit' />
                                    </div>
                                </Button>
                            </div>
                        </Form.Item>
                    )}
                    {isDelete && (
                        <Form.Item>
                            <div className='p-3'>
                                <Button
                                    className='bg-red2a text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center gap-3 btn-receipt'
                                    htmlType='submit'
                                >
                                    削除
                                    <img src={iconWhiteDelete} alt='submit' />
                                </Button>
                            </div>
                        </Form.Item>
                    )}
                </Form>
            </div>

            {funnelType === FUNNEL_TYPE.TITLE && (
                <SelectValueModal
                    open={open}
                    setOpen={setOpen}
                    handleInputChange={(e) => handleInputChange(e, FUNNEL_TYPE.TITLE)}
                    handleSelectItem={(data) => handleSelectItem(data, FUNNEL_TYPE.TITLE)}
                    listProducts={listTitleState}
                    isLoading={isLoadingGetTitles}
                    loadMoreData={async () => {
                        loadMoreData(FUNNEL_TYPE.TITLE);
                    }}
                    products={titleList}
                    title='表題'
                />
            )}
            {/* Modal  */}
            {openFilter && (
                <SiteNoteModal
                    open={openFilter}
                    setOpen={setOpenFilter}
                    handleSelectItem={(data) => handleSelectItem(data, funnelType)}
                    title={titleModal}
                    defaultValue={defaultValue}
                    setDefaultValue={setDefaultValue}
                    type={typeModal}
                />
            )}
        </Layout>
    );
};
export default SiteNoteInput;
