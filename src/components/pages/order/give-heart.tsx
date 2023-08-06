import { HeartIcon as OutlineHeart } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeart } from '@heroicons/react/24/solid';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

export const GiveHeart = ({ row }: { row: DrinkTableRow }) => {
  const { order } = useSelector(selector.order);

  const _updateRow = async () => {
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await updateDoc(docRef, {
      heart: increment(1),
    });
  };

  return (
    <div className="flex items-center">
      <button onClick={_updateRow}>
        {row.heart === 0 ? (
          <OutlineHeart className="h-4 w-4 text-red-400" />
        ) : (
          <SolidHeart className="h-4 w-4 text-red-400" />
        )}
      </button>
      <div>{row.heart}</div>
    </div>
  );
};
