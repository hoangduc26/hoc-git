/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Switch, Checkbox } from 'antd';
import FuncBlock from 'components/common/FuncBlock';
import Layout from 'components/templates/Layout';
import React, { useEffect, useMemo, useState } from 'react';
import './index.scss';
import { useGetDetailContractQuery } from 'services/contracts';
import dayjs from 'dayjs';
import { convertDate } from 'utils/dates';
import { CONSTANT_ROUTE } from 'utils/constants';
import { useNavigate } from 'react-router-dom';
import Container from 'components/organisms/container';
import { DownloadIcon } from 'components/icons/DownloadIcon';

dayjs.locale('ja');

const ContractDetail: React.FC = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const systemId = urlParams.has('systemId') ? urlParams.get('systemId') : null;
    const [uploadedFile, setUploadedFile] = useState([]);
    const [transportFile, setTransportFile] = useState([]);
    const [disposalFile, setDisposalFile] = useState([]);

    const { data: dataContract, isLoading: isLoadingData } = useGetDetailContractQuery({
        systemId,
    });

    useEffect(() => {
        if (dataContract?.transportPermitDtos?.fileDataDtos) {
            GetUploadFile(dataContract?.transportPermitDtos?.fileDataDtos, 'FILE_TRANSPORT');
        }
        if (dataContract?.disposalPermitDtos?.fileDataDtos) {
            GetUploadFile(dataContract?.disposalPermitDtos?.fileDataDtos, 'FILE_DISPOSAL');
        }
        if (dataContract?.fileDataDtos) {
            GetUploadFile(dataContract?.fileDataDtos, 'FILE');
        }
    }, [dataContract]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
            const contentDispositionHeader = response.headers.get('Content-Disposition');
            const fileNameMatch = contentDispositionHeader.match(/filename\*?=([^;]+)/);
            const fileName = fileNameMatch
                ? fileNameMatch[1].trim().replace(/^"(.*)"$/, '$1')
                : 'filename';
            const contentType = response.headers.get('Content-Type');
            return response
                .blob()
                .then((blob) => new File([blob], fileName, { type: contentType }));
        });
    };

    const GetUploadFile = async (fileInfos, TYPE: string) => {
        if (fileInfos?.length > 0) {
            fileInfos.forEach(async (x) => {
                const { fileExtention, fileId, fileLength, fileName } = x;
                const file: any = await fetchFile(
                    `${process.env.REACT_APP_API_BASE_URL}/api/v1/files/${fileId}`,
                );

                if (file) {
                    if (TYPE === 'FILE') {
                        setUploadedFile([...uploadedFile, file]);
                    }
                    if (TYPE === 'FILE_TRANSPORT') {
                        setTransportFile([...transportFile, file]);
                    }
                    if (TYPE === 'FILE_DISPOSAL') {
                        setDisposalFile([...disposalFile, file]);
                    }
                }
            });
        }
    };

    const handleDownloadFile = (file) => {
        if (file) {
            const binaryData = [];
            binaryData.push(file);
            const downloadUrl = window.URL.createObjectURL(
                new Blob(binaryData, { type: file.type }),
            );
            //  window.URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.name;
            link.click();
            URL.revokeObjectURL(downloadUrl);
        }
    };
    const handleRollback = () => {
        navigate(`/${CONSTANT_ROUTE.CONTRACTS}`);
    };
    return (
        <Layout
            isShowDate={false}
            title='委託契約情報'
            isLoading={isLoadingData}
            isShowDownload={dataContract?.fileDataDtos?.length > 0}
            onClickDownload={() => handleDownloadFile(uploadedFile[0])}
            isShowRollback
            onClickRollback={handleRollback}
            fixedHeader
        >
            {/* Header block */}
            <div className='mt-header'>
                <FuncBlock
                    leftChild={
                        <div className='flex items-center '>
                            <h2 className='font-semibold text-white text-md mb-0 mr-3'>基本情報</h2>
                        </div>
                    }
                />
            </div>
            <div className='basic_information'>
                <div className='flex bg-white py-4 px-4 gap-2 items-center'>
                    <Switch
                        className='bg-grayE9 pointer-events-none'
                        checked={dataContract?.individualDesignationFlg}
                    />
                    <p
                        className={`text-md ${
                            dataContract?.individualDesignationFlg ? 'text-green1A' : 'text-red2a'
                        }  tracking-wider`}
                    >
                        個別指定
                    </p>
                </div>
                <div className='bg-white pb-3 text-sm'>
                    <Container>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 block min-w-[70px]'>契約種類 </span>
                            <span>：</span>
                            <span className='text-black27'>
                                {dataContract?.contractForm} - {dataContract?.contractType}
                            </span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 block min-w-[70px]'>契約番号 </span>
                            <span>：</span>
                            <span className='text-black27'>{dataContract?.contractNo}</span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 block min-w-[70px]'>更新種別 </span>
                            <span>：</span>
                            <span className='text-black27'>{dataContract?.updateType}</span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 block min-w-[70px]'>契約日付 </span>
                            <span>：</span>
                            <span className='text-black27'>
                                {dataContract?.contractDate &&
                                    `${`${dayjs(dataContract?.contractDate).format(
                                        `YYYY/MM/DD`,
                                    )} (${convertDate(dataContract?.contractDate)})`}
                                        `}
                            </span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 block min-w-[70px]'>
                                有効期限
                                <br />
                                （開始）
                            </span>
                            <span>：</span>
                            <span className='text-black27'>
                                {dataContract?.validBeginDate &&
                                    `${`${dayjs(dataContract?.validBeginDate).format(
                                        `YYYY/MM/DD`,
                                    )} (${convertDate(dataContract?.validBeginDate)})`}
                            `}
                            </span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 block min-w-[70px]'>
                                有効期限
                                <br />
                                （終了）
                            </span>
                            <span>：</span>
                            <span className='text-black27'>
                                {dataContract?.validEndDate &&
                                    `${`${dayjs(dataContract?.validEndDate).format(
                                        `YYYY/MM/DD`,
                                    )} (${convertDate(dataContract?.validEndDate)})`}
                            `}
                            </span>
                        </div>
                        <div className='mb-2 flex items-start'>
                            <span className='text-gray93 block min-w-[70px]'>備 考 </span>
                            <span>：</span>
                            <div className='gap-y-2'>
                                <span className='text-black27 mb-2 block'>
                                    {dataContract?.note1}
                                </span>
                                <span className='text-black27 mb-2 block'>
                                    {dataContract?.note2}
                                </span>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            {/* DayTime Block */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            契約状況（状況：保管）
                        </h2>
                    </div>
                }
            />
            <div className='bg-white py-3 text-sm'>
                <Container>
                    <div className='mb-2 flex items-start'>
                        <span className='text-gray93 block min-w-[70px]'>作成日付 </span>
                        <span>：</span>
                        <span className='text-black27'>
                            {dataContract?.createDate &&
                                `${`${dayjs(dataContract?.createDate).format(
                                    `YYYY/MM/DD`,
                                )} (${convertDate(dataContract?.createDate)})`}
                            `}
                        </span>
                    </div>
                    <div className='mb-2 flex items-start'>
                        <span className='text-gray93 block min-w-[70px]'>送付日付 </span>
                        <span>：</span>
                        <span className='text-black27'>
                            {dataContract?.sendDate &&
                                `${`${dayjs(dataContract?.sendDate).format(
                                    `YYYY/MM/DD`,
                                )} (${convertDate(dataContract?.sendDate)})`}
                            `}
                        </span>
                    </div>
                    <div className='mb-2 flex items-start'>
                        <span className='text-gray93 block min-w-[70px]'>返送日付 </span>
                        <span>：</span>
                        <span className='text-black27'>
                            {dataContract?.returnDate &&
                                `${`${dayjs(dataContract?.returnDate).format(
                                    `YYYY/MM/DD`,
                                )} (${convertDate(dataContract?.returnDate)})`}
                            `}
                        </span>
                    </div>
                    <div className='mb-2 flex items-start'>
                        <span className='text-gray93 block min-w-[70px]'>保管日付 </span>
                        <span>：</span>
                        <span className='text-black27'>
                            {dataContract?.endDate &&
                                `${`${dayjs(dataContract?.endDate).format(
                                    `YYYY/MM/DD`,
                                )} (${convertDate(dataContract?.endDate)})`}
                            `}
                        </span>
                    </div>
                </Container>
            </div>
            {/* emittingSiteDtos */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>排出場所情報</h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.emittingSiteDtos.length}
                        </div>
                    </div>
                }
            />
            {dataContract?.emittingSiteDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg overflow-hidden bg-white'>
                        <div className='grid grid-flow-col grid-cols-2  bg-green26'>
                            <div className='border p-3'>排出事業者</div>
                            <div className='border p-3'>排出事業場</div>
                        </div>
                        {dataContract?.emittingSiteDtos.map((item, index: number) => (
                            <div className='grid grid-cols-2 '>
                                <div className='border  p-3'>{item.companyName}</div>
                                <div className='border  p-3'>{item.siteName}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        排出場所情報はありません
                    </p>
                </div>
            )}

            {/* productDtos */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>品名情報</h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.productDtos.length}
                        </div>
                    </div>
                }
            />
            {dataContract?.productDtos.length <= 0 && (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        品名情報はありません
                    </p>
                </div>
            )}

            {dataContract?.productDtos.length > 0 &&
                dataContract?.productDtos.map((item) => (
                    <>
                        <FuncBlock
                            bgColor='bg-green25'
                            leftChild={
                                <div className='flex items-center '>
                                    <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                                        {item?.productName}
                                    </h2>
                                </div>
                            }
                        />
                        <div className='p-5 text-sm'>
                            <div className='rounded-lg bg-white'>
                                <div className='grid grid-cols-5  text-green1A text-center '>
                                    <div className='flex col-span-2'>
                                        <div className='border w-1/3 py-3'>積替</div>
                                        <Checkbox
                                            className='border w-1/3 px-1 flex justify-center'
                                            checked={item?.connectingFlg || item.importFlg}
                                        />
                                        <div className='border w-1/3 py-3'>輸入</div>
                                    </div>
                                    <div className='flex col-span-2 items-center'>
                                        <div className='border mx-auto w-3/12 py-3'>
                                            <Checkbox checked={item.certificateOfAnalysis} />
                                        </div>
                                        <div className='border w-9/12 py-3'>分析証明書</div>
                                    </div>
                                    <div className='border col-span-1' />
                                </div>
                                <div className='grid grid-cols-5 text-green1A '>
                                    <div className='border p-3 col-span-2'>運搬数量/単価</div>
                                    <div className='border p-3 col-span-2 text-black font-bold text-start'>
                                        {item?.transportQuantity} {item?.transportUnitName}
                                    </div>
                                    <div className='border p-3 col-span-1'>
                                        {item?.transportUnitPrice}
                                    </div>
                                </div>
                                <div className='grid grid-cols-5   text-green1A '>
                                    <div className='border p-3 col-span-2 '>処分数量/単価</div>
                                    <div className='border p-3 col-span-2 text-black font-bold text-start'>
                                        {item?.disposalQuantity} {item?.disposalUnitName}
                                    </div>
                                    <div className='border p-3 col-span-1'>
                                        {item?.disposalUnitPrice}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ))}

            {/* reportClassificationDtos */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            報告書分類情報
                        </h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.reportClassificationDtos.length}
                        </div>
                    </div>
                }
            />
            {dataContract?.reportClassificationDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg bg-white overflow-hidden'>
                        <div className='grid grid-flow-col grid-cols-2 bg-green26'>
                            <div className='border p-3'>報告書分類CD</div>
                            <div className='border p-3'>報告書分類名</div>
                        </div>
                        {dataContract?.reportClassificationDtos.map((item, index: number) => (
                            <div className='grid grid-cols-2 '>
                                <div className='border text-right p-3'>
                                    {item.reportClassificationCd}
                                </div>
                                <div className='border  p-3'>{item.reportClassificationName}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        報告書分類情報はありません
                    </p>
                </div>
            )}

            {/* "transportDtos" */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            運搬受託者情報
                        </h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.transportDtos.length}
                        </div>
                    </div>
                }
            />

            {dataContract?.transportDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg bg-white overflow-hidden'>
                        <div className='grid grid-flow-col grid-cols-2 '>
                            <div className=' bg-green26'>
                                <div className='border p-3 '>運搬受託者CD</div>
                            </div>
                            <div className='bg-green26'>
                                <div className='border p-3'>運搬受託者名</div>
                            </div>
                        </div>
                        {dataContract?.transportDtos.map((item, index: number) => (
                            <div
                                className={`grid grid-cols-2 ${
                                    (index + 1) % 2 === 0 ? 'bg-yellow25' : 'bg-white'
                                } `}
                            >
                                <div className='border text-right p-3'>
                                    <p>{item.carrierTrusteeCd}</p>
                                </div>
                                <div className='border  p-3'>{item.carrierTrusteeName}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        運搬受託者情報はありません
                    </p>
                </div>
            )}

            {/* "storageDtos":  */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            積替保管場所情報
                        </h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.storageDtos.length}
                        </div>
                    </div>
                }
            />

            {dataContract?.storageDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg bg-white overflow-hidden'>
                        <div className='grid grid-flow-col grid-cols-2 '>
                            <div className=' bg-green26'>
                                <div className='border p-3 '>運搬受託者名</div>
                            </div>
                            <div className='bg-green26'>
                                <div className='border p-3'>積替保管場所名</div>
                            </div>
                        </div>
                        {dataContract?.storageDtos.map((item, index: number) => (
                            <div
                                className={`grid grid-cols-2 ${
                                    (index + 1) % 2 === 0 ? 'bg-yellow25' : 'bg-white'
                                } `}
                            >
                                <div className='border  p-3'>
                                    <p>{item.carrierTrusteeName}</p>
                                </div>
                                <div className='border  p-3'>{item.storageLocationName}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        積替保管場所情報はありません
                    </p>
                </div>
            )}

            {/* disposalDtos */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            処分事業場情報
                        </h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.disposalDtos.length}
                        </div>
                    </div>
                }
            />

            {dataContract?.disposalDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg bg-white overflow-hidden'>
                        <div className='grid '>
                            <div className='grid grid-cols-2  bg-green26'>
                                <div className='border p-3 '>処分受託者名</div>
                                <div className='border  p-3 '>処分事業場名</div>
                            </div>
                            <div className='grid grid-cols-2 bg-green26'>
                                <div className='border p-3'>処分方法</div>
                                <div className='border p-3'>処分事業場住所</div>
                            </div>
                        </div>
                        {dataContract?.disposalDtos.map((item, index: number) => (
                            <div
                                className={`grid grid-cols-2 ${
                                    (index + 1) % 2 === 0 ? 'bg-yellow25' : 'bg-white'
                                } `}
                            >
                                <div className='border  p-3'>
                                    <p>{item.disposalTrusteeName}</p>
                                </div>
                                <div className='border  p-3'>{item.disposalSiteName}</div>
                                <div className='border  p-3'>{item.disposalMethodName}</div>
                                <div className='border  p-3'>{item.disposalSiteAddress}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        処分事業場情報はありません
                    </p>
                </div>
            )}

            {/* finalDisposalDtos */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            最終処分場情報
                        </h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.finalDisposalDtos.length}
                        </div>
                    </div>
                }
            />
            {dataContract?.finalDisposalDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg bg-white overflow-hidden'>
                        <div className='grid '>
                            <div className='grid grid-cols-2'>
                                <div className='border p-3 bg-green26 '>処分受託者名</div>
                                <div className='border  p-3 bg-green26 '>最終処分場名</div>
                            </div>
                            <div className='grid grid-cols-2'>
                                <div className='border  p-3 bg-green26'>処分方法</div>
                                <div className='border  p-3 bg-green26'>最終処分場所住所</div>
                            </div>
                        </div>
                        {dataContract?.finalDisposalDtos.map((item, index: number) => (
                            <div
                                className={`grid grid-cols-2 ${
                                    (index + 1) % 2 === 0 ? 'bg-yellow25' : 'bg-white'
                                } `}
                            >
                                <div className='border  p-3'>
                                    <p>{item.disposalTrusteeName}</p>
                                </div>
                                <div className='border  p-3'>{item.finalDisposalSiteName}</div>
                                <div className='border  p-3'>{item.disposalMethodName}</div>
                                <div className='border  p-3'>{item.finalDisposalSiteAddress}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        最終処分場情報はありません
                    </p>
                </div>
            )}

            {/* memorandumDtos */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>覚書情報</h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.memorandumDtos.length}
                        </div>
                    </div>
                }
            />

            {dataContract?.memorandumDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg overflow-hidden bg-white'>
                        <div className='grid grid-flow-col grid-cols-2   '>
                            <div className='border  p-3 bg-green26 '>更新日</div>
                            <div className='border  p-3 bg-green26'>覚書</div>
                        </div>
                        {dataContract?.memorandumDtos.map((item, index: number) => (
                            <div className='grid grid-cols-2 '>
                                <div className='border p-3'>
                                    {item.updateDate &&
                                        `${`${dayjs(item.updateDate).format(
                                            `YYYY/MM/DD`,
                                        )} (${convertDate(item.updateDate)})`}
                                        `}
                                </div>
                                <div className='border  p-3'>{item.memorandum}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        覚書情報はありません
                    </p>
                </div>
            )}

            {/* "transportPermitDtos" */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            運搬許可証情報
                        </h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.transportPermitDtos.length}
                        </div>
                    </div>
                }
            />
            {dataContract?.transportPermitDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg overflow-hidden'>
                        <div className='grid  bg-white '>
                            <div className='grid grid-cols-2'>
                                <div className='border p-3 bg-green26 '>運搬受託者名</div>
                                <div className='border  p-3 bg-green26 '>地域</div>
                            </div>
                            <div className='grid grid-cols-2'>
                                <div className='border  p-3 bg-green26'>行政許可区分</div>
                                <div className='border  p-3 bg-green26'>許可番号</div>
                            </div>
                        </div>
                        {dataContract?.transportPermitDtos.map((item, index: number) => (
                            <div
                                className={`grid grid-cols-2 ${
                                    (index + 1) % 2 === 0 ? 'bg-yellow25' : 'bg-white'
                                } `}
                            >
                                <div className='border  p-3'>
                                    <p>{item.transportTrusteeName}</p>
                                </div>
                                <div className='border  p-3'>{item.regionName}</div>
                                <div className='border  p-3'>{item.permitType}</div>
                                <div className='border flex justify-between  p-3'>
                                    {item.permitNo}
                                    {item.fileDataDtos ? (
                                        <span
                                            role='button'
                                            onClick={() => handleDownloadFile(transportFile[index])}
                                        >
                                            <DownloadIcon className='' />
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        運搬許可証情報はありません
                    </p>
                </div>
            )}

            {/*  disposalPermitDtos */}
            <FuncBlock
                leftChild={
                    <div className='flex items-center '>
                        <h2 className='font-semibold text-white text-md mb-0 mr-3'>
                            処分許可証情報
                        </h2>
                        <div className='w-[25px] h-[30px] bg-red2a rounded-sm text-yellow59 font-bold flex items-center text-sm justify-center'>
                            {dataContract?.disposalPermitDtos.length}
                        </div>
                    </div>
                }
            />
            {dataContract?.disposalPermitDtos.length > 0 ? (
                <div className='p-5 text-sm'>
                    <div className='rounded-lg overflow-hidden'>
                        <div className='grid  bg-white '>
                            <div className='grid grid-cols-2'>
                                <div className='border p-3 bg-green26'>処分受託者名</div>
                                <div className='border p-3 bg-green26 '>処分事業場名</div>
                            </div>
                            <div className='grid grid-cols-2'>
                                <div className='flex w-full'>
                                    <div className='border p-3 bg-green26 w-2/5'>地域</div>
                                    <div className='border p-3 bg-green26 w-3/5'>行政許可区分</div>
                                </div>

                                <div className='border p-3 bg-green26'>許可番号</div>
                            </div>
                        </div>
                        {dataContract?.disposalPermitDtos.map((item, index: number) => (
                            <div
                                className={`grid grid-cols-2 ${
                                    (index + 1) % 2 === 0 ? 'bg-yellow25' : 'bg-white'
                                } `}
                            >
                                <div className='border  p-3'>
                                    <p>{item.disposalTrusteeName}</p>
                                </div>
                                <div className='border  p-3'>{item.disposalSiteName}</div>
                                <div className='flex w-full'>
                                    <p className='w-2/5 border p-3'>{item.regionName}</p>
                                    <p className='w-3/5 border p-3'>{item.permitType}</p>
                                </div>
                                <div className='border flex justify-between p-3'>
                                    {item.permitNo}
                                    {item.fileDataDtos ? (
                                        <span
                                            role='button'
                                            onClick={() => handleDownloadFile(disposalFile[index])}
                                        >
                                            <DownloadIcon className='' />
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='text-center py-5'>
                    <p className='font-medium text-sm text-yellow-600 tracking-wide'>
                        処分許可証情報はありません
                    </p>
                </div>
            )}
        </Layout>
    );
};

export default ContractDetail;
