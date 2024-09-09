/* eslint-disable no-irregular-whitespace */
/* eslint-disable react-hooks/exhaustive-deps */
import { SkylineIcon } from 'components/icons/SkylineIcon';
import Container from 'components/organisms/container';
import Layout from 'components/templates/Layout';
import { IParamsGetSiteByKey } from 'models/site';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { setPreviousPage } from 'services/page';
import { useLazyGetSiteByKeyQuery } from 'services/sites';
import { useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE } from 'utils/constants';

const CollectionSiteInformation: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.reducer.user);
    const [getSiteByKey, { data, isFetching, isLoading }] = useLazyGetSiteByKeyQuery();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.COLLECTION_SITE_INFORMATION],
    );

    useEffect(() => {
        const params: IParamsGetSiteByKey = {
            seqNo: searchParams.get('seqNo'),
        };

        getSiteByKey(params);
    }, []);

    const openMap = () => {
        const address = (data?.siteAddress || '') + (data?.siteAddress2 || '');
        window.open(`https://www.google.com/maps/place/${address}`);
    };

    const viewpastComplaints = () => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.PAST_COMPLAINTS,
            }),
        );
        navigate({
            pathname: `/${CONSTANT_ROUTE.PAST_COMPLAINTS}`,
            search: `?siteName=${data?.siteName || ''}
            &siteCd=${data?.siteCd || ''}
            &companyName=${data?.companyName || ''}
            &companyCd=${data?.companyCd || ''}`,
        });
    };

    const viewContacts = () => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.CONTRACTS,
            }),
        );
        navigate({
            pathname: `/${CONSTANT_ROUTE.CONTRACTS}`,
            search: `?siteName=${data?.siteName || ''}
            &siteCd=${data?.siteCd || ''}
            &companyName=${data?.companyName || ''}
            &companyCd=${data?.companyCd || ''}`,
        });
    };

    const handleRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.COLLECTION_RECORD_INPUT}`);
    };

    return (
        <Layout
            title='回収現場情報'
            isShowRollback
            isLoading={isLoading || isFetching}
            onClickRollback={handleRollback}
            fixedHeader
        >
            <div className="mt-header">
            <div className='collection-information'>
                <div className='bg-green15 py-2'>
                    <Container classnames='flex justify-between items-center'>
                        <div className='flex items-center'>
                            <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                                現場情報
                            </span>
                        </div>
                        <div className='flex items-center'>
                            {user.user?.isSystemLimit === false && (
                                <button
                                    type='button'
                                    onClick={() => viewContacts()}
                                    className='rounded-xl text-white bg-green1A border border-green1A mr-2 p-2'
                                >
                                    委託契約情報
                                </button>
                            )}

                            <button
                                type='button'
                                onClick={viewpastComplaints}
                                className='rounded-xl text-white bg-transparent border border-white p-2'
                            >
                                クレーム情報
                            </button>
                        </div>
                    </Container>
                </div>
                <div className='px-4 py-5 bg-white mb-[3px]'>
                    <div className='flex items-start'>
                        <SkylineIcon className='mr-3' />
                        <div>
                            <span className='text-green1A text-xl block font-bold'>
                                {data?.companyName}
                            </span>
                            <span className='text-black27 text-sm my-2 block'>
                                {data?.siteName}
                            </span>
                            <div className='text-sm mb-2 flex'>
                                <span className='text-gray93 font-light block whitespace-nowrap'>
                                    住 所：
                                </span>
                                <span className='text-black27 pr-2'>〒{data?.sitePost}</span>
                            </div>
                            <div
                                className='flex items-start'
                                role='button'
                                onClick={() => openMap()}
                            >
                                <svg
                                    className='mr-3 min-w-[20px]'
                                    width='20'
                                    height='24'
                                    viewBox='0 0 20 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M19 10C19 17 10 23 10 23C10 23 1 17 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z'
                                        stroke='var(--sub-color)'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z'
                                        stroke='var(--sub-color)'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                                <span className='underline text-green15 text-sm'>
                                    {data?.siteAddress || ''}
                                    {data?.siteAddress2 || ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-white py-3 text-sm'>
                    <Container>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 block min-w-[70px]'>TEL </span>
                            <span>：</span>
                            <span className='text-black27'>{data?.siteTel}</span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 min-w-[70px]'>担当者</span>
                            <span>：</span>
                            <span className='text-black27'>{data?.siteAssigneeName}</span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 min-w-[70px]'>携 帯 </span>
                            <span>：</span>
                            <span className='text-black27'>{data?.siteAssigneeTel}</span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 min-w-[70px]'>備 考 </span>
                            <span>：</span>
                            <div className='gap-y-2'>
                                <span className='text-black27 mb-2 block'>{data?.note1}</span>
                                <span className='text-black27 mb-2 block'>{data?.note2}</span>
                                <span className='text-black27 mb-2 block'>{data?.note3}</span>
                                <span className='text-black27 block'>{data?.note4}</span>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            <div className='bg-green15 py-2'>
                <Container classnames='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <span className='w-fit  text-[white] text-md font-semibold font-inter '>
                            受付情報
                        </span>
                    </div>
                </Container>
            </div>
            <div className='bg-white py-3 text-sm'>
                <Container>
                    <div className='mb-2 flex items-start'>
                        <span className='text-gray93 block min-w-[70px]'>営業者 </span>
                        <span>：</span>
                        <span className='text-black27'>{data?.siteSalesPersonName}</span>
                    </div>
                    <div className='mb-2 flex items-start'>
                        <span className='text-gray93 min-w-[70px]'>指　示 </span>
                        <span>：</span>
                        <div className='gap-y-2'>
                            <span className='text-black27 mb-2 block'>
                                {data?.receptionInstruction1}
                            </span>
                            <span className='text-black27 mb-2 block'>
                                {data?.receptionInstruction2}
                            </span>
                            <span className='text-black27 mb-2 block'>
                                {data?.receptionInstruction3}
                            </span>
                        </div>
                    </div>
                    <div className='mb-2 flex items-start'>
                        <span className='text-gray93 min-w-[70px]'>備　考 </span>
                        <span>：</span>
                        <div className='gap-y-2'>
                            <span className='text-black27 mb-2 block'>{data?.receptionNote1}</span>
                            <span className='text-black27 mb-2 block'>{data?.receptionNote2}</span>
                            <span className='text-black27 mb-2 block'>{data?.receptionNote3}</span>
                        </div>
                    </div>
                </Container>
            </div>
            </div>
        </Layout>
    );
};

export default CollectionSiteInformation;
