import { useState, useEffect } from "react";

import { useCheckClickOutside } from "@/hooks";

import { PlusIcon } from "@heroicons/react/24/outline";

import { Order, Menu } from "@/types";

import {
  doc,
  onSnapshot,
  collection,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export const MenusDropdown = ({ order }: { order: Order }) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const menuDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  return (
    <div className="relative">
      <button
        type="button"
        className="w-fit bg-gray-200 px-3 py-2 rounded-lg drop-shadow-md"
        onClick={() => setIsDropdown(true)}
      >
        {order.selectedMenuName}
      </button>
      {isDropdown ? (
        <div
          ref={menuDropdownRef}
          className="absolute top-12 flex flex-col gap-2 bg-gray-200 rounded-lg p-2 w-full"
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

  useEffect(() => {
    _fetchMenus();
  }, []);

  const _fetchMenus = async () => {
    onSnapshot(collection(db, "menus"), (snapshot) => {
      const updatedMenus = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setMenus(updatedMenus);
    });
  };

  const _selectMenu = async (menuName: string, menuLink: string) => {
    const docRef = doc(db, "orders", order.id);
    await updateDoc(docRef, {
      selectedMenuName: menuName,
      selectedMenuLink: menuLink,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {menus.map((menu: Menu) => (
        <button
          className="px-3 py-1 rounded-lg bg-white hover:bg-gray-400"
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
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const _addMenu = async () => {
    if (name !== "" && link !== "") {
      await addDoc(collection(db, "menus"), { name: name, link: link });
      setName("");
      setLink("");
    }
    return;
  };

  return (
    <div className="flex gap-2 items-center">
      <div>Name:</div>
      <input
        className="px-1 rounded-md border-2 hover:border-gray-600 w-48"
        type="text"
        placeholder="menu name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>Link:</div>
      <input
        className="px-1 rounded-md border-2 hover:border-gray-600 w-48"
        type="text"
        placeholder="paste link here"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        type="button"
        className="p-1 bg-white rounded-md hover:bg-gray-400"
        onClick={_addMenu}
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
