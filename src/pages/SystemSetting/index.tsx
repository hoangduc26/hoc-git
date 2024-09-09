import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Radio, RadioChangeEvent, Select, Switch } from 'antd';
import iconTrashRemove from 'assets/icons/ic-red-delete.svg';
import iconInputClear from 'assets/icons/icon-input-clear.svg';
import iconInputSearch from 'assets/icons/ic_search.svg';
import { ModalSelectProduct } from 'components/common/Modal';
import ModalSelectBranch from 'components/common/Modal/ModalSelectBranch';
import ModalSelectDriver from 'components/common/Modal/ModalSelectDriver';
import ModalSelectSalePerson from 'components/common/Modal/ModalSelectSalePerson';
import ModalSelectSortOrderFields from 'components/common/Modal/ModalSelectSortOrderFields';
import ModalSelectVehicleType from 'components/common/Modal/ModalSelectVehicleType';
import Container from 'components/organisms/container';
import Layout from 'components/templates/Layout';
import { Product } from 'models';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import {
    COLLECTION_RESULT_INPUT_SETTING,
    CONSTANT_ROUTE,
    DEFAULT_COLOR,
    DISPATCH_TYPES,
    IMPORT_RECORD_REGISTRAION_SETTING,
    SETTING_PRODUCT_TYPE,
    SETTING_SEARCH_DISPATCH_STATUS,
    SETTING_WHEN_SELECT_VEHICLE,
    SORT_ORDER_FIELDS,
    SORT_TYPE,
    SPOT_CONVERT,
    SPOT_WORK_DATE_TYPE,
    WORK_LINE_VOUCHER_SETTING,
} from 'utils/constants';
import { openConfirm } from 'utils/functions';
import * as yup from 'yup';
import { FilterSvg } from 'components/icons/FilterSvg';
import { AddIcon } from 'components/icons/AddIcon';
import { saveSystemSettingToStore, useSaveSystemSettingMutation } from 'services/systemSetting';
import ModalSelectProductHasSearchType from '../../components/common/Modal/ModalSelectProductHasSearchType';

enum ModalName {
    BRANCH = 'branch',
    DRIVER = 'DRIVER',
    VEHICLE_TYPE = 'VEHICLETYPE',
    SALE_PERSON = 'SALE_PERSON',
    PRODUCT = 'PRODUCT',
    ORDER_FIELDS = 'ORDER_FIELDS',
}

const SystemSetting: React.FC = () => {
    const [titleSelectOptionModal, setTitleSelectOptionModal] = useState('');
    const [fieldNameSelected, setFieldNameSelected] = useState('');
    const [openModal, setOpenModal] = useState(null);
    const [defaultValueModal, setDefaultValueModal] = useState(null);

    const user = useAppSelector((state) => state.reducer.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [saveSystemSetting, responseSaveSystemSetting] = useSaveSystemSettingMutation();

    const initialValue = useAppSelector((state) => state.reducer.systemSetting?.systemSetting);
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.SYSTEM_SETTING],
    );

    const { register, handleSubmit, formState, getValues, control, setValue, watch } = useForm({
        mode: 'all',
        resolver: yupResolver(yup.object().shape({})),
        defaultValues: { ...initialValue, productDefault: initialValue?.productDefault || [] },
    });

    useEffect(() => {
        if (!getValues('defaultColor')) {
            setValue('defaultColor', DEFAULT_COLOR.PURPLE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data) => {
        openConfirm({
            content: (
                <div className='flex justify-center items-center text-md font-bold w-full'>
                    <div>
                        設定を登録します。
                        <br />
                        よろしいですか？
                    </div>
                </div>
            ),
            onOk: async () => {
                data.productDefault = data.productDefault?.map((e, ind) => ({
                    ...e,
                    rowNo: ind,
                }));
                const response = await saveSystemSetting(data).unwrap();
                dispatch(saveSystemSettingToStore(response));
                handleClickRollback();
            },
        });
    };

    const handleSelectProduct = (data: Product) => {
        const products = getValues('productDefault');
        products.push(data);
        setValue('productDefault', products);

        setOpenModal(null);
    };

    const handleRemoveProduct = (ind: number) => {
        const products = getValues('productDefault');
        products.splice(ind, 1);
        setValue('productDefault', products);
    };

    const handleOpenModal = (modalName, fieldName?, title?, isSetDefaultValue?) => {
        setOpenModal(modalName);
        if (fieldName) {
            setFieldNameSelected(fieldName);
        }

        if (title) {
            setTitleSelectOptionModal(title);
        }

        if (isSetDefaultValue) {
            setDefaultValueModal(watch(fieldName));
        }
    };

    const handleSelectOrderFields = (e) => {
        const fieldCd: any = `${fieldNameSelected}Cd`;
        const fieldName: any = `${fieldNameSelected}Name`;
        setValue(fieldCd, e.cd);
        setValue(fieldName, e.name);
        setOpenModal(null);
    };

    const handleSelectBranch = (d) => {
        const fieldCd: any = `${fieldNameSelected}Cd`;
        const fieldName: any = `${fieldNameSelected}Name`;
        setValue(fieldCd, d.cd);
        setValue(fieldName, d.name);
        setOpenModal(null);
    };

    const handleSelectDriver = (d) => {
        const fieldCd: any = `${fieldNameSelected}Cd`;
        const fieldName: any = `${fieldNameSelected}Name`;
        setValue(fieldCd, d.cd);
        setValue(fieldName, d.name);
        setOpenModal(null);
    };

    const handleSelectSalePerson = (d) => {
        const fieldCd: any = `${fieldNameSelected}Cd`;
        const fieldName: any = `${fieldNameSelected}Name`;
        setValue(fieldCd, d.cd);
        setValue(fieldName, d.name);
        setOpenModal(null);
    };

    const handleSelectVehicleType = (d) => {
        const fieldCd: any = `${fieldNameSelected}Cd`;
        const fieldName: any = `${fieldNameSelected}Name`;
        setValue(fieldCd, d.cd);
        setValue(fieldName, d.name);
        setOpenModal(null);
    };

    const changeDispatchType = ({ target: { value } }: RadioChangeEvent) => {
        setValue('searchDispatchStatusDefault.dispatchType', value);
        if (value === 2) {
            setValue('searchDispatchStatusDefault.dateCompareType', 1);
            setValue('searchDispatchStatusDefault.dispatchStatusIsReceived', false);
            setValue('searchDispatchStatusDefault.dispatchStatusIsDispatch', false);
            setValue('searchDispatchStatusDefault.dispatchStatusIsRecorded', false);
            setValue('searchDispatchStatusDefault.dispatchStatusIsCancel', false);
            setValue('searchDispatchStatusDefault.dispatchStatusIsNoCollection', false);
            setValue('searchDispatchStatusDefault.collectionPlace', undefined);
            setValue('searchDispatchStatusDefault.salesPersonCd', undefined);
            setValue('searchDispatchStatusDefault.salesPersonName', '');
        }
    };

    const changeWorkLineVoucherSetting = ({ target: { value } }: RadioChangeEvent) => {
        setValue('workLineVoucherSetting', value);
        if (
            value !== WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT &&
            value !== WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT_WITH_SIGNATURE
        ) {
            setValue('isPrintCopy', false);
        }
    };

    const handleClickRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    return (
        <Layout
            title='システム設定'
            isLoading={false}
            isShowRollback
            onClickRollback={() => handleClickRollback()}
            fixedHeader
        >
            <form onSubmit={handleSubmit(onSubmit)} className='mt-header'>
                <div>
                    {/* <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                入力確認メッセージ設定
                            </span>
                        </Container>
                    </div>
                    <div className='flex bg-white py-3'>
                        <Container>
                            <Controller
                                control={control}
                                name='inputConfirmMessageFlg'
                                render={({ field }) => (
                                    <Radio.Group {...field} className='[&_span]:text-ssm flex flex-wrap gap-y-2'>
                                        <Radio value>表示する</Radio>
                                        <Radio value={false} className='ml-4'>
                                            表示しない
                                        </Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                    </div> */}
                    {/* <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                システムカラー
                            </span>
                        </Container>
                    </div>
                    <div className='bg-white py-3'>
                        <Container>
                            <Controller
                                control={control}
                                name='defaultColor'
                                render={({ field }) => (
                                    <Radio.Group
                                        {...field}
                                        className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                    >
                                        <Radio value={DEFAULT_COLOR.GREEN} className='mr-5'>
                                            緑
                                        </Radio>
                                        <br />
                                        <Radio value={DEFAULT_COLOR.PURPLE}>紫</Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                    </div> */}
                    <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                車輌選択時設定
                            </span>
                        </Container>
                    </div>
                    <div className='bg-white py-3'>
                        <Container>
                            <Controller
                                control={control}
                                name='settingWhenSelectVehicle'
                                render={({ field }) => (
                                    <Radio.Group
                                        {...field}
                                        className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                    >
                                        <Radio
                                            value={
                                                SETTING_WHEN_SELECT_VEHICLE.PRIORITIZE_LAST_USED_VEHICLE
                                            }
                                        >
                                            前回利用の車輌を優先する
                                        </Radio>
                                        <br />
                                        <Radio
                                            value={
                                                SETTING_WHEN_SELECT_VEHICLE.SPECIFY_VEHICLE_EACH_TIME
                                            }
                                        >
                                            表示の都度車輌を指定する
                                        </Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                    </div>

                    <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                品名選択方法
                            </span>
                        </Container>
                    </div>
                    <div className='bg-white py-3'>
                        <Container>
                            <Controller
                                control={control}
                                name='settingProductType'
                                render={({ field }) => (
                                    <Radio.Group
                                        {...field}
                                        className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                    >
                                        <Radio value={SETTING_PRODUCT_TYPE.DEFAULT}>
                                            品名一覧選択
                                        </Radio>
                                        <br />
                                        <Radio value={SETTING_PRODUCT_TYPE.HAVE_TYPE}>
                                            種類→品名選択
                                        </Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                    </div>

                    <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                回収実績入力設定
                            </span>
                        </Container>
                    </div>
                    <div className='bg-white py-3 mb-1'>
                        <Container>
                            <span className='block text-md text-green1A pb-3'>優先する</span>
                            <Controller
                                control={control}
                                name='collectionResultInputSetting.prioritize'
                                render={({ field }) => (
                                    <Radio.Group
                                        {...field}
                                        className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                    >
                                        <Radio
                                            value={
                                                COLLECTION_RESULT_INPUT_SETTING.PRIORITIZE
                                                    .QUANTITY_INPUT
                                            }
                                        >
                                            数量入力
                                        </Radio>
                                        <br />
                                        <Radio
                                            value={
                                                COLLECTION_RESULT_INPUT_SETTING.PRIORITIZE
                                                    .WORK_SELECTION
                                            }
                                        >
                                            作業選択
                                        </Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                    </div>
                    <div className='bg-white py-3 mb-1'>
                        <Container>
                            <span className='block text-md text-green1A pb-3'>回収状況</span>
                            <Controller
                                control={control}
                                name='collectionResultInputSetting.dispatchType'
                                render={({ field }) => (
                                    <Radio.Group
                                        {...field}
                                        className='[&_span]:text-ssm flex gap-y-2 flex-wrap'
                                    >
                                        {DISPATCH_TYPES.map((e) => (
                                            <Radio
                                                key={e.value}
                                                value={e.value}
                                                className='whitespace-nowrap [&_span]:!pr-0'
                                            >
                                                {e.label}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                    </div>

                    <div className='bg-white pb-3 pt-2'>
                        <Container>
                            <div className='flex items-end pb-3 text-green1A'>
                                <span className='inline-block text-md '>スポット</span>{' '}
                                <span className='inline-block text-xl font-bold'>
                                    換算数量/荷姿数量
                                </span>
                            </div>
                            <Controller
                                control={control}
                                name='collectionResultInputSetting.convertedPackagingSetting'
                                render={({ field }) => (
                                    <Radio.Group
                                        {...field}
                                        className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                    >
                                        <Radio value={SPOT_CONVERT.CONVERTED_QUANTITY}>
                                            換算数量
                                        </Radio>
                                        <br />
                                        <Radio value={SPOT_CONVERT.PACKAGE_QUANTITY}>
                                            荷姿数量
                                        </Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                    </div>

                    <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                共通明細初期表示件数設定
                            </span>
                        </Container>
                    </div>
                    <div className='bg-white py-3'>
                        <Container>
                            <span className='block text-md text-green1A pb-3'>
                                明細行初期表示件数
                            </span>
                            <Controller
                                control={control}
                                name='commonPageSize'
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='text-center w-[140px] text-ssm border-grayD4 border outline-none h-input-default ant-input'
                                    >
                                        {[
                                            { value: 5, label: 5 },
                                            { value: 10, label: 10 },
                                            { value: 15, label: 15 },
                                            { value: 20, label: 20 },
                                            { value: 25, label: 25 },
                                            { value: 30, label: 30 },
                                            { value: 35, label: 35 },
                                            { value: 40, label: 40 },
                                            { value: 45, label: 45 },
                                            { value: 50, label: 50 },
                                        ].map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            <span className='text-red2a block mt-2 text-ssm'>
                                ※上記行数は、初期表示件数が多くなるに伴い画面表示が遅くなる可能性があります
                            </span>
                        </Container>
                    </div>
                    <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                搬入実績登録設定
                            </span>
                        </Container>
                    </div>
                    <div className='bg-white py-3'>
                        <Container>
                            <Controller
                                control={control}
                                name='importRecordRegistrationSetting'
                                render={({ field }) => (
                                    <Radio.Group
                                        {...field}
                                        className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                    >
                                        <Radio
                                            value={
                                                IMPORT_RECORD_REGISTRAION_SETTING.CARRIED_TO_EACH_COLLECTION_SITE
                                            }
                                        >
                                            回収現場毎に搬入する
                                        </Radio>
                                        <br />
                                        <Radio
                                            value={
                                                IMPORT_RECORD_REGISTRAION_SETTING.BRING_IN_EACH_ITEM_TO_BE_COLLECTED
                                            }
                                        >
                                            回収品目毎に搬入する
                                        </Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                    </div>

                    <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                作業明細伝票設定
                            </span>
                        </Container>
                    </div>
                    <div className='bg-white py-3'>
                        <Container>
                            <Controller
                                control={control}
                                name='workLineVoucherSetting'
                                render={({ field }) => (
                                    <Radio.Group
                                        {...field}
                                        className='[&_span]:text-ssm flex flex-wrap gap-y-2 max-[405px]:grid'
                                        onChange={changeWorkLineVoucherSetting}
                                    >
                                        <Radio value={WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT}>
                                            プリンタ出力
                                        </Radio>
                                        <br />
                                        <Radio
                                            value={
                                                WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT_WITH_SIGNATURE
                                            }
                                        >
                                            プリンタ出力（電子サイン）
                                        </Radio>
                                        <br />
                                        <Radio value={WORK_LINE_VOUCHER_SETTING.DISPLAY_PDF}>
                                            PDF出力
                                        </Radio>
                                        <br />
                                        <Radio
                                            value={WORK_LINE_VOUCHER_SETTING.NOT_DISPLAY_NOT_PRINT}
                                        >
                                            印刷しない
                                        </Radio>
                                    </Radio.Group>
                                )}
                            />
                        </Container>
                        <Container>
                            <div className='flex items-center mt-3'>
                                <Controller
                                    control={control}
                                    name='isPrintCopy'
                                    render={({ field }) => (
                                        <Switch
                                            {...field}
                                            checked={field.value}
                                            disabled={
                                                watch('workLineVoucherSetting') !==
                                                    WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT &&
                                                watch('workLineVoucherSetting') !==
                                                    WORK_LINE_VOUCHER_SETTING.DISPLAY_PRINT_WITH_SIGNATURE
                                            }
                                        />
                                    )}
                                />
                                <span className='block ml-3 text-ssm'>控え印刷</span>
                            </div>
                        </Container>
                    </div>
                    <div className='bg-green15 py-2'>
                        <Container classnames='flex justify-between items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                画面表示自動更新設定（リロード）
                            </span>
                        </Container>
                    </div>

                    <div className='py-3 bg-white'>
                        <Container>
                            <div className='flex justify-between items-center'>
                                <span className='text-md text-green1A'>更新間隔（秒）</span>
                                <Controller
                                    control={control}
                                    name='screenDisplay.intervalAutoUpdate'
                                    render={({ field }) => (
                                        <Input
                                            type='number'
                                            className='w-[120px] border-grayD4 h-input-default'
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            <span className='text-red2a block mt-2 text-ssm'>
                                ※上記設定は、メインメニュー、及び一覧画面に適用され、指定間隔で画面表示を更新します
                            </span>
                            <span className='text-red2a block mt-2 text-ssm'>
                                ※入力項目がある画面では適用されません
                            </span>
                        </Container>
                    </div>
                    {user.user?.isSystemLimit === false && (
                        <>
                            <div className='bg-green15 py-2'>
                                <Container classnames='flex justify-between items-center'>
                                    <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                        位置情報の更新設定
                                    </span>
                                </Container>
                            </div>
                            <div className='py-3 bg-white'>
                                <Container>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-md text-green1A'>更新間隔（秒）</span>
                                        <Controller
                                            control={control}
                                            name='location.intervalAutoUpdate'
                                            render={({ field }) => (
                                                <Input
                                                    type='number'
                                                    className='w-[120px] border-grayD4 h-input-default'
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                </Container>
                            </div>

                            <div className='bg-green15 py-2'>
                                <Container classnames='flex justify-between items-center'>
                                    <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                        配車状況 検索既定値設定
                                    </span>
                                </Container>
                            </div>
                            <div className='bg-white py-3 mb-1'>
                                <Container>
                                    <span className='block text-md text-green1A pb-3'>
                                        検索条件/絞り込み/並び順の保持設定
                                    </span>
                                    <Controller
                                        control={control}
                                        name='searchDispatchStatusDefault.settingSearch'
                                        render={({ field }) => (
                                            <Radio.Group
                                                {...field}
                                                className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                            >
                                                <Radio
                                                    value={
                                                        SETTING_SEARCH_DISPATCH_STATUS.PRIORITIZE_PREVIOUS_SEARCH
                                                    }
                                                >
                                                    前回の検索条件を優先する
                                                </Radio>
                                                <br />
                                                <Radio
                                                    value={
                                                        SETTING_SEARCH_DISPATCH_STATUS.SET_EACH_TIME
                                                    }
                                                >
                                                    表示都度設定する
                                                </Radio>
                                            </Radio.Group>
                                        )}
                                    />
                                </Container>
                            </div>
                            <div className='bg-white py-3 mb-[3px]'>
                                <Container>
                                    <Controller
                                        control={control}
                                        name='searchDispatchStatusDefault.dispatchType'
                                        render={({ field }) => (
                                            <Radio.Group
                                                {...field}
                                                className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                                onChange={changeDispatchType}
                                            >
                                                <Radio value={1} className='mr-0'>
                                                    スポットのみ
                                                </Radio>
                                                <Radio value={2} className='mr-0'>
                                                    コースのみ
                                                </Radio>
                                                <Radio value={0} className='mr-0'>
                                                    全て
                                                </Radio>
                                            </Radio.Group>
                                        )}
                                    />
                                </Container>
                            </div>
                            <div className='bg-white py-3  mb-[3px]'>
                                <Container>
                                    <div>
                                        <span className='text-sm whitespace-nowrap'>配車状況</span>
                                        <div className='flex flex-wrap  mt-1'>
                                            <div className='flex items-center px-3 mb-3'>
                                                <Controller
                                                    control={control}
                                                    name='searchDispatchStatusDefault.dispatchStatusIsReceived'
                                                    render={({ field }) => (
                                                        <Switch
                                                            {...field}
                                                            checked={field.value}
                                                            disabled={
                                                                watch(
                                                                    'searchDispatchStatusDefault.dispatchType',
                                                                ) === 2
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span className='block ml-3 text-ssm'>受注</span>
                                            </div>
                                            <div className='flex items-center px-3 mb-3'>
                                                <Controller
                                                    control={control}
                                                    name='searchDispatchStatusDefault.dispatchStatusIsDispatch'
                                                    render={({ field }) => (
                                                        <Switch
                                                            {...field}
                                                            checked={field.value}
                                                            disabled={
                                                                watch(
                                                                    'searchDispatchStatusDefault.dispatchType',
                                                                ) === 2
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span className='block ml-3 text-ssm'>配車</span>
                                            </div>
                                            <div className='flex items-center px-3 mb-3'>
                                                <Controller
                                                    control={control}
                                                    name='searchDispatchStatusDefault.dispatchStatusIsRecorded'
                                                    render={({ field }) => (
                                                        <Switch
                                                            {...field}
                                                            checked={field.value}
                                                            disabled={
                                                                watch(
                                                                    'searchDispatchStatusDefault.dispatchType',
                                                                ) === 2
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span className='block ml-3 text-ssm'>計上</span>
                                            </div>
                                            <div className='flex items-center px-3 mb-3'>
                                                <Controller
                                                    control={control}
                                                    name='searchDispatchStatusDefault.dispatchStatusIsNoCollection'
                                                    render={({ field }) => (
                                                        <Switch
                                                            {...field}
                                                            checked={field.value}
                                                            disabled={
                                                                watch(
                                                                    'searchDispatchStatusDefault.dispatchType',
                                                                ) === 2
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span className='block ml-3 text-ssm'>
                                                    回収無し
                                                </span>
                                            </div>
                                            <div className='flex items-center px-3 mb-3'>
                                                <Controller
                                                    control={control}
                                                    name='searchDispatchStatusDefault.dispatchStatusIsCancel'
                                                    render={({ field }) => (
                                                        <Switch
                                                            {...field}
                                                            checked={field.value}
                                                            disabled={
                                                                watch(
                                                                    'searchDispatchStatusDefault.dispatchType',
                                                                ) === 2
                                                            }
                                                        />
                                                    )}
                                                />
                                                <span className='block ml-3 text-ssm'>
                                                    キャンセル
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Container>
                            </div>
                            <div className='bg-white py-3 mb-[3px]'>
                                <Container>
                                    <div className='flex items-center mb-3'>
                                        <Controller
                                            control={control}
                                            name='searchDispatchStatusDefault.isSearchWorkDate'
                                            render={({ field }) => (
                                                <Switch {...field} checked={field.value} />
                                            )}
                                        />
                                        <span className='block ml-3 text-md'>作業日</span>
                                    </div>
                                    <Controller
                                        control={control}
                                        name='searchDispatchStatusDefault.dateCompareType'
                                        render={({ field }) => (
                                            <Radio.Group
                                                {...field}
                                                className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                                disabled={
                                                    !watch(
                                                        'searchDispatchStatusDefault.isSearchWorkDate',
                                                    )
                                                }
                                            >
                                                <Radio
                                                    value={SPOT_WORK_DATE_TYPE.MATCH}
                                                    disabled={
                                                        !watch(
                                                            'searchDispatchStatusDefault.isSearchWorkDate',
                                                        ) ||
                                                        watch(
                                                            'searchDispatchStatusDefault.dispatchType',
                                                        ) === 2
                                                    }
                                                >
                                                    一致
                                                </Radio>
                                                <Radio value={SPOT_WORK_DATE_TYPE.UNSPECIFIED}>
                                                    未指定
                                                </Radio>
                                                <Radio value={SPOT_WORK_DATE_TYPE.ALL}>
                                                    一致 + 未指定
                                                </Radio>
                                            </Radio.Group>
                                        )}
                                    />
                                </Container>
                            </div>
                            <div className='bg-white py-3 mb-[3px]'>
                                <Container>
                                    <div className='flex items-center'>
                                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-4'>
                                            拠 点
                                        </span>
                                        <Controller
                                            control={control}
                                            name='searchDispatchStatusDefault.branchName'
                                            render={({ field }) => (
                                                <Input
                                                    className='h-[44px] disabled-bg-white'
                                                    type='text'
                                                    {...field}
                                                    disabled
                                                    prefix={
                                                        <img
                                                            src={iconInputSearch}
                                                            alt='icon input search'
                                                        />
                                                    }
                                                    suffix={
                                                        field.value && (
                                                            <button
                                                                type='button'
                                                                onClick={() => {
                                                                    setValue(
                                                                        'searchDispatchStatusDefault.branchName',
                                                                        '',
                                                                    );
                                                                    setValue(
                                                                        'searchDispatchStatusDefault.branchCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={iconInputClear}
                                                                    alt='icon input clear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                        />

                                        <button
                                            type='button'
                                            className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                                            onClick={() =>
                                                handleOpenModal(
                                                    ModalName.BRANCH,
                                                    'searchDispatchStatusDefault.branch',
                                                )
                                            }
                                        >
                                            <FilterSvg className='m-auto' />
                                        </button>
                                    </div>
                                </Container>
                            </div>
                            <div className='bg-white py-3 mb-[3px]'>
                                <Container>
                                    <div className='flex items-center'>
                                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-4'>
                                            営業者
                                        </span>
                                        <Controller
                                            control={control}
                                            name='searchDispatchStatusDefault.salesPersonName'
                                            render={({ field }) => (
                                                <Input
                                                    className='h-[44px] disabled-bg-white'
                                                    {...field}
                                                    disabled
                                                    prefix={
                                                        <img
                                                            src={iconInputSearch}
                                                            alt='icon input search'
                                                        />
                                                    }
                                                    suffix={
                                                        field.value && (
                                                            <button
                                                                type='button'
                                                                onClick={() => {
                                                                    setValue(
                                                                        'searchDispatchStatusDefault.salesPersonName',
                                                                        '',
                                                                    );
                                                                    setValue(
                                                                        'searchDispatchStatusDefault.salesPersonCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={iconInputClear}
                                                                    alt='icon input clear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                        <button
                                            type='button'
                                            className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                                            disabled={
                                                watch(
                                                    'searchDispatchStatusDefault.dispatchType',
                                                ) === 2
                                            }
                                            onClick={() =>
                                                handleOpenModal(
                                                    ModalName.SALE_PERSON,
                                                    'searchDispatchStatusDefault.salesPerson',
                                                )
                                            }
                                        >
                                            <FilterSvg className='m-auto' />
                                        </button>
                                    </div>
                                </Container>
                            </div>
                            <div className='bg-white py-3 mb-[3px]'>
                                <Container>
                                    <div className='flex items-center'>
                                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-4'>
                                            運転者
                                        </span>
                                        <Controller
                                            control={control}
                                            name='searchDispatchStatusDefault.driverName'
                                            render={({ field }) => (
                                                <Input
                                                    className='h-[44px] disabled-bg-white'
                                                    {...field}
                                                    disabled
                                                    prefix={
                                                        <img
                                                            src={iconInputSearch}
                                                            alt='icon input search'
                                                        />
                                                    }
                                                    suffix={
                                                        field.value && (
                                                            <button
                                                                type='button'
                                                                onClick={() => {
                                                                    setValue(
                                                                        'searchDispatchStatusDefault.driverName',
                                                                        null,
                                                                    );
                                                                    setValue(
                                                                        'searchDispatchStatusDefault.driverCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={iconInputClear}
                                                                    alt='icon input clear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                        <button
                                            type='button'
                                            className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                                            onClick={() =>
                                                handleOpenModal(
                                                    ModalName.DRIVER,
                                                    'searchDispatchStatusDefault.driver',
                                                )
                                            }
                                        >
                                            <FilterSvg className='m-auto' />
                                        </button>
                                    </div>
                                </Container>
                            </div>
                            <div className='bg-white py-3 mb-[3px]'>
                                <Container>
                                    <div className='flex items-center'>
                                        <span className='block text-left text-sm text-green1A whitespace-nowrap min-w-[54px] mr-4'>
                                            車 種
                                        </span>
                                        <Controller
                                            control={control}
                                            name='searchDispatchStatusDefault.vehicleTypeName'
                                            render={({ field }) => (
                                                <Input
                                                    className='h-[44px] disabled-bg-white'
                                                    {...field}
                                                    disabled
                                                    prefix={
                                                        <img
                                                            src={iconInputSearch}
                                                            alt='icon input search'
                                                        />
                                                    }
                                                    suffix={
                                                        field.value && (
                                                            <button
                                                                type='button'
                                                                onClick={() => {
                                                                    setValue(
                                                                        'searchDispatchStatusDefault.vehicleTypeName',
                                                                        '',
                                                                    );
                                                                    setValue(
                                                                        'searchDispatchStatusDefault.vehicleTypeCd',
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    src={iconInputClear}
                                                                    alt='icon input clear'
                                                                />
                                                            </button>
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                        <button
                                            type='button'
                                            className='rounded border border-green15 h-[44px] min-w-[44px] ml-3 text-center bg-white'
                                            onClick={() =>
                                                handleOpenModal(
                                                    ModalName.VEHICLE_TYPE,
                                                    'searchDispatchStatusDefault.vehicleType',
                                                )
                                            }
                                        >
                                            <FilterSvg className='m-auto' />
                                        </button>
                                    </div>
                                </Container>
                            </div>
                            <div className='bg-white py-3 mb-1'>
                                <Container>
                                    <div className='flex items-center mb-3'>
                                        <span className='block text-sm'>回収場所</span>
                                    </div>
                                    <Controller
                                        control={control}
                                        name='searchDispatchStatusDefault.collectionPlaceType'
                                        render={({ field }) => (
                                            <Radio.Group
                                                {...field}
                                                className='[&_span]:text-ssm flex flex-wrap gap-y-2'
                                                disabled={
                                                    watch(
                                                        'searchDispatchStatusDefault.dispatchType',
                                                    ) === 2
                                                }
                                            >
                                                <Radio value={0}>業者名</Radio>
                                                <Radio value={1} className='ml-3'>
                                                    現場名
                                                </Radio>
                                                <Radio value={2} className='ml-3'>
                                                    住所
                                                </Radio>
                                            </Radio.Group>
                                        )}
                                    />
                                </Container>
                            </div>

                            <div className='bg-white py-3'>
                                <Container>
                                    <div className='flex items-center '>
                                        <span className='text-green1A text-sm mr-2 whitespace-nowrap'>
                                            並び順:
                                        </span>
                                        <Input
                                            className='h-[44px] disabled-bg-white mr-2'
                                            disabled
                                            value='作業日'
                                        />

                                        <button
                                            type='button'
                                            className='rounded border border-green15 h-[44px] min-w-[44px] mr-2 text-center bg-white'
                                            onClick={() =>
                                                setValue(
                                                    'searchDispatchStatusDefault.sortOrder',
                                                    SORT_TYPE.ASCENDING,
                                                )
                                            }
                                        >
                                            <svg
                                                width='30'
                                                height='24'
                                                viewBox='0 0 30 24'
                                                className={`m-auto ${
                                                    watch(
                                                        'searchDispatchStatusDefault.sortOrder',
                                                    ) === SORT_TYPE.ASCENDING
                                                        ? 'fill-green1A'
                                                        : 'fill-gray93'
                                                }`}
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <g clipPath='url(#clip0_1267_31520)'>
                                                    <path d='M21.9439 21.613C22.5993 21.613 23.1317 22.1481 23.1317 22.8066C23.1317 23.4652 22.5993 24.0002 21.9439 24.0002L1.43775 23.9752C0.782422 23.9752 0.25 23.4401 0.25 22.7816C0.25 22.123 0.782422 21.588 1.43775 21.588L21.9439 21.613ZM16.7913 8.01331C16.3433 8.46525 15.6132 8.46809 15.1635 8.01786C14.7137 7.56763 14.7109 6.83394 15.1589 6.38201L21.1691 0.340596C21.6171 -0.111343 22.3466 -0.114189 22.7964 0.336043L28.9124 6.4782C29.3627 6.93014 29.3627 7.6661 28.9124 8.11804C28.4627 8.57055 27.7303 8.57055 27.2806 8.11804L23.139 3.95668L23.1572 15.7048C23.1572 16.3423 22.6417 16.8603 22.0074 16.8603C21.373 16.8603 20.8581 16.3423 20.8581 15.7048L20.84 3.94358L16.7913 8.01331ZM9.97066 2.31057C10.626 2.31057 11.1584 2.84618 11.1584 3.50474C11.1584 4.16272 10.626 4.69833 9.97066 4.69833L1.43775 4.68923C0.782422 4.68923 0.25 4.15362 0.25 3.49506C0.25 2.83707 0.782422 2.30146 1.43775 2.30146L9.97066 2.31057ZM12.3116 12.0273C12.967 12.0273 13.4994 12.5623 13.4994 13.2209C13.4994 13.8794 12.967 14.4144 12.3116 14.4144L1.43775 14.4014C0.782422 14.4014 0.25 13.8663 0.25 13.2078C0.25 12.5498 0.782422 12.0142 1.43775 12.0142L12.3116 12.0273Z' />
                                                </g>
                                                <defs>
                                                    <clipPath id='clip0_1267_31520'>
                                                        <rect
                                                            width='29'
                                                            height='24'
                                                            fill='white'
                                                            transform='translate(0.25)'
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>

                                        <button
                                            type='button'
                                            className='rounded border border-green15 h-[44px] min-w-[44px] text-center bg-white'
                                            onClick={() =>
                                                setValue(
                                                    'searchDispatchStatusDefault.sortOrder',
                                                    SORT_TYPE.DESCENDING,
                                                )
                                            }
                                        >
                                            <svg
                                                width='30'
                                                height='24'
                                                viewBox='0 0 30 24'
                                                className={`m-auto ${
                                                    watch(
                                                        'searchDispatchStatusDefault.sortOrder',
                                                    ) === SORT_TYPE.DESCENDING
                                                        ? 'fill-green1A'
                                                        : 'fill-gray93'
                                                }`}
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <g clipPath='url(#clip0_1267_31532)'>
                                                    <path d='M7.55608 2.38697C6.90074 2.38697 6.36832 1.85193 6.36832 1.19338C6.36832 0.53482 6.90074 -0.000221299 7.55608 -0.000221242L28.0622 0.0248259C28.7176 0.024826 29.25 0.559866 29.25 1.21842C29.25 1.87698 28.7176 2.41202 28.0622 2.41202L7.55608 2.38697ZM12.7087 15.9867C13.1567 15.5347 13.8868 15.5319 14.3365 15.9821C14.7863 16.4324 14.7891 17.1661 14.3411 17.618L8.33092 23.6594C7.88289 24.1113 7.15336 24.1142 6.70363 23.664L0.587578 17.5218C0.137286 17.0699 0.137286 16.3339 0.587579 15.882C1.0373 15.4294 1.76967 15.4294 2.2194 15.882L6.36096 20.0433L6.34283 8.29519C6.34283 7.65769 6.85826 7.13973 7.49264 7.13973C8.12701 7.13973 8.64188 7.65769 8.64188 8.29519L8.66 20.0564L12.7087 15.9867ZM19.5293 21.6894C18.874 21.6894 18.3416 21.1538 18.3416 20.4953C18.3416 19.8373 18.874 19.3017 19.5293 19.3017L28.0622 19.3108C28.7176 19.3108 29.25 19.8464 29.25 20.5049C29.25 21.1629 28.7176 21.6985 28.0622 21.6985L19.5293 21.6894ZM17.1884 11.9727C16.533 11.9727 16.0006 11.4377 16.0006 10.7791C16.0006 10.1206 16.533 9.58555 17.1884 9.58555L28.0622 9.59864C28.7176 9.59864 29.25 10.1337 29.25 10.7922C29.25 11.4502 28.7176 11.9858 28.0622 11.9858L17.1884 11.9727Z' />
                                                </g>
                                                <defs>
                                                    <clipPath id='clip0_1267_31532'>
                                                        <rect
                                                            width='29'
                                                            height='24'
                                                            fill='white'
                                                            transform='translate(29.25 24) rotate(-180)'
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                    </div>
                                </Container>
                            </div>

                            <div className='bg-green15 py-2'>
                                <Container classnames='flex justify-between items-center'>
                                    <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                                        受入実績入力 品名既定値設定
                                    </span>
                                    <button
                                        type='button'
                                        onClick={() => handleOpenModal(ModalName.PRODUCT)}
                                    >
                                        <AddIcon />
                                    </button>
                                </Container>
                            </div>
                            <div className='py-3'>
                                <Container>
                                    {watch('productDefault')?.map((p, index) => (
                                        <div
                                            className='rounded shadow flex bg-white mb-3'
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={p.productCd + index}
                                        >
                                            <div className='py-3 px-5 w-full overflow-hidden text-ellipsis whitespace-nowrap border-r border-r-grayD4  flex items-center text-ssm'>
                                                {p.productName}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveProduct(index)}
                                                className='h-[56px] w-[70px] flex justify-center items-center'
                                                type='button'
                                            >
                                                <img src={iconTrashRemove} alt='remove' />
                                            </button>
                                        </div>
                                    ))}
                                </Container>
                            </div>
                        </>
                    )}
                    <div className='pb-7 pt-3'>
                        <Container>
                            <Button
                                className='bg-green1A text-white w-full rounded-md h-btn-default flex justify-center text-sm items-center'
                                htmlType='submit'
                            >
                                登録
                                <svg
                                    width='22'
                                    height='23'
                                    viewBox='0 0 22 23'
                                    className='ml-2'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M21 1.5L10 12.5M21 1.5L14 21.5L10 12.5M21 1.5L1 8.5L10 12.5'
                                        stroke='white'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </Button>
                        </Container>
                    </div>
                </div>

                <ModalSelectProductHasSearchType
                    open={openModal === ModalName.PRODUCT}
                    setOpen={setOpenModal}
                    handleSelectItem={handleSelectProduct}
                />

                <ModalSelectBranch
                    open={openModal === ModalName.BRANCH}
                    setOpen={setOpenModal}
                    handleSelectItem={handleSelectBranch}
                />

                <ModalSelectDriver
                    open={openModal === ModalName.DRIVER}
                    setOpen={setOpenModal}
                    handleSelectItem={handleSelectDriver}
                />

                <ModalSelectSalePerson
                    open={openModal === ModalName.SALE_PERSON}
                    setOpen={setOpenModal}
                    handleSelectItem={handleSelectSalePerson}
                />

                <ModalSelectVehicleType
                    open={openModal === ModalName.VEHICLE_TYPE}
                    setOpen={setOpenModal}
                    handleSelectItem={handleSelectVehicleType}
                />

                <ModalSelectSortOrderFields
                    open={openModal === ModalName.ORDER_FIELDS}
                    setOpen={setOpenModal}
                    handleSelectItem={handleSelectOrderFields}
                />
            </form>
        </Layout>
    );
};

export default SystemSetting;
