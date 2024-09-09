import Footer from 'components/organisms/Footer';
import Header from 'components/organisms/Header';
import React from 'react';
import { Modal, Spin } from 'antd';
import { useAppSelector } from 'store/hooks';

interface LayoutProps {
    children?: React.ReactNode;
    title: string;
    isShowDate?: boolean;
    isLoading?: boolean;
    isShowNotification?: boolean;
    isShowRollback?: boolean;
    onClickRollback?: () => void;
    isShowLogout?: boolean;
    isHiddenPageHeader?: boolean;
    isHiddenHeader?: boolean;
    isShowDownload?: boolean;
    onClickDownload?: () => void;
    fixedHeader?: boolean;
    isHideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    isShowDate,
    isShowNotification,
    isShowRollback,
    isLoading,
    onClickRollback,
    isShowLogout,
    isHiddenPageHeader,
    isHiddenHeader,
    isShowDownload,
    onClickDownload,
    fixedHeader,
    isHideFooter,
}) => {
    const isPrinting = useAppSelector((state) => state.print.isPrinting);

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            <Spin
                spinning={isPrinting || isLoading}
                tip={isPrinting ? '印刷中...' : ''}
                size='large'
                wrapperClassName={`[&_.ant-spin-text]:text-green1A [&_.ant-spin-text]:!text-xl [&_.ant-spin-text]:!pt-5 [&_.ant-spin-text]:pl-3 [&_.ant-spin-text]:!font-bold ${
                    isLoading || isPrinting
                        ? 'bg-[#f4f4f4] h-[100vh] [&_.ant-spin-blur]:h-[100vh]'
                        : ''
                }`}
            >
                {!isHiddenHeader && (
                    <Header
                        title={title}
                        isShowDate={isShowDate}
                        isShowRollback={isShowRollback}
                        isShowNotification={isShowNotification}
                        onClickRollback={onClickRollback}
                        isShowLogout={isShowLogout}
                        isHiddenPageHeader={isHiddenPageHeader}
                        isShowDownload={isShowDownload}
                        onClickDownload={onClickDownload}
                        fixedHeader={fixedHeader}
                    />
                )}
                <div className='fixed bg-grayE9 min-h-screen top-0 bottom-0 right-0 left-0 z-[-1]' />
                <div className='w-full bg-grayE9 pb-[62px]'>{children}</div>
                {!isHideFooter && <Footer />}
            </Spin>
        </>
    );
};

export default Layout;
