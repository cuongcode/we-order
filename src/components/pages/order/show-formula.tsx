import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { useState } from 'react';

export const ShowFormula = ({ children }: { children: ReactNode }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseOver={() => setIsHover(true)}
      onFocus={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onBlur={() => setIsHover(false)}
    >
      <QuestionMarkCircleIcon className="h-5 w-5" />
      {isHover ? children : null}
    </div>
  );
};
