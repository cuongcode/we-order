import { CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { useState } from 'react';

import { db, storage } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import type { Order } from '@/types';

export const DeleteOrderButton = ({ order }: { order: Order }) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const deleteOrderButtonRef = useCheckClickOutside(() => setIsDropdown(false));

  const _deleteOrder = async () => {
    await _deleteWantedFiles();
    await _deleteRows();
    await _deleteWanteds();
    await deleteDoc(doc(db, 'orders', order.id));
  };

  const _deleteRows = async () => {
    const q = query(collection(db, 'orders', order.id, 'rows'));
    const rowDocs = await getDocs(q);
    if (!rowDocs.empty) {
      rowDocs.forEach(async (row) => {
        await deleteDoc(doc(db, 'orders', order.id, 'rows', row.id));
      });
    }
  };
  const _deleteWanteds = async () => {
    const q = query(collection(db, 'orders', order.id, 'wanteds'));
    const wantedsDocs = await getDocs(q);
    if (!wantedsDocs.empty) {
      wantedsDocs.forEach(async (wanted) => {
        await deleteDoc(doc(db, 'orders', order.id, 'wanteds', wanted.id));
      });
    }
  };

  const _deleteWantedFiles = async () => {
    const storageRef = ref(storage, `wanted/${order?.id}`);
    const files = await listAll(storageRef);
    files.items.forEach(async (itemRef) => deleteObject(itemRef));
  };

  return (
    <div ref={deleteOrderButtonRef} className="relative">
      <button
        type="button"
        onClick={() => setIsDropdown(true)}
        className="rounded-md bg-gray-300 p-1 hover:bg-gray-500"
      >
        <TrashIcon className="h-3 w-3" />
      </button>
      {isDropdown ? (
        <div className="absolute -left-7 top-6 z-10 flex gap-1 rounded-md bg-white p-1">
          <button className="rounded-md bg-gray-200 p-1" onClick={_deleteOrder}>
            <CheckIcon className="h-3 w-3" />
          </button>
          <button
            className="rounded-md bg-gray-200 p-1"
            onClick={() => setIsDropdown(false)}
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
