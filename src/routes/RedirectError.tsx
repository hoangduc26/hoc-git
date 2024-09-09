import React from 'react';
import { Result } from 'antd';
import { CONSTANT_ROUTE } from 'utils/constants';
import { Link } from 'react-router-dom';

interface RedirectErrorProps {}

const RedirectError: React.FC<RedirectErrorProps> = () => (
    <Result
        status='404'
        title='404'
        subTitle='申し訳ありませんが、アクセスしたページは存在しません。'
        extra={
            <Link
                className='rounded bg-green15 h-[50px] w-1/2 mx-auto flex items-center justify-center'
                to={CONSTANT_ROUTE.MAIN_MENU}
            >
                <h2 className='text-[18px]  font-medium text-[white] mb-0'>家に帰ります</h2>
            </Link>
        }
    />
);

export default RedirectError;
