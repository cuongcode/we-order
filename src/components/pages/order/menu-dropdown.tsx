import { PlusIcon } from '@heroicons/react/24/outline';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { selector } from '@/redux';
import type { Menu, Order } from '@/types';

export const MenusDropdown = () => {
  const { order } = useSelector(selector.order);
  const { currentUser } = useSelector(selector.user);

  const [isDropdown, setIsDropdown] = useState(false);

  const menuDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  return (
    <div className="relative">
      <button
        type="button"
        className="w-fit rounded-lg bg-gray-200 px-3 py-2 drop-shadow-md"
        disabled={!currentUser || currentUser.uid !== order.uid}
        onClick={() => setIsDropdown(true)}
      >
        {order.selectedMenuName}
      </button>
      {isDropdown ? (
        <div
          ref={menuDropdownRef}
          className="absolute top-12 flex w-full flex-col gap-2 rounded-lg bg-gray-200 p-2"
        >
          <AddMenuForm />
          <Menus order={order} />
        </div>
      ) : null}
    </div>
  );
};

const Menus = ({ order }: { order: Order }) => {
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

  const _selectMenu = async (menuName: string, menuLink: string) => {
    const docRef = doc(db, 'orders', order.id);
    await updateDoc(docRef, {
      selectedMenuName: menuName,
      selectedMenuLink: menuLink,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {menus?.map((menu: Menu) => (
        <button
          className="rounded-lg bg-white px-3 py-1 hover:bg-gray-400"
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

const AddMenuForm = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const { currentUser } = useSelector(selector.user);

  const _addMenu = async () => {
    if (name !== '' && link !== '' && currentUser) {
      const userRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(userRef, {
        menus: arrayUnion({ name, link }),
      });
      setName('');
      setLink('');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div>Name:</div>
      <input
        className="w-48 rounded-md border-2 px-1 hover:border-gray-600"
        type="text"
        placeholder="menu name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>Link:</div>
      <input
        className="w-48 rounded-md border-2 px-1 hover:border-gray-600"
        type="text"
        placeholder="paste link here"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        type="button"
        className="rounded-md bg-white p-1 hover:bg-gray-400"
        onClick={_addMenu}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
