/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from 'components/templates/Layout';
import Container from 'components/organisms/container';
import { Button } from 'antd';
import { CONSTANT_ROUTE } from 'utils/constants';
import { useLazyGetSiteByKeyQuery, useLazyGetSitesByCompanyQuery } from 'services/sites';
import { IParamsGetSiteByKey } from 'models/site';
import { useDispatch } from 'react-redux';
import { setPreviousPage } from 'services/page';
import { useAppSelector } from 'store/hooks';
import { SkylineIcon } from 'components/icons/SkylineIcon';

const FacilityInformation = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [getSite, { data, isFetching, isLoading }] = useLazyGetSitesByCompanyQuery();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.FACILITY_INFORMATION],
    );

    useEffect(() => {
        const params = {
            siteCd: searchParams.get('siteCd'),
            companyCd: searchParams.get('companyCd'),
        };

        getSite(params);
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

    const handleRollback = () => {
        navigate(previousUrl);
    };

    return (
        <Layout
            title='搬入先現場情報'
            isShowRollback
            isLoading={isLoading || isFetching}
            onClickRollback={handleRollback}
            fixedHeader
        >
            <div className='bg-green15 py-2 fixed top-header w-full z-10'>
                <Container classnames='flex justify-between items-center'>
                    <span className='w-fit  text-[white] text-md font-semibold font-inter'>
                        現場情報
                    </span>
                    <button
                        type='button'
                        onClick={viewpastComplaints}
                        className='rounded-xl text-white bg-transparent border border-white p-2'
                    >
                        クレーム情報
                    </button>
                </Container>
            </div>
            <div className='mt-[167px]'>
            <div className='px-4 py-5 bg-white mb-[3px]'>
                <div className='grid grid-cols-[40px_auto] gap-3 items-start'>
                    <SkylineIcon className=' mr-3' />
                    <div>
                        <span className='text-green1A text-xl block font-bold'>
                            {data?.companyName}
                        </span>
                        <span className='text-black27 text-sm my-2 block'>{data?.siteName}</span>
                        <div className='text-sm mb-2 flex'>
                            <span className='text-gray93 font-light block whitespace-nowrap'>
                                住 所：
                            </span>
                            <span className='text-black27 pr-2'>〒{data?.sitePost}</span>
                        </div>
                        <div className='flex items-start' role='button' onClick={() => openMap()}>
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
        </Layout>
    );
};

export default FacilityInformation;
