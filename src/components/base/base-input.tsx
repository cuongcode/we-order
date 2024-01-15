import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import React from 'react';

import { Text } from '@/components/base/text';

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
          'flex w-full items-center gap-2 overflow-hidden rounded-xl border border-main-bbg bg-main-cbg',
          className,
        )}
      >
        {prefix ? (
          <div className="flex flex-1 items-center justify-center self-stretch bg-main-bbg px-4 text-sm font-light">
            {prefix}
          </div>
        ) : null}
        <input
          type="text"
          placeholder={placeholder}
          className="w-fit bg-main-cbg p-4 text-sm font-light placeholder:text-sm"
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
      </div>
      <Text className="absolute" preset="error">
        {errorText}
      </Text>
    </div>
  );
};
