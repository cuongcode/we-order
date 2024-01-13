import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface TextProps {
  text?: string;
  children?: ReactNode;
  className?: string;
  preset?: TextPresets;
}

export const Text: FC<TextProps> = (props) => {
  const { text, className, preset = 'p1', children } = props;
  return (
    <div className={clsx(presetClassName[preset], className)}>
      {text || children}
    </div>
  );
};

export type TextPresets = keyof typeof presetClassName;
const presetClassName = {
  h1: 'text-[34px]',
  h1b: 'text-[34px] font-semibold',
  h1p: 'text-[34px] font-medium',
  h2: 'text-[24px]',
  h2p: 'text-[24px] font-semibold',
  h3: 'text-2xl',
  h3b: 'text-2xl font-semibold',
  h3p: 'text-2xl font-medium',
  h4: 'text-lg',
  h4b: 'text-lg font-semibold',
  h4p: 'text-lg font-medium',

  p1: 'text-base',
  p1p: 'text-base font-medium',
  p2: 'text-sm',
  p2p: 'text-sm font-medium',
  p3: 'text-xs',
  p3p: 'text-xs font-medium',
  p4: 'text-xxs',
  p4p: 'text-xxs font-medium',

  error: 'text-red-500 text-[11px]',
  greenSm: 'text-green-500 text-sm',
  redSm: 'text-red-500 text-sm',

  ls: 'text-primary-500 text-[10px] font-medium',
  lm: 'text-primary-500 text-sm font-medium',
  ll: 'text-primary-500 text-base font-medium',
};
