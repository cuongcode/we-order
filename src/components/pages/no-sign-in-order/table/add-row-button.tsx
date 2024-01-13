import { NoSymbolIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';

export const TableAddRowButton = () => {
  const { noSignInOrder } = useSelector(selector.order);

  const _addRow = async () => {
    if (noSignInOrder.isClosed) {
      return;
    }
    const newRow = {
      timestamp: serverTimestamp(),
      name: '',
      drink: '',
      size: 'S',
      price: 0,
      sugar: '100%',
      ice: '100%',
      topping: '',
      heart: 0,
      offerBy: '--',
      isTick: false,
    };
    await addDoc(
      collection(db, 'no_sign_in_orders', noSignInOrder.id, 'rows'),
      newRow,
    );
  };
  return (
    <button
      className={clsx(
        'w-full rounded-lg px-2 py-1 drop-shadow-sm hover:drop-shadow-md',
        noSignInOrder.isClosed ? 'bg-gray-400' : 'bg-slate-900',
      )}
      type="button"
      onClick={_addRow}
    >
      {noSignInOrder.isClosed ? (
        <NoSymbolIcon className="m-auto h-5 w-5" />
      ) : (
        <PlusIcon className="m-auto h-5 w-5" />
      )}
    </button>
  );
};
