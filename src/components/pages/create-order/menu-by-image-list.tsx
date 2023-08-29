import { XCircleIcon } from '@heroicons/react/24/outline';
import { arrayRemove, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, listAll, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { db, storage } from '@/firebase';
import { selector } from '@/redux';
import type { Menu } from '@/types';

import { MenuImageGallery } from './menu-image-gallery';

export const MenusByImageList = ({
  selectedMenu,
  setMenuImageList,
  setSelectedMenu,
}: {
  selectedMenu: Menu;
  setMenuImageList: (updatedMenuImageList: any) => void;
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
        const updatedMenus: Menu[] = _doc.data()?.menusByImage;
        setMenus(updatedMenus);
      });
    }
  };

  const _selectMenu = async (menu: Menu) => {
    setSelectedMenu({ id: menu.id, name: menu.name, link: menu.link });
    await _fetchMenuImages(menu.name.replace(/\s+/g, ''));
  };

  const _deleteMenu = async (menu: Menu) => {
    if (menu.id === selectedMenu.id) {
      setSelectedMenu({ id: '', name: '', link: '' });
    }
    if (currentUser) {
      await _deleteImageFiles(menu);
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        menusByImage: arrayRemove({
          id: menu.id,
          name: menu.name,
          link: menu.link,
        }),
      });
    }
  };

  const _deleteImageFiles = async (menu: Menu) => {
    const storageRef = ref(
      storage,
      `users/${currentUser?.uid}/menus/${menu.name.replace(/\s+/g, '')}`,
    );
    const files = await listAll(storageRef);
    files.items.forEach(async (itemRef) => deleteObject(itemRef));
  };

  const _fetchMenuImages = async (menuName: string) => {
    setMenuImageList([]);
    const storageRef = ref(
      storage,
      `users/${currentUser?.uid}/menus/${menuName}`,
    );
    const files = await listAll(storageRef);
    files.items.forEach(async (itemRef) => {
      const url = await getDownloadURL(ref(storage, itemRef.fullPath));
      setMenuImageList((prev: any) => [...prev, url]);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {menus?.length === 0 || menus === undefined
        ? 'You have no menu. Add one!'
        : menus.map((menu: Menu) => (
            <div key={menu.id} className="relative">
              <div className="flex items-center gap-1 rounded-lg bg-white px-3 py-1 hover:bg-gray-400">
                <button className=" " onClick={() => _selectMenu(menu)}>
                  <div>{menu.name}</div>
                </button>
                <MenuImageGallery name={menu.name.replace(/\s+/g, '')} />
              </div>
              <button
                className="absolute -left-1 -top-1"
                onClick={() => {
                  _deleteMenu(menu);
                }}
              >
                <XCircleIcon className="h-3 w-3 rounded-full bg-red-200" />
              </button>
            </div>
          ))}
    </div>
  );
};
