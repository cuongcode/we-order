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
      className={clsx('disabled:cursor-not-allowed', className)}
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
  className?: string;
}
export const Button: FC<ButtonProps> = (props) => {
  const { preset = 'primary', className, ...rest } = props;

  return (
    <SimpleButton
      className={clsx(presetBtClassName[preset], className)}
      {...rest}
    />
  );
};

const presetBtClassName = {
  base: '',
  primary: 'font-bold text-2xl text-white bg-violet-500 rounded-2xl py-2 px-6',
};
