import { NoSymbolIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';

export const TableAddRowButton = () => {
  const { order } = useSelector(selector.order);

  const _addRow = async () => {
    if (order.isClosed) {
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
    await addDoc(collection(db, 'orders', order.id, 'rows'), newRow);
  };
  return (
    <button
      className={clsx({
        'w-full rounded-lg px-2 py-1 drop-shadow-sm hover:drop-shadow-md': true,
        'bg-white': !order.isClosed,
        'bg-gray-400': order.isClosed,
      })}
      type="button"
      onClick={_addRow}
    >
      {order.isClosed ? (
        <NoSymbolIcon className="m-auto h-5 w-5" />
      ) : (
        <PlusIcon className="m-auto h-5 w-5" />
      )}
    </button>
  );
};
