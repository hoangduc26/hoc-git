/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Collapse, Input, Modal, Switch } from 'antd';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Layout from 'components/templates/Layout';
import iconSearch from 'assets/icons/ic_search.svg';
import iconRedClear from 'assets/icons/ic_red_clear.svg';
import iconChevronDown from 'assets/icons/ic_chevron_down.svg';
import iconChevronUp from 'assets/icons/ic_chevron_up.svg';
import iconRedDelete from 'assets/icons/ic-red-delete.svg';
import FuncBlock from 'components/common/FuncBlock';
import {
    saveCacheGroupName,
    saveCacheSearchConditionGroups,
    useLazyGetGroupsQuery,
} from 'services/chat';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CONSTANT_ROUTE } from 'utils/constants';
import { useForm, Controller } from 'react-hook-form';
import { ParamsGroups } from 'models';
import { setPreviousPage } from 'services/page';
import './index.scss';
import { useLazyGetInfoCollectionQuery } from 'services/collection';
import { DEFAULT_SYSTEM_SETTING } from 'services/systemSetting';
import { FilterSvg } from 'components/icons/FilterSvg';
import { MessageSvg } from 'components/icons/MessageSvg';
import { BuildingOfficeIcon } from 'components/icons/BuildingOfficeIcon';
import { WebsiteIcon } from 'components/icons/WebsiteIcon';
import { EditIcon } from 'components/icons/EditIcon';
import ModalSelectCompany from '../ModalFilter/ModalSelectCompany';
import ModalSelectSites from '../ModalFilter/ModalSelectSite';

interface IFormSearchInput {
    siteCd: string;
    siteName: string;
    companyCd: string;
    companyName: string;
    SearchText?: string;
    onlyJoinedGroup: boolean;
    pageNumber: number;
    pageSize: number;
}

const GroupList: React.FC = () => {
    const pageSizeSystemSetting = useAppSelector(
        (state) => state.reducer.systemSetting?.systemSetting?.commonPageSize,
    );
    const pageSize = pageSizeSystemSetting || DEFAULT_SYSTEM_SETTING.commonPageSize;
    const [params] = useSearchParams();
    const seq = params.get('seq');

    const [listGroup, setListGroup] = useState([]);
    const [openModalCompany, setOpenModalCompany] = useState(false);
    const [openModalSites, setOpenModalSites] = useState(false);
    const [defaultValue, setDefaultValue] = useState('');

    const [getInfoCollection, responseGetInfoCollection] = useLazyGetInfoCollectionQuery();
    const [getGroupList, { data: groupData, isLoading, isFetching }] = useLazyGetGroupsQuery();

    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.GROUP_CHAT_LIST],
    );
    const cacheSearchCondition = useAppSelector(
        (state) => state.reducer.groupsChat.cacheSearchCondition,
    );
    const location = useLocation();
    const dispatch = useAppDispatch();
    const defaultValues: IFormSearchInput = {
        companyCd: '',
        companyName: '',
        siteCd: '',
        siteName: '',
        SearchText: '',
        onlyJoinedGroup: true,
        pageNumber: 1,
        pageSize,
    };

    const { control, setValue, getValues, handleSubmit, reset, resetField } =
        useForm<IFormSearchInput>({
            defaultValues: null,
        });

    useEffect(() => {
        if (seq) {
            GetCollectionInfo({ seqNo: +seq });
        } else {
            let formValue = defaultValues;
            if (cacheSearchCondition) {
                formValue = cacheSearchCondition;
            }
            reset(formValue);
            handleGetData(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const GetCollectionInfo = async (query) => {
        try {
            const response = await getInfoCollection(query).unwrap();
            // get data
            if (response) {
                const formValue: IFormSearchInput = {
                    ...defaultValues,
                    companyCd: response?.companyCD,
                    companyName: response?.companyName,
                    siteCd: response?.siteCD,
                    siteName: response?.siteName,
                };
                reset(formValue);
                handleGetData(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (data: IFormSearchInput) => {
        const formValue = getValues();
        dispatch(saveCacheSearchConditionGroups(formValue));
        handleGetData(true);
    };

    const handleLoadMore = () => {
        handleGetData(false);
    };

    const handleGetData = async (isSearch?) => {
        const formValue = getValues();
        const paramsRequest: ParamsGroups = {
            onlyJoinedGroup: formValue.onlyJoinedGroup,
            companyCd: formValue.companyCd,
            siteCd: formValue.siteCd,
            SearchText: formValue.SearchText,
            PageNumber: isSearch ? 1 : formValue.pageNumber + 1,
            PageSize: formValue.pageSize,
        };

        const response = await getGroupList(paramsRequest).unwrap();
        if (response) {
            setValue('pageNumber', paramsRequest.PageNumber);
            if (isSearch) {
                setListGroup(response.items);
            } else {
                setListGroup([...listGroup, ...response.items]);
            }
        }
    };

    const onChat = (item) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.ROOM_CHAT,
            }),
        );
        dispatch(saveCacheGroupName(item));
        navigate(`/${CONSTANT_ROUTE.ROOM_CHAT}?groupId=${item.groupId}`);
    };

    const handleSelectItemCompany = (item: any) => {
        setOpenModalCompany(false);
        setValue('companyCd', item.companyCd);
        setValue('companyName', item.companyName);
    };

    const handleSelectItemSite = (item: any) => {
        setDefaultValue('');
        setOpenModalSites(false);
        setValue('siteCd', item.siteCd);
        setValue('siteName', item.siteName);
        setValue('companyCd', item.companyCd);
        setValue('companyName', item.companyName);
    };

    const handleAddGroup = () => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.GROUP_CHAT_INPUT,
            }),
        );
        if (seq) {
            navigate(`/${CONSTANT_ROUTE.GROUP_CHAT_INPUT}?seq=${seq}`);
        } else {
            navigate(`/${CONSTANT_ROUTE.GROUP_CHAT_INPUT}`);
        }
    };

    const handleEditGroup = (item) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.GROUP_CHAT_INPUT,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.GROUP_CHAT_INPUT}?groupId=${item.groupId}`);
    };

    const handleDeleteGroup = (item) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.GROUP_CHAT_INPUT,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.GROUP_CHAT_INPUT}?isDelete=true&groupId=${item.groupId}`);
    };

    const handleClickRollBack = () => {
        if (seq) {
            navigate(previousUrl || `/${CONSTANT_ROUTE.MAIN_MENU}`);
        } else {
            navigate(`/${CONSTANT_ROUTE.MAIN_MENU}`);
        }
    };

    const [isOpenSearchConditions, setIsOpenSearchConditions] = useState(true);
    const fixedElementRef = useRef();
    const collapsedElementRef = useRef();
    const contentElementRef = useRef();
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
                if (documentElement.scrollTop >= 298) {
                    elementFixedOnScroll.style.position = 'fixed';
                    elementFixedOnScroll.style.width = '100%';
                    elementFixedOnScroll.style.top = '159px';
                    elementFixedOnScroll.style.zIndex = '10';
                    elementFixedOnScroll.style.borderTop = '1px solid white';
                    content.style.marginTop = '65px';
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
                content.style.marginTop = '222px';
            }
        }
    };

    return (
        <Layout
            title='現場チャット一覧'
            isShowDate={false}
            isLoading={
                isLoading ||
                isFetching ||
                responseGetInfoCollection.isLoading ||
                responseGetInfoCollection.isFetching
            }
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Collapse
                    onChange={($event) => handleChangeCollapse($event)}
                    defaultActiveKey='1'
                    ref={collapsedElementRef}
                    expandIconPosition='end'
                    className={`bg-green15 border !border-green15 rounded-none 
                    [&_.ant-collapse-header]:!items-center  
                    [&_.ant-collapse-header]:!fixed 
                    [&_.ant-collapse-header]:top-header 
                    [&_.ant-collapse-header]:bg-green15 
                    [&_.ant-collapse-header]:w-full 
                    [&_.ant-collapse-header]:z-10
                    [&_.ant-collapse-header]:left-0
                    [&_.ant-collapse-header]:!transition-none
                    groupchat-collapse ${
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
                                <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                    検索条件
                                </h2>
                            ),
                            className: 'collapse-panel-custom-group-chat',
                            children: isOpenSearchConditions && (
                                <div className='flex flex-col'>
                                    <div className='border-b border-grayE9 px-4 pb-4'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <div className='text-md text-green1A whitespace-nowrap'>
                                                業者名
                                            </div>
                                            <Controller
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        size='middle'
                                                        className='!border-grayD4'
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
                                                            field.value && (
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        setValue('companyCd', '');
                                                                        setValue('companyName', '');
                                                                        setValue('siteCd', '');
                                                                        setValue('siteName', '');
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
                                                name='companyName'
                                                control={control}
                                                defaultValue=''
                                            />
                                            <Button
                                                className='border-green15 min-w-[40px]'
                                                icon={
                                                    <div className='w-6 h-6'>
                                                        <FilterSvg className='w-full h-full object-cover' />
                                                    </div>
                                                }
                                                size='large'
                                                onClick={() => {
                                                    setOpenModalCompany(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='border-b border-grayE9 p-4'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <div className='text-md text-green1A whitespace-nowrap'>
                                                現場名
                                            </div>
                                            <Controller
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        size='middle'
                                                        className='!border-grayD4'
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
                                                            field.value && (
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        setValue('siteCd', '');
                                                                        setValue('siteName', '');
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
                                                name='siteName'
                                                control={control}
                                                defaultValue=''
                                            />
                                            <Button
                                                className='border-green15 min-w-[40px]'
                                                icon={
                                                    <div className='w-6 h-6'>
                                                        <FilterSvg className='w-full h-full object-cover' />
                                                    </div>
                                                }
                                                size='large'
                                                onClick={() => {
                                                    setOpenModalSites(true);
                                                    setDefaultValue(getValues('companyName'));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className='px-4 pt-4 border-b border-grayE9 pb-4'>
                                        <Controller
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
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
                                                    className='!border-grayD4'
                                                    placeholder='フリーワードで検索する'
                                                    prefix={
                                                        <div className='w-5 h-5'>
                                                            <img
                                                                src={iconSearch}
                                                                className='w-full h-full object-cover'
                                                                alt='iconSearch'
                                                            />
                                                        </div>
                                                    }
                                                />
                                            )}
                                            name='SearchText'
                                            control={control}
                                            defaultValue=''
                                        />
                                    </div>
                                    <div className='px-4 pt-4 flex items-center text-sm gap-x-2'>
                                        <Controller
                                            control={control}
                                            name='onlyJoinedGroup'
                                            render={({ field }) => (
                                                <Switch {...field} checked={field.value} />
                                            )}
                                        />
                                        <span>参加しているチャットのみ表示</span>
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />
                <div className='bg-green15 py-2' ref={fixedElementRef}>
                    <FuncBlock
                        leftChild={
                            <div className='flex items-center '>
                                <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                    現場チャット一覧
                                </h2>
                                <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold'>
                                    {groupData ? groupData.totalRecords : 0}
                                </span>
                            </div>
                        }
                        isShowRightIcon
                        isShowIconRefresh
                        onClickRefresh={handleSubmit(onSubmit)}
                        onClickIcon={handleAddGroup}
                    />
                </div>

                <div ref={contentElementRef}>
                    {listGroup &&
                        groupData &&
                        groupData.totalRecords !== 0 &&
                        listGroup.length > 0 &&
                        listGroup.map((item, index) => (
                            <div className={`px-4 ${index === 0 ? 'pt-4' : ''}`} key={item.groupId}>
                                <div className='bg-white rounded-lg shadow-md w-full mb-4'>
                                    {/* info */}
                                    <div className='flex items-center gap-3 relative p-3 pt-4 border-b-[1px] border-grayE9 h-full'>
                                        <div className='w-full'>
                                            <div className='flex items-center justify-between ml-2 mb-2'>
                                                <h2 className='text-xl font-semibold truncate'>
                                                    {item.groupName}
                                                </h2>
                                            </div>
                                            <div className='flex items-center gap-2 ml-2 mb-3'>
                                                <div className='w-6 h-6'>
                                                    <BuildingOfficeIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-black27 truncate'>
                                                    {item.companyName}
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 ml-2 mb-3'>
                                                <div className='w-6 h-6'>
                                                    <WebsiteIcon className='w-full h-full object-cover' />
                                                </div>
                                                <div className='text-sm text-black27 truncate'>
                                                    {item.siteName}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center p-4'>
                                        <div
                                            className='w-1/3 border-r-2 border-grayD4'
                                            onClick={() => onChat(item)}
                                        >
                                            <div className='flex items-center gap-2'>
                                                <div className='w-6 h-6'>
                                                    <MessageSvg className='w-full h-full object-cover' />
                                                </div>
                                                <p className='text-ssm text-green15 font-zenMaru'>
                                                    チャット
                                                </p>
                                            </div>
                                        </div>

                                        {/* Detail  */}
                                        <div
                                            className='w-1/3 border-r-2 border-grayD4'
                                            onClick={() => handleEditGroup(item)}
                                        >
                                            <div className='flex items-center gap-2 justify-center'>
                                                <p className='text-ssm text-green15 font-zenMaru'>
                                                    編集
                                                </p>

                                                <div className='w-6 h-6'>
                                                    <EditIcon className='w-full h-full object-cover' />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete  */}
                                        <div
                                            className='w-1/3'
                                            onClick={() => handleDeleteGroup(item)}
                                        >
                                            <div className='flex items-center gap-2 justify-end'>
                                                <p className='text-ssm text-red2a font-zenMaru'>
                                                    削除
                                                </p>

                                                <div className='w-6 h-6'>
                                                    <img
                                                        className='w-full h-full object-cover'
                                                        src={iconRedDelete}
                                                        alt='iconRedDelete'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    {(listGroup.length === 0 || (groupData && groupData.totalRecords === 0)) && (
                        <div className='p-4'>
                            <div className='text-sm text-yellow01'>グループはありません.</div>
                        </div>
                    )}
                    {listGroup.length < groupData?.totalRecords && (
                        <div className='px-[100px] pb-2'>
                            <Button
                                className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center'
                                onClick={handleLoadMore}
                            >
                                もっと見る
                            </Button>
                        </div>
                    )}
                </div>
                {/* Modal  */}
                {openModalCompany && (
                    <ModalSelectCompany
                        open={openModalCompany}
                        setOpen={setOpenModalCompany}
                        handleSelectItem={handleSelectItemCompany}
                    />
                )}
                {openModalSites && (
                    <ModalSelectSites
                        open={openModalSites}
                        setOpen={setOpenModalSites}
                        handleSelectItem={handleSelectItemSite}
                        defaultValue={defaultValue}
                        setDefaultValue={setDefaultValue}
                    />
                )}
            </form>
        </Layout>
    );
};

export default GroupList;
