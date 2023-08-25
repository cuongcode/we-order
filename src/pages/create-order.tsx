import {
  CheckIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, listAll, ref } from 'firebase/storage';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { UserProfile, UserTranferInfo } from '@/components/pages/create-order';
import { MenuImageGallery } from '@/components/pages/create-order/menu-image-gallery';
import { auth, db, storage } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { selector, UserActions } from '@/redux';
import { Main } from '@/templates/Main';
import type { Menu, Order, User } from '@/types';

const { v4: uuidv4 } = require('uuid');

const CreateOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu>({
    id: '',
    name: '',
    link: '',
  });
  const [menuImageList, setMenuImageList] = useState<string[]>([]);

  const dispatch = useDispatch();
  const { currentUser } = useSelector(selector.user);

  useEffect(() => {
    _fetchOrders();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        _fetchUser(user.uid);
      }
    });
  }, []);

  const _fetchUser = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    onSnapshot(docRef, (_doc) => {
      const updatedCurrentUser: User = {
        uid: _doc.data()?.uid,
        nickname: _doc.data()?.nickname,
        momo: _doc.data()?.momo,
        bank1Name: _doc.data()?.bank1Name,
        bank1Number: _doc.data()?.bank1Number,
        bank2Name: _doc.data()?.bank2Name,
        bank2Number: _doc.data()?.bank2Number,
        menus: _doc.data()?.menus,
        avatar: _doc.data()?.avatar,
        momoQR: _doc.data()?.momoQR,
        bankQR: _doc.data()?.bankQR,
      };
      dispatch(UserActions.setCurrentUser(updatedCurrentUser));
    });
  };

  const _fetchOrders = async () => {
    if (currentUser) {
      const q = query(
        collection(db, 'orders'),
        where('uid', '==', currentUser.uid),
        orderBy('timestamp', 'desc'),
      );
      onSnapshot(q, (snapshot) => {
        const updatedOrders = snapshot.docs.map((_doc: any) => {
          return { ..._doc.data(), id: _doc.id };
        });
        setOrders(updatedOrders);
      });
    }
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="mt-12 flex h-fit w-full flex-col lg:flex lg:flex-row lg:gap-5">
        <div className="m-auto max-w-5xl lg:m-0 lg:w-1/2">
          <div className="mb-12 w-full">
            <img
              className="m-auto w-1/2"
              src={LogoImages.title_logo.src}
              alt="title-logo"
            />
          </div>
          <div className="flex gap-5">
            <div className="flex w-1/2 flex-col gap-5">
              <div className="flex gap-5">
                <UserProfile />
                <UserTranferInfo />
              </div>
              <MenusByEmbedLink
                setMenuImageList={setMenuImageList}
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
              />
              <NewOrderButton orders={orders} selectedMenu={selectedMenu} />
            </div>
            <div className="flex w-1/2 flex-col gap-4 rounded-3xl border-2 bg-white p-3 drop-shadow-md">
              <OrderList orders={orders} />
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 lg:mt-0 lg:w-1/2">
          <div className="text-center font-bold">MENU PREVIEW</div>
          {selectedMenu.link !== '' ? (
            <iframe
              title="menu-frame"
              src={selectedMenu.link}
              className="h-screen w-full rounded-xl border-2 p-5"
            />
          ) : (
            <div className="no-scrollbar flex h-screen flex-col gap-2 overflow-x-auto">
              {menuImageList.map((url: string) => {
                return (
                  <img
                    key={url}
                    src={url}
                    alt="user-icon"
                    className="w-full rounded-xl"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Main>
  );
};

export default CreateOrderPage;

const NewOrderButton = ({
  orders,
  selectedMenu,
}: {
  orders: Order[];
  selectedMenu: Menu;
}) => {
  const [error, setError] = useState<string>('');
  const { currentUser } = useSelector(selector.user);

  const _createOrder = async () => {
    if (currentUser) {
      if (selectedMenu.name === '') {
        setError('Please select a menu');
        return;
      }
      if (orders.length === 10) {
        setError('You have got your maximum number of orders');
        return;
      }
      const newOrder = {
        timestamp: serverTimestamp(),
        shipFee: 0,
        discount: 0,
        selectedMenuName: selectedMenu.name,
        selectedMenuLink: selectedMenu.link,
        uid: currentUser.uid,
        isClosed: false,
        heart: 0,
      };
      await addDoc(collection(db, 'orders'), newOrder);
      setError('');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={_createOrder}
        className="w-full rounded-lg bg-gray-200 py-2 hover:bg-gray-400"
      >
        New Order
      </button>
      {error !== '' ? (
        <div className="absolute text-red-500">{error}</div>
      ) : null}
    </div>
  );
};

const OrderList = ({ orders }: { orders: Order[] }) => {
  const _openOrder = (id: string | null) => {
    Router.push(`/order/${id}`);
  };

  return (
    <div>
      <div className="mb-3 text-center font-semibold">MY ORDERS</div>
      <div className="flex flex-col gap-1">
        {orders.length === 0
          ? 'You have no order. Create one!'
          : orders.map((order: Order) => (
              <div key={order.id} className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => _openOrder(order.id)}
                  className="w-fit"
                >
                  {order.selectedMenuName}
                </button>
                <div className="flex items-center gap-1">
                  <div className="text-sm font-extralight text-gray-500">
                    {dayjs
                      .unix(order.timestamp?.seconds)
                      .format('hh:mm, ddd-DD-MMM-YYYY')}
                  </div>
                  <DeleteOrderButton order={order} />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

const DeleteOrderButton = ({ order }: { order: Order }) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const deleteOrderButtonRef = useCheckClickOutside(() => setIsDropdown(false));

  const _deleteOrder = async () => {
    await _deleteWantedFiles();
    await _deleteRows();
    await _deleteWanteds();
    await deleteDoc(doc(db, 'orders', order.id));
  };

  const _deleteRows = async () => {
    const q = query(collection(db, 'orders', order.id, 'rows'));
    const rowDocs = await getDocs(q);
    if (!rowDocs.empty) {
      rowDocs.forEach(async (row) => {
        await deleteDoc(doc(db, 'orders', order.id, 'rows', row.id));
      });
    }
  };
  const _deleteWanteds = async () => {
    const q = query(collection(db, 'orders', order.id, 'wanteds'));
    const wantedsDocs = await getDocs(q);
    if (!wantedsDocs.empty) {
      wantedsDocs.forEach(async (wanted) => {
        await deleteDoc(doc(db, 'orders', order.id, 'wanteds', wanted.id));
      });
    }
  };

  const _deleteWantedFiles = async () => {
    const storageRef = ref(storage, `wanted/${order?.id}`);
    const files = await listAll(storageRef);
    files.items.forEach(async (itemRef) => deleteObject(itemRef));
  };

  return (
    <div ref={deleteOrderButtonRef} className="relative">
      <button
        type="button"
        onClick={() => setIsDropdown(true)}
        className="rounded-md bg-gray-300 p-1 hover:bg-gray-500"
      >
        <TrashIcon className="h-3 w-3" />
      </button>
      {isDropdown ? (
        <div className="absolute -left-7 top-6 z-10 flex gap-1 rounded-md bg-white p-1">
          <button className="rounded-md bg-gray-200 p-1" onClick={_deleteOrder}>
            <CheckIcon className="h-3 w-3" />
          </button>
          <button
            className="rounded-md bg-gray-200 p-1"
            onClick={() => setIsDropdown(false)}
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

const MenusByEmbedLink = ({
  setMenuImageList,
  selectedMenu,
  setSelectedMenu,
}: {
  setMenuImageList: (updatedMenuImageList: string[]) => void;
  selectedMenu: Menu;
  setSelectedMenu: (menu: Menu) => void;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex h-9 items-center gap-3">
          <div>Today Menu: </div>
          <div className="w-fit rounded-lg bg-gray-200 px-3 py-1 drop-shadow-md">
            {selectedMenu.name ? selectedMenu.name : 'Select a menu'}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 rounded-lg bg-gray-200 p-2">
        <div>Menus by embed link</div>
        <AddMenuForm />
        <Menus
          setMenuImageList={setMenuImageList}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>
      <MenusByImage
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        setMenuImageList={setMenuImageList}
      />
    </div>
  );
};

const MenusByImage = ({
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

const MenusByImageList = ({
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
