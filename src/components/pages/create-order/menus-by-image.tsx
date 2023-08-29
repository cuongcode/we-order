import { PlusIcon } from '@heroicons/react/24/outline';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { Menu } from '@/types';

import { MenusByImageList } from './menu-by-image-list';

const { v4: uuidv4 } = require('uuid');

export const MenusByImage = ({
  selectedMenu,
  setMenuImageList,
  setSelectedMenu,
}: {
  selectedMenu: Menu;
  setMenuImageList: (updatedMenuImageList: string[]) => void;
  setSelectedMenu: (menu: Menu) => void;
}) => {
  const { currentUser } = useSelector(selector.user);
  const [name, setName] = useState('');

  const _addMenuByImage = async () => {
    if (name !== '' && currentUser) {
      const userRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(userRef, {
        menusByImage: arrayUnion({ id: uuidv4(), name, link: '' }),
      });
      setName('');
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-gray-200 p-2">
      <div>Menus by uploaded images</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div>Name:</div>
          <input
            className="w-32 rounded-md border-2 px-1 hover:border-gray-600"
            type="text"
            placeholder="menu name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="text-xs text-gray-600">
          Create menu then select images
        </div>
        <button
          type="button"
          className="rounded-md bg-white p-1 hover:bg-gray-400"
          onClick={_addMenuByImage}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <MenusByImageList
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        setMenuImageList={setMenuImageList}
      />
    </div>
  );
};
