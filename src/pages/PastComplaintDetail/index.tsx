/* eslint-disable no-irregular-whitespace */
/* eslint-disable react-hooks/exhaustive-deps */
import iconCalendar from 'assets/icons/ic_calendar.svg';
import { SkylineIcon } from 'components/icons/SkylineIcon';
import Container from 'components/organisms/container';
import Layout from 'components/templates/Layout';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyGetPastComplaintByKeyQuery } from 'services/pastComplaints';
import { useAppSelector } from 'store/hooks';
import { CONSTANT_ROUTE } from 'utils/constants';

dayjs.locale('ja');

const PastComplaintDetail: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.reducer.user);
    const [getPastComplaintByKey, { data, isFetching, isLoading }] =
        useLazyGetPastComplaintByKeyQuery();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.PAST_COMPLAINT_DETAIL],
    );

    const [companyName, setCompanyName] = useState('');
    const [siteName, setSiteName] = useState('');

    useEffect(() => {
        setSiteName(searchParams.get('siteName') || '');
        setCompanyName(searchParams.get('companyName') || '');

        const params = {
            systemId: searchParams.get('systemId'),
            seq: searchParams.get('seqNo'),
        };

        getPastComplaintByKey(params);
    }, []);

    const handleRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.MAIN_MENU}`);
    };

    return (
        <Layout
            title='過去クレーム情報詳細'
            isShowRollback
            isLoading={isLoading || isFetching}
            onClickRollback={handleRollback}
        >
            <div className='bg-green15 py-2'>
                <Container classnames='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <span className='w-fit  text-[white] text-md font-semibold font-inter  mr-3'>
                            現場情報
                        </span>
                    </div>
                </Container>
            </div>
            <div className='px-4 py-5 bg-white'>
                <div className='flex items-start'>
                    <SkylineIcon className='mr-3' />
                    <div>
                        <span className='text-green1A text-xl block font-bold'>{companyName}</span>
                        <span className='text-black27 text-sm my-2 block'>{siteName}</span>
                    </div>
                </div>
            </div>
            <div className='bg-green15 py-2'>
                <Container classnames='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <span className='w-fit  text-[white] text-md font-semibold font-inter '>
                            クレーム情報
                        </span>
                    </div>
                </Container>
            </div>
            <div className='py-2 bg-white mb-1'>
                <Container>
                    <div className='grid grid-cols-[100px_auto] items-center'>
                        <span className='text-green1A text-ssm'>受付日</span>
                        <div className='rounded-sm bg-grayF0 border relative border-grayD4  pl-2 pr-7 text-ssm whitespace-nowrap overflow-hidden text-ellipsis h-input-default leading-input-default'>
                            {data?.receptionDate &&
                                dayjs(new Date(data?.receptionDate)).format('YYYY/MM/DD(dd)')}

                            <div className='w-[24px] h-[24px] absolute top-2 right-2'>
                                <img
                                    src={iconCalendar}
                                    className='w-full h-full object-cover'
                                    alt='calendar-date'
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <div className='py-2 bg-white mb-1'>
                <Container>
                    <div className='grid grid-cols-[100px_auto] items-center'>
                        <span className='text-green1A text-ssm'>完了日</span>
                        <div className='rounded-sm bg-grayF0 border relative border-grayD4  pl-2 pr-7 text-ssm whitespace-nowrap overflow-hidden text-ellipsis h-input-default leading-input-default'>
                            {data?.responseCompletedDate &&
                                dayjs(new Date(data?.responseCompletedDate)).format(
                                    'YYYY/MM/DD(dd)',
                                )}

                            <div className='w-[24px] h-[24px] absolute top-2 right-2'>
                                <img
                                    src={iconCalendar}
                                    className='w-full h-full object-cover'
                                    alt='calendar-date'
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <div className='py-2 bg-white mb-1'>
                <Container>
                    <div className='grid grid-cols-[100px_auto] items-center'>
                        <span className='text-green1A text-ssm'>先方担当</span>
                        <div className='rounded-sm bg-grayF0 border border-grayD4  pl-2 text-ssm whitespace-nowrap overflow-hidden text-ellipsis h-input-default leading-input-default'>
                            {data?.contactAssignee}
                        </div>
                    </div>
                </Container>
            </div>

            <div className='py-2 bg-white mb-1'>
                <Container>
                    <div className='grid grid-cols-[100px_auto] items-center'>
                        <span className='text-green1A text-ssm'>表　題</span>
                        <div className='rounded-sm bg-grayF0 border border-grayD4  pl-2 text-ssm whitespace-nowrap overflow-hidden text-ellipsis h-input-default leading-input-default'>
                            {data?.titleName}
                        </div>
                    </div>
                </Container>
            </div>

            <div className='pt-2 pb-4 bg-white'>
                <Container>
                    <div className='grid gap-y-2 items-center'>
                        <span className='text-green1A text-ssm'>内 容</span>
                        <textarea
                            disabled
                            value={data?.content1}
                            className='rounded-sm bg-grayF0 border border-grayD4 p-2 '
                            cols={30}
                            rows={10}
                        />
                    </div>
                </Container>
            </div>
        </Layout>
    );
};

export default PastComplaintDetail;
