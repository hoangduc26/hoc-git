import React from 'react';
import './index.scss';
import classNames from 'classnames';

export interface IContainerProps {
    children: React.ReactNode;
    classnames?: string;
    variant?: 'large';
}

const Container = ({ children, classnames, variant }: IContainerProps) => (
    <div className={classNames('containerEdit', classnames, variant)}>{children}</div>
);

export default Container;
