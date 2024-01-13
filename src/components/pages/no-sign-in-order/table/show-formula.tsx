import type { ReactNode } from 'react';
import { useState } from 'react';

export const ShowFormula = ({
  transfer,
  children,
}: {
  transfer: number | undefined;
  children: ReactNode;
}) => {
  const [isHover, setIsHover] = useState(true);

  return (
    <div
      className="relative cursor-pointer"
      onMouseOver={() => setIsHover(true)}
      onFocus={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onBlur={() => setIsHover(false)}
    >
      <div className="w-16 rounded-sm bg-main-cbg p-1 drop-shadow-md">
        <div>{transfer?.toLocaleString('en-US')}</div>
      </div>
      {isHover ? children : null}
    </div>
  );
};
