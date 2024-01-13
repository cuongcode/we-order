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
        isTick ? 'bg-gray-400' : 'bg-slate-900',
        className,
      )}
    >
      <input
        className={clsx(
          'w-full bg-slate-900 font-semibold',
          isTick ? 'bg-gray-400' : '',
        )}
        {...rest}
      />
      {children}
    </div>
  );
};
