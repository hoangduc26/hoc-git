/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import FuncBlock from 'components/common/FuncBlock';
import SubHeader from 'components/organisms/SubHeader';
import Layout from 'components/templates/Layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { JOBRegisterCard } from 'components/common/Cards';
import 'react-times/css/classic/default.css';
import 'react-times/css/material/default.css';
import { IJobRegisterCard } from 'components/common/Cards/JobRegisterCard';
import './index.scss';
import { Button, Modal, Switch } from 'antd';
import { CONSTANT_ROUTE, LOCAL_STORAGE } from 'utils/constants';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetCollectionContainerQuery, useLazyGetCollectionContainerQuery } from 'services/collection';
import { setPreviousPage } from 'services/page';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SkylineIcon } from 'components/icons/SkylineIcon';

const CollectionContainer: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [showQRModal, setShowQRModal] = useState(false);
    const [resultScan, setResultScan] = useState('データなし');
    const navigate = useNavigate();
    const seqNo = Number(searchParams.get('seqNo'));
    const [getCollectionContainer, { data: dataContainer, isLoading: isLoadingData }] = useLazyGetCollectionContainerQuery();
    const previousUrl = useAppSelector(
        (state) => state.reducer.page.urlPreviousPage[CONSTANT_ROUTE.COLLECTION_CONTAINER],
    );
    const location = useLocation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (seqNo) {
            getCollectionContainer({ seqNo }).unwrap();
        }
    }, [seqNo]);

    const dateTimeInfos = {
        title: '現場着:',
        date: new Date(),
        time: dataContainer?.arrivalTime?.slice(0, 5),
    };

    const cards: IJobRegisterCard[] = dataContainer?.containers;

    const handleClickRollback = () => {
        navigate(previousUrl || `/${CONSTANT_ROUTE.WORK_SELECTION}?seqNo=${seqNo}`);
    };

    const handleAddContainer = () => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.COLLECTION_CONTAINER_INPUT,
            }),
        );
        navigate(`/${CONSTANT_ROUTE.COLLECTION_CONTAINER_INPUT}?seqNo=${seqNo}`);
    };

    const handleEditContainer = (data) => {
        dispatch(
            setPreviousPage({
                previousUrl: location.pathname + location.search,
                previousUrlOfPage: CONSTANT_ROUTE.COLLECTION_CONTAINER_INPUT,
            }),
        );
        navigate(
            `/${CONSTANT_ROUTE.COLLECTION_CONTAINER_INPUT}?seqNo=${seqNo}&containerSeqNo=${data.containerSeqNo}&recordNo=${data.recordNo}`,
        );
    };

    useEffect(() => {
        if (dataContainer) {
            setTimeout(() => {
                const fixedElement = document.getElementById('fixed-element') as HTMLDivElement;
                const scrollElement = document.getElementById('scroll-element') as HTMLDivElement;
                scrollElement.style.marginTop = `${
                    fixedElement.offsetHeight + 46 + 66
                }px`;
                scrollElement.style.transition = 'all .2s';
            }, 0);
        }
    }, [dataContainer]);

    return (
        <Layout
            isShowDate={false}
            isLoading={isLoadingData}
            isShowRollback
            onClickRollback={() => handleClickRollback()}
            title='コンテナ作業選択'
            fixedHeader
        >
            <div id='fixed-element' className='fixed w-full z-10 top-header'>
            <SubHeader
                title={dataContainer?.companyName}
                desc={`(仮称) ${dataContainer?.siteName}`}
                svgIcon={<SkylineIcon />}
                dateTimeInfos={dateTimeInfos}
            />
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            コンテナ作業一覧
                        </h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContainer?.containers?.length}
                        </div>
                    </div>
                }
                isShowRightIcon
                onClickIcon={handleAddContainer}
            />
            </div>

            <div id='scroll-element'>
            <div className='px-4 py-4 flex flex-col gap-3'>
                {cards &&
                    cards?.map((card) => (
                        <JOBRegisterCard
                            {...card}
                            handleClickItem={() => handleEditContainer(card)}
                        />
                    ))}
            </div>         
            </div>   
        </Layout>
    );
};
export default CollectionContainer;
