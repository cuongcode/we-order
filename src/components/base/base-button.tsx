import clsx from 'clsx';
import type { FC } from 'react';

interface BaseButtonProps {
  children?: React.ReactNode;
  className?: string;
  text?: string;
  onClick: () => void;
}
export const BaseButton: FC<BaseButtonProps> = ({
  children,
  className,
  text,
  onClick,
}) => {
  return (
    <button
      className={clsx(
        'rounded-lg bg-gray-200 p-4 text-lg hover:bg-gray-400',
        className,
      )}
      onClick={onClick}
    >
      {children || text}
    </button>
  );
};
