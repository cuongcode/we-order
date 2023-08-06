import { CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { Icons } from '@/images';
import { selector } from '@/redux';
import type { Order } from '@/types';

export const ShopOwner = () => {
  const { redux_order } = useSelector(selector.order);
  return (
    <div className="flex h-40 w-36 flex-col items-center rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">SHOP OWNER</div>
      <div className="mt-2 w-20 rounded-full bg-gray-200 p-1">
        <img
          className="rounded-full bg-gray-200"
          src={Icons.user_icon.src}
          alt="user-icon"
        />
      </div>
      <div className="mt-1">
        <ShopOwnerNameInput order={redux_order} />
      </div>
    </div>
  );
};

const ShopOwnerNameInput = ({ order }: { order: Order }) => {
  const [isEdit, setIsEdit] = useState(false);
  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, 'orders', order.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="relative">
      {isEdit ? (
        <>
          <input
            className="h-6 w-20 rounded-md border-2 text-center hover:border-gray-600"
            type="text"
            value={order.shopOwnerName}
            name="shopOwnerName"
            onChange={(e) => _updateOrder(e.target.name, e.target.value)}
          />
          <button
            className="absolute -right-5 top-0"
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            <CheckIcon className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <div className="h-6 w-20 border-2 border-white text-center">
            {order.shopOwnerName}
          </div>
          <button
            className="absolute -right-5 top-1"
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
