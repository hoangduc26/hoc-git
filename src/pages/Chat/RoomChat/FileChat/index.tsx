/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { Input, Skeleton, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PAGE_SIZE } from 'utils/constants';
import useDebounce from 'components/templates/hooks/useDebounce';
import { useLazyGetFileListQuery } from 'services/chat';
import dayjs from 'dayjs';
import iconMSPPT from 'assets/icons/ic_ms_ppt.svg';
import iconMsWord from 'assets/icons/ic_ms_word.svg';
import iconMsExcel from 'assets/icons/ic_ms_excel.svg';
import iconDocumentTxt from 'assets/icons/ic_document_txt.svg';
import { SearchIcon } from 'components/icons/SearchIcon';
import { DownloadIcon } from 'components/icons/DownloadIcon';
import iconRedClear from 'assets/icons/ic_red_clear.svg';

export interface ISelectValueModal {
    groupId: string;
}

const FILE_ICON = {
    EXCEL: iconMsExcel,
    WORD: iconMsWord,
    NOTE: iconDocumentTxt,
    POWERPOINT: iconMSPPT,
};

const FILE_TYPE = {
    EXCEL: 'sheet',
    WORD: 'word',
    NOTE: 'text/plain',
    POWERPOINT: 'presentation',
};

const FILE_EXTENSION = {
    EXCEL: ['.xls', '.xlsx'],
    WORD: ['.doc', '.docx'],
    NOTE: ['.txt'],
    POWERPOINT: ['.ppt', '.pptx'],
};

const FileChat: React.FC<ISelectValueModal> = ({ groupId }) => {
    const [paging, setPaging] = useState({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        totalRecords: 0,
    });

    const [listFile, setListFile] = useState([]);
    const [lengthItem, setLengthItem] = useState(0);
    const [getFileList, responseApiGet] = useLazyGetFileListQuery();
    const [keyword, setKeyword] = useState('');

    useDebounce(
        () => {
            const params = {
                SearchText: keyword,
                PageNumber: 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params, true);
        },
        300,
        [keyword],
    );

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    useEffect(() => {
        const params = {
            SearchText: keyword,
            PageNumber: paging.PageNumber,
            PageSize: paging.PageSize,
        };
        handleGetData(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMoreData = async () => {
        try {
            const params = {
                SearchText: keyword,
                PageNumber: paging.PageNumber + 1,
                PageSize: paging.PageSize,
            };
            handleGetData(params);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetData = async (params, isSearch?) => {
        const response = await getFileList({ groupId, params }).unwrap();
        if (response) {
            if (isSearch) {
                setLengthItem(response.items.length);
            } else {
                setLengthItem(lengthItem + response.items.length);
            }
            setPaging({
                ...paging,
                PageNumber: params.PageNumber,
                totalRecords: response.totalRecords,
            });
            const FileList = response.items.map((element) => {
                let icon;
                if (FILE_EXTENSION.EXCEL.find((x) => x === element.fileExtention))
                    icon = FILE_ICON.EXCEL;
                if (FILE_EXTENSION.WORD.find((x) => x === element.fileExtention))
                    icon = FILE_ICON.WORD;
                if (FILE_EXTENSION.NOTE.find((x) => x === element.fileExtention))
                    icon = FILE_ICON.NOTE;
                if (FILE_EXTENSION.POWERPOINT.find((x) => x === element.fileExtention))
                    icon = FILE_ICON.POWERPOINT;
                return {
                    ...element,
                    id: element.fileId,
                    name: element.fileName,
                    size: element.fileLength,
                    icon,
                };
            });
            const data = [...FileList];
            const createDate = data
                .filter(
                    (ele, ind) =>
                        ind ===
                        data.findIndex(
                            (elem) =>
                                dayjs(elem.createDate).format('YYYY/MM/DD') ===
                                dayjs(ele.createDate).format('YYYY/MM/DD'),
                        ),
                )
                .map((x) => x.createDate);
            const newData = [];
            createDate.forEach((element) => {
                const checkExistCreateDate = listFile.find(
                    (x) =>
                        dayjs(x.createdDate).format('YYYY/MM/DD') ===
                        dayjs(element).format('YYYY/MM/DD'),
                );
                const listDataGroup = data.filter(
                    (item) =>
                        dayjs(item.createDate).format('YYYY/MM/DD') ===
                        dayjs(element).format('YYYY/MM/DD'),
                );

                if (isSearch) {
                    const newItem = {
                        createdDate: element,
                        listFile: listDataGroup,
                    };
                    newData.push(newItem);
                } else {
                    if (checkExistCreateDate) {
                        setListFile(
                            listFile.map((item) =>
                                dayjs(item.createdDate).format('YYYY/MM/DD') ===
                                    dayjs(element).format('YYYY/MM/DD')
                                    ? {
                                        ...item,
                                        listFile: [
                                            ...checkExistCreateDate.listFile,
                                            ...listDataGroup,
                                        ],
                                    }
                                    : item,
                            ),
                        );
                    } else {
                        const newItem = {
                            createdDate: element,
                            listFile: listDataGroup,
                        };
                        newData.push(newItem);
                    }
                }
            });
            if (isSearch) {
                setListFile(newData);
            } else {
                if (newData.length > 0) {
                    setListFile([...listFile, ...newData]);
                }
            }
        }
    };

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

            // Extract the file name from the Content-Disposition header
            const contentDispositionHeader = response.headers.get('Content-Disposition');
            const fileNameMatch = contentDispositionHeader.match(/filename\*?=([^;]+)/);
            const fileName = fileNameMatch
                ? fileNameMatch[1].trim().replace(/^"(.*)"$/, '$1')
                : 'filename'; // Set a default name if not found

            // Extract the file type from the Content-Type header
            const contentType = response.headers.get('Content-Type');
            // setIsLoadingDownload(false);

            return response
                .blob()
                .then((blob) => new File([blob], fileName, { type: contentType }));
        });
    };

    const handleDownload = async (file) => {
        if (file) {
            const fileDownload = await fetchFile(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/files/${file.fileId}`,
            );
            const downloadUrl = URL.createObjectURL(fileDownload);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.fileName;
            link.click();
            URL.revokeObjectURL(downloadUrl);
        }
    };
    return (
        <div>
            <div className='px-4 pt-4 mb-3'>
                <Input
                    className='search-chat-input'
                    size='large'
                    placeholder='検索する'
                    prefix={
                        <div className='w-5 h-5'>
                            <SearchIcon className='w-full h-full object-cover' />
                        </div>
                    }
                    allowClear={{
                        clearIcon: (
                            <img
                                src={iconRedClear}
                                alt='iconRedClear'
                                onClick={() => {
                                    setKeyword('');
                                }}
                            />
                        ),
                    }}
                    onBlur={handleInputChange}
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            handleInputChange(event);
                        }
                    }}
                />
            </div>
            <div id='scrollableDiv' className='overflow-auto h-[calc(100vh_-_290px)]'>
                {responseApiGet.isLoading ? (
                    <div className='w-full min-h-[400px] flex items-center justify-center'>
                        <Spin spinning />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={lengthItem ?? 0}
                        next={loadMoreData}
                        hasMore={lengthItem < paging?.totalRecords}
                        loader={<Skeleton paragraph={{ rows: 1 }} active />}
                        scrollableTarget='scrollableDiv'
                    >
                        {listFile?.map((item, index) => (
                            <div key={index} className='p-3'>
                                <div className='font-bold text-green15 mb-1 text-sm'>
                                    {dayjs(item.createdDate).format('YYYY年MM月DD日')}
                                </div>
                                {item.listFile?.map((file, i) => (
                                    <div
                                        key={i}
                                        className='upload-file w-full rounded flex justify-between gap-1 py-1'
                                    >
                                        <div className='flex items-center gap-1 text-sm w-[88%] h-[50px] bg-green25 pl-2'>
                                            <img src={file.icon} alt='' />
                                            <span className='truncate'>{file.fileName}</span>
                                        </div>
                                        <div className='flex gap-1 h-[50px] bg-green25 p-1 items-center'>
                                            <button
                                                type='button'
                                                onClick={() => handleDownload(file)}
                                            >
                                                <DownloadIcon className='' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
};

export default FileChat;
