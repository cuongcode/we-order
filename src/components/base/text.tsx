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
  h1: 'bsx-text-[44px]',
  h1p: 'bsx-text-[44px] bsx-font-medium',
  h2: 'bsx-text-4xl',
  h2p: 'bsx-text-4xl bsx-font-semibold',
  h3: 'bsx-text-2xl',
  h3p: 'bsx-text-2xl bsx-font-medium',
  h4: 'bsx-text-lg',
  h4p: 'bsx-text-lg bsx-font-medium',

  p1: 'bsx-text-base',
  p1p: 'bsx-text-base bsx-font-medium',
  p2: 'bsx-text-sm',
  p2p: 'bsx-text-sm bsx-font-medium',
  p3: 'bsx-text-xs',
  p3p: 'bsx-text-xs bsx-font-medium',
  p4: 'bsx-text-xxs',
  p4p: 'bsx-text-xxs bsx-font-medium',

  error: 'bsx-text-red-500 bsx-text-[11px]',
  greenSm: 'bsx-text-green-500 bsx-text-sm',
  redSm: 'bsx-text-red-500 bsx-text-sm',

  ls: 'bsx-text-primary-500 bsx-text-[10px] bsx-font-medium',
  lm: 'bsx-text-primary-500 bsx-text-sm bsx-font-medium',
  ll: 'bsx-text-primary-500 bsx-text-base bsx-font-medium',
};
