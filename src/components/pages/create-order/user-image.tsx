import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ImageGallery, Portal } from '@/components/common';
import { useCheckClickOutside } from '@/hooks';
import { Icons } from '@/images';
import { selector } from '@/redux';

export const UserImage = () => {
  const { currentUser } = useSelector(selector.user);
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
            currentUser?.avatar && currentUser.avatar !== ''
              ? currentUser.avatar
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
                    currentUser?.avatar && currentUser.avatar !== ''
                      ? currentUser.avatar
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
      <div className="absolute -right-4 top-0">
        <ImageGallery field="avatar" />
      </div>
    </div>
  );
};
