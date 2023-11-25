import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Portal } from '@/components/common';
import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { Icons } from '@/images';
import { selector } from '@/redux';

import { CheckPasswordPortal } from './check-password-portal';

export const ShopOwnerProfile = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">SHOP OWNER</div>
      <ShopOwnerImage />
      <div className="mt-1">
        <ShopOwnerNameInput />
      </div>
      <CloseOrderButton />
    </div>
  );
};

const ShopOwnerImage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useCheckClickOutside(() => {
    setIsOpen(false);
  });

  const _onOpen = async () => {
    setIsOpen(true);
  };

  return (
    <div className="relative rounded-full bg-gray-500 p-1">
      <button
        onClick={_onOpen}
        className="flex h-20 w-20 rounded-full bg-gray-200"
      >
        <img
          className="h-full w-full rounded-full object-cover"
          src={Icons.user_icon.src}
          alt="user-icon"
        />
        {isOpen ? (
          <Portal>
            <div className="fixed inset-0 z-50 h-full w-full bg-gray-800/50">
              <div
                ref={modalRef}
                className="m-auto mt-16 flex h-fit w-fit rounded-xl bg-white p-5"
              >
                <img
                  src={Icons.user_icon.src}
                  alt=""
                  className="h-72 w-72 rounded-2xl object-cover"
                />
              </div>
            </div>
          </Portal>
        ) : null}
      </button>
    </div>
  );
};

const ShopOwnerNameInput = () => {
  const { noSignInOrder } = useSelector(selector.order);

  return (
    <div className="relative">
      <div className="h-6 w-20 rounded-md border-2 border-white text-center">
        {noSignInOrder?.nickname}
      </div>
    </div>
  );
};

const CloseOrderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { noSignInOrder } = useSelector(selector.order);

  const _onCheckPassword = () => {
    setIsOpen(true);
  };

  const _updateOrder = async () => {
    setIsOpen(false);
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      isClosed: !noSignInOrder.isClosed,
    });
  };

  return (
    <>
      <button
        className="absolute top-40 flex w-36 items-center gap-2 rounded-lg bg-gray-200 p-1 px-2 hover:bg-gray-400"
        onClick={_onCheckPassword}
      >
        {noSignInOrder.isClosed ? (
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
      {isOpen ? (
        <CheckPasswordPortal
          onClose={() => setIsOpen(false)}
          onEdit={_updateOrder}
        />
      ) : null}
    </>
  );
};
