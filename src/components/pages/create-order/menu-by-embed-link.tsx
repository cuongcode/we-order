import { PlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { Menu } from '@/types';

const { v4: uuidv4 } = require('uuid');

export const MenusByEmbedLink = ({
  setMenuImageList,
  selectedMenu,
  setSelectedMenu,
}: {
  setMenuImageList: (updatedMenuImageList: string[]) => void;
  selectedMenu: Menu;
  setSelectedMenu: (menu: Menu) => void;
}) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-gray-200 p-2">
      <div>Menus by embed link</div>
      <AddMenuForm />
      <Menus
        setMenuImageList={setMenuImageList}
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />
    </div>
  );
};

const AddMenuForm = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const { currentUser } = useSelector(selector.user);

  const _addUserMenu = async () => {
    if (name !== '' && link !== '' && currentUser) {
      const userRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(userRef, {
        menus: arrayUnion({ id: uuidv4(), name, link }),
      });
      setName('');
      setLink('');
    }
  };

  return (
    <div className="flex items-center gap-2">
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
      <div className="flex items-center gap-1">
        <div>Link:</div>
        <input
          className="w-full rounded-md border-2 px-1 hover:border-gray-600"
          type="text"
          placeholder="paste a link here"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          type="button"
          className="rounded-md bg-white p-1 hover:bg-gray-400"
          onClick={_addUserMenu}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const Menus = ({
  setMenuImageList,
  selectedMenu,
  setSelectedMenu,
}: {
  setMenuImageList: (updatedMenuImageList: string[]) => void;
  selectedMenu: Menu;
  setSelectedMenu: (menu: Menu) => void;
}) => {
  const [menus, setMenus] = useState<Menu[]>([]);

  const { currentUser } = useSelector(selector.user);

  useEffect(() => {
    _fetchMenus();
  }, []);

  const _fetchMenus = async () => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      onSnapshot(docRef, (_doc) => {
        const updatedMenus: Menu[] = _doc.data()?.menus;
        setMenus(updatedMenus);
      });
    }
  };

  const _selectMenu = async (menu: Menu) => {
    setSelectedMenu({ id: menu.id, name: menu.name, link: menu.link });
    setMenuImageList([]);
  };

  const _deleteMenu = async (menu: Menu) => {
    if (menu.id === selectedMenu.id) {
      setSelectedMenu({ id: '', name: '', link: '' });
    }
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        menus: arrayRemove({ id: menu.id, name: menu.name, link: menu.link }),
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {menus?.length === 0 || menus === undefined
        ? 'You have no menu. Add one!'
        : menus.map((menu: Menu) => (
            <div key={menu.id} className="relative">
              <button
                className="rounded-lg bg-white px-3 py-1 hover:bg-gray-400"
                type="button"
                onClick={() => _selectMenu(menu)}
              >
                {menu.name}
              </button>
              <button
                className="absolute -left-1 -top-1"
                onClick={() => _deleteMenu(menu)}
              >
                <XCircleIcon className="h-3 w-3 rounded-full bg-red-200" />
              </button>
            </div>
          ))}
    </div>
  );
};
