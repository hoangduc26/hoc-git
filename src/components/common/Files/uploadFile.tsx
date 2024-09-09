import React from 'react';
import { Upload } from 'antd';
import iconMSPPT from 'assets/icons/ic_ms_ppt.svg';
import iconMsWord from 'assets/icons/ic_ms_word.svg';
import iconMsExcel from 'assets/icons/ic_ms_excel.svg';
import iconDocumentTxt from 'assets/icons/ic_document_txt.svg';
import { v4 as uuidv4 } from 'uuid';

interface IUploadFile {
    children: React.ReactNode;
    onFileUpload(file: File): void;
    accept?: string;
}

const FILE_TYPE = {
    EXCEL: 'sheet',
    WORD: 'word',
    NOTE: 'text/plain',
    POWERPOINT: 'presentation',
};

const FILE_ICON = {
    EXCEL: iconMsExcel,
    WORD: iconMsWord,
    NOTE: iconDocumentTxt,
    POWERPOINT: iconMSPPT,
};

const UploadFile: React.FC<IUploadFile> = ({ children, onFileUpload, accept }) => {
    const handleUpload = (file) => {
        onFileUpload(file);
    };

    const customRequest = ({ file }) => {
        file.id = uuidv4();
        if (file?.type?.includes(FILE_TYPE.EXCEL)) file.icon = FILE_ICON.EXCEL;
        if (file?.type?.includes(FILE_TYPE.WORD)) file.icon = FILE_ICON.WORD;
        if (file?.type?.includes(FILE_TYPE.NOTE)) file.icon = FILE_ICON.NOTE;
        if (file?.type?.includes(FILE_TYPE.POWERPOINT)) file.icon = FILE_ICON.POWERPOINT;
        handleUpload(file);
    };
    return (
        <Upload customRequest={customRequest} showUploadList={false} accept={accept}>
            {children}
        </Upload>
    );
};

export default UploadFile;
