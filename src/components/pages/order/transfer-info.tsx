import { CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

import { db } from '@/firebase';
import type { Order } from '@/types';

export const TranferInfo = ({ order }: { order: Order }) => {
  return (
    <div className="flex h-40 w-56 flex-col items-center gap-2 rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">TRANSFER INFO</div>
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex h-6 w-full items-center">
          <div className="w-11">Momo</div>
          <div className="mr-2">:</div>
          <div className="grow">
            <ShopOwnerMomoInput order={order} />
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-11">Bank</div>
          <div>:</div>
        </div>
      </div>
    </div>
  );
};

const ShopOwnerMomoInput = ({ order }: { order: Order }) => {
  const [isEdit, setIsEdit] = useState(false);

  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, 'orders', order.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="flex items-center justify-between">
      {isEdit ? (
        <>
          <input
            className="w-28 rounded-md border-2 px-1 hover:border-gray-600"
            type="text"
            value={order.shopOwnerMomo}
            name="shopOwnerMomo"
            onChange={(e) => _updateOrder(e.target.name, e.target.value)}
          />
          <button
            className=""
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            <CheckIcon className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <div className="w-28 rounded-md border-2 border-white px-1">
            {order.shopOwnerMomo}
          </div>
          <button
            className=""
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            <PencilIcon className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
};
