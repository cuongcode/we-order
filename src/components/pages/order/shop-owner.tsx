import {
  CheckIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ShopOwnerImage } from '@/components/common';
import { db } from '@/firebase';
import { selector } from '@/redux';

import { GiveHeartShopOwner } from './give-heart';

export const ShopOwner = () => {
  const { currentUser } = useSelector(selector.user);
  const { order } = useSelector(selector.order);
  return (
    <div className="relative flex h-40 w-36 flex-col items-center rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">SHOP OWNER</div>
      <ShopOwnerImage />
      <div className="mt-1">
        <ShopOwnerNameInput />
      </div>
      {currentUser && currentUser.uid === order.uid ? (
        <CloseOrderButton />
      ) : null}
      <div className="absolute bottom-2 left-2">
        <GiveHeartShopOwner />
      </div>
    </div>
  );
};

const ShopOwnerNameInput = () => {
  const { currentUser, shopOwner } = useSelector(selector.user);
  const [shopOwnerName, setShopOwnerName] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const _onEdit = () => {
    if (shopOwner?.nickname) {
      setShopOwnerName(shopOwner.nickname);
    }
    setIsEdit(true);
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setShopOwnerName(value);
  };

  const _updateUserNickname = async () => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(docRef, {
        nickname: shopOwnerName,
      });
      setIsEdit(false);
    }
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
          <button
            className="absolute -right-5 top-1"
            onClick={_updateUserNickname}
          >
            <CheckIcon className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <div
            className={clsx({
              'h-6 w-20 rounded-md border-2 border-white text-center': true,
              'text-xs': shopOwner?.nickname
                ? shopOwner.nickname.length > 9
                : false,
            })}
          >
            {shopOwner?.nickname}
          </div>
          {currentUser && currentUser?.uid === shopOwner?.uid ? (
            <button className="absolute -right-5 top-2" onClick={_onEdit}>
              <PencilSquareIcon className="h-3 w-3" />
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};

const CloseOrderButton = () => {
  const { order } = useSelector(selector.order);

  const _updateOrder = async () => {
    const docRef = doc(db, 'orders', order.id);
    await updateDoc(docRef, {
      isClosed: !order.isClosed,
    });
  };

  return (
    <button
      className="absolute top-40 flex w-36 items-center gap-2 rounded-lg bg-gray-200 p-1 px-2 hover:bg-gray-400"
      onClick={_updateOrder}
    >
      {order.isClosed ? (
        <>
          <LockClosedIcon className="h-4 w-4" />
          <div className="min-w-max">Order is closed</div>
        </>
      ) : (
        <>
          <LockOpenIcon className="h-4 w-4" />
          <div className="min-w-max">Order is open</div>
        </>
      )}
    </button>
  );
};
