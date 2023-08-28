import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ImageGallery, Portal } from '@/components/common';
import { useCheckClickOutside } from '@/hooks';
import { Icons } from '@/images';
import { selector } from '@/redux';

export const ShopOwnerImage = () => {
  const { currentUser, shopOwner } = useSelector(selector.user);
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
          src={
            shopOwner?.avatar && shopOwner.avatar !== ''
              ? shopOwner.avatar
              : Icons.user_icon.src
          }
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
                  src={
                    shopOwner?.avatar && shopOwner.avatar !== ''
                      ? shopOwner.avatar
                      : Icons.user_icon.src
                  }
                  alt=""
                  className="h-72 w-72 rounded-2xl object-cover"
                />
              </div>
            </div>
          </Portal>
        ) : null}
      </button>
      {currentUser && currentUser.uid === shopOwner?.uid ? (
        <div className="absolute -bottom-2 -right-4">
          <ImageGallery field="avatar" />
        </div>
      ) : null}
    </div>
  );
};
