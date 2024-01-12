import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import React from 'react';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  placeholder?: string;
  errorText?: ReactNode | string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  prefix?: string;
}

export const BaseInput: FC<BaseInputProps> = (props) => {
  const {
    value,
    placeholder,
    errorText,
    className,
    onChange,
    disabled,
    prefix,
    ...rest
  } = props;
  return (
    <div className="relative w-full">
      <div
        className={clsx(
          'flex w-full items-center rounded-xl border border-slate-800 bg-slate-900 px-6 py-4',
          className,
        )}
      >
        {prefix ? (
          <div className="w-full text-sm font-light">{prefix}</div>
        ) : null}
        <input
          type="text"
          placeholder={placeholder}
          className="w-fit bg-slate-900 text-sm font-light placeholder:text-sm"
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
      </div>
      <div className="absolute">{errorText}</div>
    </div>
  );
};
