/* eslint-disable react-hooks/exhaustive-deps */
import { Collapse } from 'antd';
import Container from 'components/organisms/container';
import Layout from 'components/templates/Layout';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { CollectionDetail } from 'models';
import { ICompany } from 'models/companies';
import { IResponseGetManifestConfirm } from 'models/manifests';
import { IVehicle } from 'models/vehicle';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyGetCompaniesQuery } from 'services/companies';
import { useLazyGetManifestConfirmInformationQuery } from 'services/manifests';
import { useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE } from 'utils/constants';

dayjs.locale('ja');
const ManifestConfirm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.MANIFEST_CONFIRM],
    );

    const cacheCollectedQuantityInput = useAppSelector(
        (state) => state.reducer.collection.collectedQuantityInput,
    );

    const collectionDetail: CollectionDetail = cacheCollectedQuantityInput?.selectedCollection;
    const collectionDate = cacheCollectedQuantityInput?.collectionDate;
    const user = useAppSelector((state) => state.reducer.user);
    const vehicle = useAppSelector((state) => state.reducer.vehicle);

    const [
        getComanyInfo,
        { data: companyInfo, isLoading: isLoadingCompanyInfo, isFetching: isFetchingCompanyInfo },
    ] = useLazyGetCompaniesQuery();
    const [
        getManifestConfirmInformation,
        {
            data: manifestConfirmInformation,
            isLoading: isLoadingManifestConfirmInfo,
            isFetching: isFetchingManifestConfirmInfo,
        },
    ] = useLazyGetManifestConfirmInformationQuery();

    useEffect(() => {
        if (!collectionDetail || !collectionDate) {
            handleRollback();
        }

        const maniPatternSystemId = searchParams.get('maniPatternSystemId');
        if (maniPatternSystemId) {
            getManifestConfirmInformation({ maniPatternSystemId });
        }

        if (vehicle.selectedVehicle.companyCd) {
            getComanyInfo({ cd: vehicle.selectedVehicle.companyCd });
        }
    }, []);

    const handleRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`);
    };

    return (
        <Layout
            title='マニフェスト確認'
            isLoading={
                isLoadingManifestConfirmInfo ||
                isFetchingManifestConfirmInfo ||
                isLoadingCompanyInfo ||
                isFetchingCompanyInfo
            }
            isShowRollback
            onClickRollback={handleRollback}
        >
            <div className='bg-white pt-3'>
                <Container>
                    <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                        <span>回収作業日</span>
                        <span>
                            {collectionDate && dayjs(collectionDate).format('YYYY年MM月DD日(dd)')}
                        </span>
                    </div>
                    <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                        <span>産業廃棄物種類 </span>
                        <span>{manifestConfirmInformation?.industrialWastetype}</span>
                    </div>
                    <div className='grid grid-cols-[175px_auto]  gap-x-2 flex-wrap text-ssm pb-3'>
                        <div className='flex gap-x-2'>
                            <span className='whitespace-nowrap'>品名</span>
                            <span>{collectionDetail?.productName}</span>
                        </div>
                        <div className='flex gap-x-2'>
                            <span className='whitespace-nowrap'>数量</span>
                            <span>
                                {collectionDetail?.quantity}
                                {collectionDetail?.unitName}
                            </span>
                        </div>
                    </div>
                    <div className='grid grid-cols-[175px_auto]  gap-x-2 flex-wrap text-ssm pb-3'>
                        <div className='flex gap-x-2'>
                            <span className='whitespace-nowrap'>荷姿</span>
                            <span>{collectionDetail?.packagingName}</span>
                        </div>
                        <div className='flex gap-x-2'>
                            <span className='whitespace-nowrap'>荷姿数量</span>
                            <span>{collectionDetail?.packagingQuantity}</span>
                        </div>
                    </div>
                </Container>
            </div>
            <Collapse
                bordered={false}
                defaultActiveKey={['1', '2', '3', '4']}
                className='[&_.ant-collapse-header]:!p-0 [&_.ant-collapse-header]:!items-center [&_.ant-collapse-header]:bg-green15 [&_.ant-collapse-content-box]:!p-0 pb-[80px] '
                // eslint-disable-next-line react/no-unstable-nested-components
                expandIcon={({ isActive }) => (
                    <Container>
                        {' '}
                        <button
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
                            <div className='bg-green15 py-2' role='button'>
                                <Container classnames='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                            排出事業者
                                        </span>
                                    </div>
                                </Container>
                            </div>
                        ),
                        children: (
                            <Discharger manifestConfirmInformation={manifestConfirmInformation} />
                        ),
                    },
                    {
                        key: '2',
                        label: (
                            <div className='bg-green15 py-2' role='button'>
                                <Container classnames='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                            運搬業者
                                        </span>
                                    </div>
                                </Container>
                            </div>
                        ),
                        children: (
                            <Carrier
                                user={user}
                                vehicle={vehicle}
                                companyInfo={companyInfo || null}
                            />
                        ),
                    },
                    {
                        key: '3',
                        label: (
                            <div className='bg-green15 py-2' role='button'>
                                <Container classnames='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                            荷降先
                                        </span>
                                    </div>
                                </Container>
                            </div>
                        ),
                        children: (
                            <UnloadingDestination
                                manifestConfirmInformation={manifestConfirmInformation}
                            />
                        ),
                    },
                    {
                        key: '4',
                        label: (
                            <div className='bg-green15 py-2' role='button'>
                                <Container classnames='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                            処分受託者
                                        </span>
                                    </div>
                                </Container>
                            </div>
                        ),
                        children: (
                            <DisposalTrustee
                                manifestConfirmInformation={manifestConfirmInformation}
                            />
                        ),
                    },
                ]}
            />
        </Layout>
    );
};

export default ManifestConfirm;
const Discharger = ({
    manifestConfirmInformation,
}: {
    manifestConfirmInformation: IResponseGetManifestConfirm;
}) => (
    <>
        <div className='bg-white pt-3'>
            <Container>
                <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                    <span>排出事業者名</span>
                    <span>{manifestConfirmInformation?.emittingCompanyName}</span>
                </div>
                <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                    <span>排出事業者郵便番号</span>
                    <span>{manifestConfirmInformation?.emittingCompanyPost}</span>
                </div>
                <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                    <span>排出事業者住所</span>
                    <span>{manifestConfirmInformation?.emittingCompanyAddress}</span>
                </div>

                <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                    <span>排出事業者電話番号</span>
                    <span>{manifestConfirmInformation?.emittingCompanyTel}</span>
                </div>
                <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                    <span>排出事業場名</span>
                    <span>{manifestConfirmInformation?.emittingSiteName}</span>
                </div>
                <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                    <span>排出事業場郵便番号</span>
                    <span>{manifestConfirmInformation?.emittingSitePost}</span>
                </div>
                <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                    <span>排出事業場住所</span>
                    <span>{manifestConfirmInformation?.emittingSiteAddress}</span>
                </div>
                <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                    <span>排出事業場電話番号</span>
                    <span>{manifestConfirmInformation?.emittingSiteTel}</span>
                </div>
            </Container>
        </div>
        {/* empty data */}
        {/* <Container>
                <span className='text-yellow01 text-sm py-3 block'>回収現場はありません</span>
            </Container> */}
    </>
);

const Carrier = ({
    user,
    vehicle,
    companyInfo,
}: {
    user: any;
    vehicle: { selectedVehicle: IVehicle | null };
    companyInfo: ICompany;
}) => (
    <div className='bg-white pt-3'>
        <Container>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>運搬業者名</span>
                <span>
                    {companyInfo?.companyName1}
                    {companyInfo?.companyName2}
                </span>
            </div>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>運搬担当者名</span>
                <span>{user?.user?.employeeName}</span>
            </div>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>車輌番号</span>
                <span>{vehicle.selectedVehicle.vehicleName}</span>
            </div>
        </Container>
    </div>
);

const UnloadingDestination = ({
    manifestConfirmInformation,
}: {
    manifestConfirmInformation: IResponseGetManifestConfirm;
}) => (
    <div className='bg-white pt-3'>
        <Container>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>荷降先名</span>
                <span>{manifestConfirmInformation?.unloadingSiteName}</span>
            </div>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>荷降先郵便番号</span>
                <span>{manifestConfirmInformation?.unloadingSitePost}</span>
            </div>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>荷降先住所</span>
                <span>{manifestConfirmInformation?.unloadingSiteAddress}</span>
            </div>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>荷降先電話番号</span>
                <span>{manifestConfirmInformation?.unloadingSiteTel}</span>
            </div>
        </Container>
    </div>
);

const DisposalTrustee = ({ manifestConfirmInformation }) => (
    <div className='bg-white pt-3'>
        <Container>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>処分受託者名</span>
                <span>{manifestConfirmInformation?.disposalTrusteeName}</span>
            </div>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>処分受託者郵便番号</span>
                <span>{manifestConfirmInformation?.disposalTrusteePost}</span>
            </div>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>処分受託者住所</span>
                <span>{manifestConfirmInformation?.disposalTrusteeAddress}</span>
            </div>
            <div className='grid grid-cols-[175px_auto] gap-x-2 text-ssm pb-3'>
                <span>処分受託者電話番号</span>
                <span>{manifestConfirmInformation?.disposalTrusteeTel}</span>
            </div>
        </Container>
    </div>
);
