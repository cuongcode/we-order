import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';

import { UserImage } from './user-image';

export const UserProfile = () => {
  return (
    <div className="flex h-40 w-1/3 flex-col items-center rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">PROFILE</div>
      <UserImage />
      <div className="mt-1">
        <UserNicknameInput />
      </div>
    </div>
  );
};

const UserNicknameInput = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [nickname, setNickname] = useState<string>('');
  const { currentUser } = useSelector(selector.user);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNickname(value);
  };

  const _onEdit = () => {
    setNickname(currentUser?.nickname || '');
    setIsEdit(true);
  };

  const _updateUserNickname = async () => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(docRef, {
        nickname,
      });
      setIsEdit(false);
    }
  };
  return (
    <div className="relative">
      {isEdit ? (
        <>
          <div className="flex h-6 w-20 items-center rounded-md border-2 text-center hover:border-gray-600">
            <input
              className="h-4 w-full rounded-md text-center"
              type="text"
              value={nickname}
              name="shopOwnerName"
              onChange={_onChange}
            />
          </div>
          <button
            className="absolute -right-5 top-2"
            onClick={_updateUserNickname}
          >
            <CheckIcon className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div
            className={clsx({
              'flex h-6 w-20 items-center justify-center rounded-md border-2 border-white text-center':
                true,
              'text-xs': Number(currentUser?.nickname?.length) > 9,
            })}
          >
            {currentUser?.nickname || '--'}
          </div>
          <button className="absolute -right-5 top-2" onClick={_onEdit}>
            <PencilSquareIcon className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
};
