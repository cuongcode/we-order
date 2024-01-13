import clsx from 'clsx';
import type { FC } from 'react';

interface RowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isTick: boolean;
  children?: React.ReactNode;
}

export const RowInput: FC<RowInputProps> = (props) => {
  const { className, isTick, children, ...rest } = props;
  return (
    <div
      className={clsx(
        'rounded-md p-1',
        isTick ? 'opacity-60' : 'bg-main-cbg',
        className,
      )}
    >
      <input
        className={clsx(
          'w-full bg-main-cbg font-semibold',
          isTick ? 'opacity-60' : '',
        )}
        {...rest}
      />
      {children}
    </div>
  );
};
