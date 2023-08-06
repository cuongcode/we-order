import { PlusIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';

export const TableAddRowButton = () => {
  const { order } = useSelector(selector.order);

  const _addRow = async () => {
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
      className="w-full rounded-lg bg-white px-2 py-1 drop-shadow-sm hover:drop-shadow-md "
      type="button"
      onClick={_addRow}
    >
      <PlusIcon className="m-auto h-5 w-5" />
    </button>
  );
};
