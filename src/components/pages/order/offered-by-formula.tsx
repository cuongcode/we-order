import { HeartIcon as SolidHeart } from '@heroicons/react/24/solid';

import type { DrinkTableRow } from '@/types';

export const OfferedByFormula = ({ row }: { row: DrinkTableRow }) => {
  return (
    <div className="flex w-40 flex-col">
      <div className="flex gap-1">
        <div>You are offered by</div>
        <div className="font-semibold">{row.offerBy.toLocaleUpperCase()}</div>
      </div>
      <div className="flex gap-1">
        <div>Give a big</div>
        <SolidHeart className="h-5 w-5 text-red-400" />
        <div>to</div>
        <div className="font-semibold">{row.offerBy.toLocaleUpperCase()}</div>
      </div>
    </div>
  );
};
