import clsx from 'clsx';
import type { FC } from 'react';
import { useSelector } from 'react-redux';

import { selector } from '@/redux';

interface RowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isTick: boolean;
  children?: React.ReactNode;
}

export const RowInput: FC<RowInputProps> = (props) => {
  const { noSignInOrder } = useSelector(selector.order);

  const { className, isTick, children, ...rest } = props;
  return (
    <div
      className={clsx(
        'border-b border-main-bbg',
        isTick ? 'opacity-60' : '',
        className,
      )}
    >
      <input
        className={clsx(
          'w-full font-semibold',
          noSignInOrder.isClosed ? 'bg-main-bbg' : 'bg-main-bg',
          isTick ? 'opacity-60' : '',
        )}
        {...rest}
      />
      {children}
    </div>
  );
};
