import { StopIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

export const FeatureLine = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="flex items-center gap-2">
      <StopIcon className="h-4 w-4" />
      {children}
    </div>
  );
};
