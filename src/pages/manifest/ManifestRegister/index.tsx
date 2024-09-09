/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Collapse, Input } from 'antd';
import iconInputClear from 'assets/icons/icon-input-clear.svg';
import Container from 'components/organisms/container';
import Layout from 'components/templates/Layout';
import { IBodyRequestDenshimanifest, IIndustrialWaste } from 'models';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    useLazyGetCollectionProductConfirmQuery,
    usePostDenshimanifestMutation,
} from 'services/collection';
import { useLazyCheckIllegalCharacterForJWNetQuery } from 'services/commons';
import { useGetQuantityFormatQuery } from 'services/settings';
import { useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE, STATUS_CODE } from 'utils/constants';
import { openInformation } from 'utils/functions';
import { convertQuantityCollection } from 'utils/number';

const ManifestRegister: React.FC = () => {
    const navigate = useNavigate();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.MANIFEST_REGISTER],
    );

    const [industrialWastes, setIndustrialWaste] = useState<IIndustrialWaste[]>([]);
    const [industrialWasteControlleds, setIndustrialWasteControlled] = useState([]);
    const [collectionProductConfirm, setCollectionProductConfirm] = useState(null);
    const [searchParams] = useSearchParams();
    const seqNo = searchParams.get('seqNo');
    const { data: formatQuantity } = useGetQuantityFormatQuery();
    const [deliveryPerson, setDeliveryPerson] = useState('');
    const [postDenshimanifest, responsePostDenshimanifest] = usePostDenshimanifestMutation();
    const [checkIllegalCharacterForJWNet, responseCheckIllegalCharacterForJWNet] =
        useLazyCheckIllegalCharacterForJWNetQuery();
    const vehicle = useAppSelector((state) => state.reducer.vehicle.selectedVehicle);
    const user = useAppSelector((state) => state.reducer.user);

    useEffect(() => {
        if (collectionProductConfirm) {
            setDeliveryPerson(collectionProductConfirm.deliveryPerson);
        }
    }, [collectionProductConfirm]);

    useEffect(() => {
        if (
            responsePostDenshimanifest.status === STATUS_CODE.fulfilled &&
            responsePostDenshimanifest.isSuccess
        ) {
            navigate(previousUrl || `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`);
        }
    }, [responsePostDenshimanifest]);

    const handleChangeDeliveryPerson = ($event) => {
        setDeliveryPerson($event.target.value);
    };

    const handleSendEDI = async () => {
        const isInputValueValid = await checkIllegalCharacterForJWNet({
            value: deliveryPerson,
        }).unwrap();

        if (!isInputValueValid) {
            openInformation({
                content: (
                    <div className='text-center text-sm font-bold'>
                        引き渡し担当者に送信できない文字が含まれております。
                    </div>
                ),
            });
        } else {
            const params: { seqNo: string | number; body: IBodyRequestDenshimanifest } = {
                seqNo,
                body: {
                    vehicleCd: vehicle.vehicleCd,
                    hikiwatashiTanName: deliveryPerson,
                    carrierCd: vehicle.companyCd,
                    timeStamp: collectionProductConfirm.timeStamp,
                },
            };
            postDenshimanifest(params);
        }
    };

    const [getCollectionProductConfirm, responseGetCollectionProductConfirm] =
        useLazyGetCollectionProductConfirmQuery();

    useEffect(() => {
        if (seqNo) {
            getCollectionProductConfirm({ seqNo });
        }
    }, []);

    useEffect(() => {
        if (
            responseGetCollectionProductConfirm.status === STATUS_CODE.fulfilled &&
            responseGetCollectionProductConfirm.data &&
            formatQuantity
        ) {
            setCollectionProductConfirm(responseGetCollectionProductConfirm.data);

            // industrialWaste
            const getIndustrialWastes = responseGetCollectionProductConfirm.data.industrialWasteDtos
                .filter((e) => e.wasteTypeCd && Number(e.wasteTypeCd) <= 4999)
                .map((e) => {
                    const newData = { ...e };
                    newData.quantity = convertQuantityCollection(e.quantity, formatQuantity);
                    newData.packagingQuantity = convertQuantityCollection(
                        e.packagingQuantity,
                        formatQuantity,
                    );
                    return newData;
                });

            setIndustrialWaste(getIndustrialWastes);

            // industrialwasteControlled
            const getIndustrialWasteControlleds =
                responseGetCollectionProductConfirm.data.industrialWasteDtos
                    .filter((e) => e.wasteTypeCd && Number(e.wasteTypeCd) >= 5000)
                    .map((e) => {
                        const newData = { ...e };
                        newData.quantity = convertQuantityCollection(e.quantity, formatQuantity);
                        newData.packagingQuantity = convertQuantityCollection(
                            e.packagingQuantity,
                            formatQuantity,
                        );
                        return newData;
                    });

            setIndustrialWasteControlled(getIndustrialWasteControlleds);
        }
    }, [responseGetCollectionProductConfirm, formatQuantity]);

    const handleRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`);
    };
    return (
        <Layout
            title='回収品確認'
            isLoading={
                responsePostDenshimanifest.isLoading ||
                responseGetCollectionProductConfirm.isFetching ||
                responseGetCollectionProductConfirm.isLoading
            }
            isShowRollback
            onClickRollback={handleRollback}
        >
            <Collapse
                // activeKey={activeKey}
                bordered={false}
                defaultActiveKey={['1', '2', '3']}
                className='[&_.ant-collapse-header]:!p-0 [&_.ant-collapse-header]:!items-center [&_.ant-collapse-header]:bg-green15 [&_.ant-collapse-content-box]:!p-0'
                // eslint-disable-next-line react/no-unstable-nested-components
                expandIcon={({ isActive }) => (
                    <Container>
                        {' '}
                        <button
                            // onClick={() => toggleCollapse()}
                            type='button'
                            className={`transition-all ${isActive ? '' : '-rotate-180'}`}
                        >
                            <svg
                                width='20'
                                height='12'
                                viewBox='0 0 20 12'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M1.5 1.75L10 10.25L18.5 1.75'
                                    stroke='white'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </button>
                    </Container>
                )}
                expandIconPosition='end'
                items={[
                    {
                        key: '1',
                        label: (
                            <div
                                className='bg-green15 py-2'
                                // onClick={() => toggleCollapse()}
                                role='button'
                            >
                                <Container classnames='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                            産業廃棄物
                                        </span>
                                    </div>
                                </Container>
                            </div>
                        ),
                        children: <IndustrialWastes industrialWastes={industrialWastes} />,
                    },
                    {
                        key: '2',
                        label: (
                            <div
                                className='bg-green15 py-2'
                                // onClick={() => toggleCollapse()}
                                role='button'
                            >
                                <Container classnames='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                            特別管理産業廃棄物
                                        </span>
                                    </div>
                                </Container>
                            </div>
                        ),
                        children: (
                            <IndustrialWasteControlleds
                                industrialWasteControlleds={industrialWasteControlleds}
                            />
                        ),
                    },
                    {
                        key: '3',
                        label: (
                            <div
                                className='bg-green15 py-2'
                                // onClick={() => toggleCollapse()}
                                role='button'
                            >
                                <Container classnames='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                            引渡担者/パスワード
                                        </span>
                                    </div>
                                </Container>
                            </div>
                        ),
                        children: (
                            <div className='bg-white py-3'>
                                <Container>
                                    <div className='grid grid-cols-[100px_auto] gap-x-2 text-ssm pb-3 items-center'>
                                        <span>引渡担当者</span>
                                        <span>
                                            <Input
                                                type='text'
                                                className='h-input-default text-ssm'
                                                value={deliveryPerson}
                                                onChange={($event) =>
                                                    handleChangeDeliveryPerson($event)
                                                }
                                                suffix={
                                                    deliveryPerson ? (
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                setDeliveryPerson('');
                                                            }}
                                                        >
                                                            <img
                                                                src={iconInputClear}
                                                                alt='icon input clear'
                                                            />
                                                        </button>
                                                    ) : (
                                                        <span />
                                                    )
                                                }
                                            />
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-[50%_120px] justify-between'>
                                        <div />
                                        <Button
                                            htmlType='button'
                                            onClick={handleSendEDI}
                                            className='rounded-md text-white bg-green1A h-input-default text-sm'
                                        >
                                            EDI送信
                                        </Button>
                                    </div>
                                </Container>
                            </div>
                        ),
                    },
                ]}
            />
        </Layout>
    );
};

export default ManifestRegister;

const IndustrialWastes = ({ industrialWastes }: { industrialWastes: IIndustrialWaste[] }) => (
    <>
        <div className={`bg-white ${industrialWastes.length > 0 && 'pt-3'}`}>
            <Container>
                {industrialWastes.map((e, index) => (
                    <div key={index} className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                        <span>{e.wasteTypeName}</span>
                        <span>
                            回収数量：{e.quantity} {e.unitName}
                        </span>
                    </div>
                ))}
            </Container>
        </div>
        {/* empty data */}
        {industrialWastes.length === 0 && (
            <Container>
                <span className='text-yellow01 text-sm py-3 block'>産業廃棄物はありません</span>
            </Container>
        )}
    </>
);

const IndustrialWasteControlleds = ({
    industrialWasteControlleds,
}: {
    industrialWasteControlleds: IIndustrialWaste[];
}) => (
    <>
        <div className={`bg-white ${industrialWasteControlleds.length > 0 && 'pt-3'}`}>
            <Container>
                {industrialWasteControlleds.concat(industrialWasteControlleds)?.map((e, index) => (
                    <div key={index} className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                        <span>{e.wasteTypeName}</span>
                        <span>
                            回収数量：{e.quantity} {e.unitName}
                        </span>
                    </div>
                ))}
            </Container>
        </div>
        {industrialWasteControlleds.length === 0 && (
            <Container>
                <span className='text-yellow01 text-sm py-3 block'>
                    特別管理産業廃棄物はありません
                </span>
            </Container>
        )}
    </>
);
