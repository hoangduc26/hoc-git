/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import { Avatar, Button, Input } from 'antd';
import Layout from 'components/templates/Layout';
import iconRedClear from 'assets/icons/ic_red_clear.svg';
import iconSearch from 'assets/icons/ic_search.svg';
import iconDelete from 'assets/icons/ic_delete.svg';
import iconSubmit from 'assets/icons/ic_submit.svg';
import iconWhiteDelete from 'assets/icons/ic-white-delete.svg';
import React, { useEffect, useState } from 'react';
import FuncBlock from 'components/common/FuncBlock';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { CONSTANT_ROUTE, STATUS_CODE } from 'utils/constants';
import { useAppSelector } from 'store/hooks';
import { openConfirm, openInformation } from 'utils/functions';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Container from 'components/organisms/container';
import { UserOutlined } from '@ant-design/icons';
import {
    useDeleteGroupsMutation,
    useLazyGetGroupByGroupIdQuery,
    usePostGroupsMutation,
    usePutGroupsMutation,
} from 'services/chat';
import { useLazyGetInfoCollectionQuery } from 'services/collection';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FilterSvg } from 'components/icons/FilterSvg';
import ModalSelectUser from './ModalSelectUser';
import ModalSelectCompany from '../ModalFilter/ModalSelectCompany';
import ModalSelectSites from '../ModalFilter/ModalSelectSite';
import './index.scss';

interface IFormValue {
    companyCd: string;
    companyName: string;
    siteCd: string;
    siteName: string;
    groupName: string;
    members: IFormMembersValue[];
    timeStamp: string;
}

interface IFormMembersValue {
    loginId: string;
    employeeCd: string;
    employeeName: string;
}

const GroupChatInput: React.FC = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [openModalCompany, setOpenModalCompany] = useState(false);
    const [openModalSites, setOpenModalSites] = useState(false);
    const [openModalMember, setOpenModalMember] = useState(false);
    const [defaultValue, setDefaultValue] = useState('');
    const [listEmployeeCds, setListEmployeeCds] = useState<string[]>([]);
    const [params] = useSearchParams();
    const isDelete = params.get('isDelete');
    const groupId = params.get('groupId');
    const seq = params.get('seq');

    const [getGroupChatInput, responseGetGroupChatInput] = useLazyGetGroupByGroupIdQuery();
    const [getInfoCollection, responseGetInfoCollection] = useLazyGetInfoCollectionQuery();
    const [postGroupChat, responsePostGroupChat] = usePostGroupsMutation();
    const [putGroupChat, responsePutGroupChat] = usePutGroupsMutation();
    const [deleteGroupChat, responseDeleteGroupChat] = useDeleteGroupsMutation();

    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.GROUP_CHAT_INPUT],
    );

    const defaultValues: IFormValue = {
        companyCd: null,
        companyName: null,
        siteCd: null,
        siteName: null,
        groupName: null,
        members: [],
        timeStamp: null,
    };

    const { control, formState, watch, setValue, handleSubmit, reset } = useForm<IFormValue>({
        defaultValues,

        resolver: yupResolver(
            yup.object().shape({
                groupName: yup.string().nullable().required('グループ名を入力してください'),
            }),
        ),
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'members',
    });

    const detailValues = useWatch({
        name: 'members',
        control,
    });

    useEffect(() => {
        if (seq) {
            getCollectionInfo({ seqNo: +seq });
        } else {
            handleGetData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const getCollectionInfo = async (query) => {
        try {
            const response = await getInfoCollection(query).unwrap();
            // get data
            if (response) {
                const formValue: IFormValue = {
                    ...defaultValues,
                    companyCd: response?.companyCD,
                    companyName: response?.companyName,
                    siteCd: response?.siteCD,
                    siteName: response?.siteName,
                    groupName: response?.siteName,
                };
                reset(formValue);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetData = async () => {
        if (groupId) {
            if (!isDelete) {
                setIsEdit(true);
            }
            await getGroupChatInput({ groupId }).unwrap();
        }
    };

    useEffect(() => {
        if (
            responseGetGroupChatInput.data &&
            responseGetGroupChatInput.status === STATUS_CODE.fulfilled
        ) {
            if (responseGetGroupChatInput.data.members?.length > 0) {
                const employeeCd = responseGetGroupChatInput.data.members.map(
                    (item) => item.employeeCd,
                );
                setListEmployeeCds(employeeCd);
            }
            reset(responseGetGroupChatInput.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responseGetGroupChatInput]);

    useEffect(() => {
        if (Object.keys(formState?.errors)?.length > 0) {
            let messageErr = '';
            const { errors } = formState;
            if (errors.groupName) {
                messageErr = errors.groupName.message;
            }
            openInformation({
                content: <div className='text-center text-ssm font-bold'>{messageErr}</div>,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState.errors]);

    const handleSelectItemCompany = (item: any) => {
        setOpenModalCompany(false);
        setValue('companyCd', item.companyCd);
        setValue('companyName', item.companyName);
        setValue('siteCd', '');
        setValue('siteName', '');
    };

    const handleSelectItemSite = (item: any) => {
        setDefaultValue('');
        setOpenModalSites(false);
        setValue('siteCd', item.siteCd);
        setValue('siteName', item.siteName);
        setValue('companyCd', item.companyCd);
        setValue('companyName', item.companyName);
    };

    const handleSelectModalMember = async (d) => {
        const checkEmoloyee = await checkEmployeeExsit(d);
        if (!checkEmoloyee) {
            setListEmployeeCds((oldArray) => [...oldArray, d.employeeCd]);
            append({
                loginId: d.loginId,
                employeeCd: d.employeeCd,
                employeeName: d.employeeName,
            });
        }
        setOpenModalMember(false);
    };
    const checkEmployeeExsit = (employee) => {
        const result = detailValues.find(
            (x) => x.loginId === employee.loginId && x.employeeCd === employee.employeeCd,
        );
        if (result) {
            return true;
        }
        return false;
    };

    const deleteEmployee = (item, index) => {
        remove(index);
        setListEmployeeCds(listEmployeeCds.filter((x) => x !== item.employeeCd));
    };

    const onSubmit = (data: any) => {
        openConfirm({
            content: (
                <div className='flex justify-center items-center text-md font-bold w-full text-center'>
                    <div>
                        現場チャットを{isDelete ? '削除' : '登録'}します。
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),
            onOk: () => {
                if (isEdit) {
                    updateGroupChat(data);
                } else if (isDelete) {
                    handleDeleteGroupChat(data);
                } else {
                    insertGroupChat(data);
                }
            },
        });
    };

    const insertGroupChat = async (data: IFormValue) => {
        try {
            const body = {
                groupName: data.groupName,
                companyCd: data.companyCd,
                siteCd: data.siteCd,
                employeeCds: listEmployeeCds,
            };
            const response: any = await postGroupChat({ body });
            if (response && !response.error) {
                // success
                handleClickRollBack();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateGroupChat = async (data: IFormValue) => {
        try {
            const body = {
                groupName: data.groupName,
                companyCd: data.companyCd,
                siteCd: data.siteCd,
                employeeCds: listEmployeeCds,
                timeStamp: data.timeStamp,
            };
            const response: any = await putGroupChat({ groupId, body });
            if (response && !response.error) {
                // success
                handleClickRollBack();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteGroupChat = async (data: IFormValue) => {
        try {
            const body = {
                timeStamp: data.timeStamp,
            };
            const response: any = await deleteGroupChat({ groupId, body });
            if (response && !response.error) {
                // success
                handleClickRollBack();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickRollBack = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.GROUP_CHAT_LIST}`);
    };

    return (
        <Layout
            title={isDelete ? '現場チャット削除' : '現場チャット登録'}
            isShowDate={false}
            isLoading={
                responseGetGroupChatInput.isLoading ||
                responseGetGroupChatInput.isFetching ||
                responsePostGroupChat.isLoading ||
                responsePutGroupChat.isLoading ||
                responseGetInfoCollection.isLoading ||
                responseGetInfoCollection.isFetching ||
                responseDeleteGroupChat.isLoading
            }
            isShowRollback
            onClickRollback={handleClickRollBack}
            fixedHeader
        >
            <form onSubmit={handleSubmit(onSubmit)} className='mt-header form-group-chat'>
                <div className='bg-white'>
                    <div className='flex items-center gap-2 border-b border-grayE9 p-4'>
                        <div className='text-md text-green1A whitespace-nowrap md:min-w-[112px]'>
                            業者名
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
                                        !isDelete && field.value && (
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    setValue('companyName', '');
                                                    setValue('companyCd', '');
                                                    setValue('siteName', '');
                                                    setValue('siteCd', '');
                                                }}
                                            >
                                                <img src={iconRedClear} alt='iconRedClear' />
                                            </button>
                                        )
                                    }
                                    disabled={isDelete === 'true'}
                                />
                            )}
                            name='companyName'
                            control={control}
                            defaultValue=''
                        />
                        <Button
                            onClick={() => {
                                setOpenModalCompany(true);
                            }}
                            className='border-green15 min-w-[40px]'
                            icon={
                                <div className='w-6 h-6'>
                                    <FilterSvg className='w-full h-full object-cover' />
                                </div>
                            }
                            size='large'
                            disabled={isDelete === 'true'}
                        />
                    </div>

                    <div className='flex items-center gap-2 border-b border-grayE9 p-4'>
                        <div className='text-md text-green1A whitespace-nowrap md:min-w-[112px]'>
                            現場名
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
                                        !isDelete && field.value && (
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    setValue('siteName', '');
                                                    setValue('siteCd', '');
                                                }}
                                            >
                                                <img src={iconRedClear} alt='iconRedClear' />
                                            </button>
                                        )
                                    }
                                    disabled={isDelete === 'true'}
                                />
                            )}
                            name='siteName'
                            control={control}
                            defaultValue=''
                        />
                        <Button
                            onClick={() => {
                                setOpenModalSites(true);
                                setDefaultValue(watch('companyName'));
                            }}
                            className='border-green15 min-w-[40px]'
                            icon={
                                <div className='w-6 h-6'>
                                    <FilterSvg className='w-full h-full object-cover' />
                                </div>
                            }
                            size='large'
                            disabled={isDelete === 'true'}
                        />
                    </div>

                    <div className='p-4'>
                        <div className='text-md text-green1A whitespace-nowrap md:min-w-[112px] mb-1'>
                            グループ名
                        </div>
                        <Controller
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    maxLength={20}
                                    size='middle'
                                    allowClear={{
                                        clearIcon: (
                                            !isDelete && (
                                                <div className='w-5 h-5'>
                                                    <img
                                                        className='w-full h-full object-cover'
                                                        src={iconRedClear}
                                                        alt='iconRedClear'
                                                    />
                                                </div>
                                            )
                                        ),
                                    }}
                                    className='!border-grayD4'
                                    disabled={isDelete === 'true'}
                                />
                            )}
                            name='groupName'
                            control={control}
                            defaultValue=''
                        />
                    </div>
                </div>
                <FuncBlock
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                メンバ選択
                            </h2>
                            <span className='text-sm px-2 bg-red2a text-yellow59 rounded font-bold'>
                                {fields ? fields?.length : 0}
                            </span>
                        </div>
                    }
                    isShowRightIcon={isDelete ? false : true}
                    onClickIcon={() => setOpenModalMember(true)}
                />
                {fields?.length > 0 && (
                    <div className='px-4'>
                        {fields?.length > 0 &&
                            fields.map((item, index) => (
                                <div className='pt-4' key={item.id}>
                                    <div className='bg-white rounded-lg shadow-md w-full flex justify-between items-center'>
                                        <div className='p-3 flex items-center w-full truncate gap-2'>
                                            <Avatar
                                                size='large'
                                                icon={<UserOutlined />}
                                                className='flex justify-center items-center'
                                            />
                                            <div className='w-5/6 truncate'>
                                                <div className='flex justify-between items-center'>
                                                    <span className='truncate font-semibold'>
                                                        {item.employeeName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {!isDelete && (<div className='h-[50px] p-3'>
                                            <button
                                                onClick={() => deleteEmployee(item, index)}
                                                type='button'
                                            >
                                                <img src={iconDelete} alt='delete' />
                                            </button>
                                        </div>)}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

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

                {/* Modal  */}
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
                {openModalMember && (
                    <ModalSelectUser
                        open={openModalMember}
                        setOpen={setOpenModalMember}
                        handleSelectItem={handleSelectModalMember}
                    />
                )}
            </form>
        </Layout>
    );
};
export default GroupChatInput;
