import { CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query as firestoreQuery,
  updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@/components/base';
import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

export const DeleteRowButton = ({ row }: { row: DrinkTableRow }) => {
  const { noSignInOrder } = useSelector(selector.order);

  const [isDropdown, setIsDropdown] = useState(false);

  const deleteRowButtonRef = useCheckClickOutside(() => setIsDropdown(false));

  const _deleteRow = async () => {
    const q = firestoreQuery(
      collection(db, 'no_sign_in_orders', noSignInOrder.id, 'rows'),
    );
    const queryrRows = await getDocs(q);
    queryrRows.forEach(async (_row) => {
      if (_row.data().offerBy === row.name) {
        await updateDoc(
          doc(db, 'no_sign_in_orders', noSignInOrder.id, 'rows', _row.id),
          {
            offerBy: '--',
          },
        );
      }
    });
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await deleteDoc(docRef);
  };

  return (
    <div ref={deleteRowButtonRef} className="relative">
      <button type="button" onClick={() => setIsDropdown(true)} className="p-1">
        <TrashIcon className="h-3 w-3" />
      </button>
      {isDropdown ? (
        <div className="absolute -left-7 top-6 z-10 flex gap-1 bg-main-bbg p-1">
          <Button
            preset="base"
            className="bg-green-700 p-1"
            onClick={_deleteRow}
          >
            <CheckIcon className="h-3 w-3" />
          </Button>
          <Button
            preset="base"
            className="bg-main-purple p-1"
            onClick={() => setIsDropdown(false)}
          >
            <XMarkIcon className="h-3 w-3" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};
