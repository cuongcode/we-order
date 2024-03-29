import { PlusIcon } from '@heroicons/react/24/outline';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@/components/base';
import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { selector } from '@/redux';
import type { Menu, NoSignInOrder } from '@/types';

export const MenusDropdown = () => {
  const { noSignInOrder } = useSelector(selector.order);

  const [isDropdown, setIsDropdown] = useState(false);

  const menuDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  return (
    <div className="relative">
      <Button onClick={() => setIsDropdown(true)} className="w-full">
        {noSignInOrder.selectedMenuName !== ''
          ? noSignInOrder.selectedMenuName
          : 'Input a menu'}
      </Button>
      {isDropdown ? (
        <div
          ref={menuDropdownRef}
          className="absolute top-12 flex w-full flex-col gap-2 rounded-lg bg-main-bg p-2"
        >
          <AddMenuForm />
          <Menus noSignInOrder={noSignInOrder} />
        </div>
      ) : null}
    </div>
  );
};

const Menus = ({ noSignInOrder }: { noSignInOrder: NoSignInOrder }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  useEffect(() => {
    _fetchMenus();
  }, []);

  const _fetchMenus = async () => {
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    onSnapshot(docRef, (_doc) => {
      const updatedMenus: Menu[] = _doc.data()?.menus;
      setMenus(updatedMenus);
    });
  };

  const _selectMenu = async (menuName: string, menuLink: string) => {
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      selectedMenuName: menuName,
      selectedMenuLink: menuLink,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {menus?.map((menu: Menu) => (
        <button
          className="rounded-lg bg-main-cbg px-3 py-1 hover:bg-main-bg"
          type="button"
          key={menu.id}
          onClick={() => _selectMenu(menu.name, menu.link)}
        >
          {menu.name}
        </button>
      ))}
    </div>
  );
};

const { v4: uuidv4 } = require('uuid');

const AddMenuForm = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const { noSignInOrder } = useSelector(selector.order);

  const _addMenu = async () => {
    const userRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(userRef, {
      menus: arrayUnion({ id: uuidv4(), name, link }),
    });
    setName('');
    setLink('');
  };

  return (
    <div className="flex items-center gap-2">
      <div>Name:</div>
      <input
        className="w-48 rounded-md bg-main-cbg px-1"
        type="text"
        placeholder="menu name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>Link:</div>
      <input
        className="w-48 rounded-md bg-main-cbg px-1"
        type="text"
        placeholder="paste link here"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        type="button"
        className="rounded-md bg-main-cbg p-1 hover:bg-gray-400"
        onClick={_addMenu}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
