import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { Icons } from '@/images';
import { selector } from '@/redux';
import type { Order } from '@/types';

export const ShopOwner = () => {
  const { order } = useSelector(selector.order);
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
        <ShopOwnerNameInput order={order} />
      </div>
    </div>
  );
};

const ShopOwnerNameInput = ({ order }: { order: Order }) => {
  const { currentUser } = useSelector(selector.user);
  const [shopOwnerName, setShopOwnerName] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const _onEdit = () => {
    setShopOwnerName(order.shopOwnerName);
    setIsEdit(true);
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setShopOwnerName(value);
  };

  const _updateOrder = async () => {
    const docRef = doc(db, 'orders', order.id);
    await updateDoc(docRef, {
      shopOwnerName,
    });
    setIsEdit(false);
  };

  return (
    <div className="relative">
      {isEdit ? (
        <>
          <div className="h-6 w-20 rounded-md border-2 text-center hover:border-gray-600">
            <input
              className="h-5 w-full rounded-md text-center"
              type="text"
              value={shopOwnerName}
              name="shopOwnerName"
              onChange={_onChange}
            />
          </div>
          <button className="absolute -right-5 top-1" onClick={_updateOrder}>
            <CheckIcon className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <div
            className={clsx({
              'h-6 w-20 rounded-md border-2 border-white text-center': true,
              'text-xs': order.shopOwnerName.length > 9,
            })}
          >
            {order.shopOwnerName}
          </div>
          {currentUser && currentUser?.uid === order.uid ? (
            <button className="absolute -right-5 top-2" onClick={_onEdit}>
              <PencilSquareIcon className="h-3 w-3" />
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};
