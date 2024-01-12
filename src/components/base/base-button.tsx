import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface SimpleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
  onClick?: () => void;
  fetching?: boolean;
  children?: ReactNode;
  disabled?: boolean;
}
export const SimpleButton: FC<SimpleButtonProps> = (props) => {
  const { text, className, onClick, fetching, children, disabled, ...rest } =
    props;

  return (
    <button
      className={clsx(
        'flex items-center justify-center gap-1 leading-none disabled:cursor-not-allowed',
        className,
      )}
      onClick={onClick}
      disabled={disabled || fetching || !onClick}
      {...rest}
    >
      {text}
      {children}
    </button>
  );
};

interface ButtonProps extends SimpleButtonProps {
  preset?: keyof typeof presetBtClassName;
  large?: boolean;
  small?: boolean;
  className?: string;
}
export const Button: FC<ButtonProps> = (props) => {
  const { preset = 'primary', className, ...rest } = props;

  return (
    <SimpleButton
      className={clsx(
        presetBtClassName[preset],
        presetTextClassName[preset],
        className,
      )}
      {...rest}
    />
  );
};

const presetBtClassName = {
  base: '',
  primary:
    'bg-primary-500 enabled:hover:bg-primary-400 disabled:bg-primary-300',
};

const presetTextClassName = {
  base: '',
  primary: 'font-medium text-fixed-white disabled:text-primary-400',
  cancel: 'text-xs text-red-500 disabled:text-neutral-400',
};
