import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

export const TransferTickBox = ({ row }: { row: DrinkTableRow }) => {
  const { noSignInOrder } = useSelector(selector.order);

  const _onTick = async () => {
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await updateDoc(docRef, {
      isTick: !row.isTick,
    });
  };

  return (
    <button
      className={clsx(
        'h-5 w-5 border',
        row.isTick ? 'border-main-purple bg-main-purple' : 'bg-main-bg',
      )}
      onClick={_onTick}
    >
      {row.isTick ? (
        <CheckIcon className="m-auto h-4 w-4 text-main-cbg" />
      ) : null}
    </button>
  );
};
