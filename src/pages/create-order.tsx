import {
  CheckIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
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
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { auth, db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { Icons, LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { selector, UserActions } from '@/redux';
import { Main } from '@/templates/Main';
import type { Menu, Order, User } from '@/types';

const CreateOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu>({
    id: '',
    name: '',
    link: '',
  });

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
      <div className="m-auto max-w-5xl">
        <div className="my-12 w-full">
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
              <TranferInfo />
            </div>
            <MenusDropdown
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
      if (selectedMenu.link === '') {
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
        shopOwnerName: currentUser.nickname,
        shopOwnerMomo: currentUser.momo,
        selectedMenuName: selectedMenu.name,
        selectedMenuLink: selectedMenu.link,
        bank1Name: currentUser.bank1Name,
        bank1Number: currentUser.bank1Number,
        bank2Name: currentUser.bank2Name,
        bank2Number: currentUser.bank2Number,
        uid: currentUser.uid,
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
    const q = query(collection(db, 'orders', order.id, 'rows'));
    const rowDocs = await getDocs(q);
    if (!rowDocs.empty) {
      rowDocs.forEach(async (row) => {
        await deleteDoc(doc(db, 'orders', order.id, 'rows', row.id));
      });
      await deleteDoc(doc(db, 'orders', order.id));
    }
    await deleteDoc(doc(db, 'orders', order.id));
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

const UserProfile = () => {
  return (
    <div className="flex h-40 w-1/3 flex-col items-center rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">PROFILE</div>
      <div className="mt-1 w-20 rounded-full bg-gray-200 p-1">
        <img
          className="rounded-full bg-gray-200"
          src={Icons.user_icon.src}
          alt="user-icon"
        />
      </div>
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
          <div className="flex h-6 w-20 items-center justify-center rounded-md border-2 border-white">
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

const TranferInfo = () => {
  return (
    <div className="flex h-40 grow flex-col items-center gap-2 rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">TRANSFER INFO</div>
      <div className="flex w-full flex-col items-start text-sm">
        <div className="flex h-6 w-full items-center">
          <div className="w-11">Momo</div>
          <div className="mx-2">:</div>
          <div className="grow">
            <ShopOwnerMomoInput />
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-11">Bank</div>
          <div className="mx-2">:</div>
        </div>
        <div className="flex w-full flex-col">
          <ShopOwnerBankInput field1="bank1Name" field2="bank1Number" />
          <ShopOwnerBankInput field1="bank2Name" field2="bank2Number" />
        </div>
      </div>
    </div>
  );
};

const ShopOwnerMomoInput = () => {
  const [momo, setMomo] = useState('');
  const { currentUser } = useSelector(selector.user);
  const [isEdit, setIsEdit] = useState(false);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMomo(value);
  };

  const _onEdit = () => {
    setMomo(currentUser?.momo || '');
    setIsEdit(true);
  };

  const _updateUserMomo = async () => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(docRef, {
        momo,
      });
      setIsEdit(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      {isEdit ? (
        <>
          <input
            className="w-28 rounded-md border-2 px-1 hover:border-gray-600"
            type="text"
            value={momo}
            name="shopOwnerMomo"
            onChange={_onChange}
          />
          <button className="" onClick={_updateUserMomo}>
            <CheckIcon className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div className="w-28 rounded-md border-2 border-white px-1">
            {currentUser?.momo || '--'}
          </div>
          <button className="" onClick={_onEdit}>
            <PencilSquareIcon className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
};

const ShopOwnerBankInput = ({
  field1,
  field2,
}: {
  field1: keyof User;
  field2: keyof User;
}) => {
  const [bankName, setBankName] = useState<any>('');
  const [bankNumber, setBankNumber] = useState<any>('');
  const [isEdit, setIsEdit] = useState(false);
  const { currentUser } = useSelector(selector.user);

  const _onEdit = () => {
    if (currentUser) {
      setBankName(currentUser[field1]);
      setBankNumber(currentUser[field2]);
    }
    setIsEdit(true);
  };

  const _onBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBankName(value);
  };
  const _onBankNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBankNumber(value);
  };

  const _updateUserMomo = async () => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(docRef, {
        [field1]: bankName,
        [field2]: bankNumber,
      });
      setIsEdit(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      {isEdit ? (
        <>
          <div className="flex items-center">
            <input
              className="w-12 rounded-md border-2 px-1 hover:border-gray-600"
              type="text"
              value={bankName}
              onChange={_onBankNameChange}
            />
            <input
              className="w-32 rounded-md border-2 px-1 hover:border-gray-600"
              type="text"
              value={bankNumber}
              onChange={_onBankNumberChange}
            />
          </div>
          <button className="" onClick={_updateUserMomo}>
            <CheckIcon className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <div className="w-12 rounded-md border-2 border-white px-1">
              {currentUser ? currentUser[field1]?.toString() || '--' : ''}
            </div>
            <div className="w-32 rounded-md border-2 border-white px-1">
              {currentUser ? currentUser[field2]?.toString() : ''}
            </div>
          </div>
          <button className="" onClick={_onEdit}>
            <PencilSquareIcon className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
};

const MenusDropdown = ({
  selectedMenu,
  setSelectedMenu,
}: {
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
        <AddMenuForm />
        <Menus setSelectedMenu={setSelectedMenu} />
      </div>
    </div>
  );
};

const Menus = ({
  setSelectedMenu,
}: {
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

  const _selectMenu = async (
    menuId: string,
    menuName: string,
    menuLink: string,
  ) => {
    setSelectedMenu({ id: menuId, name: menuName, link: menuLink });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {menus?.length === 0 || menus === undefined
        ? 'You have no menu. Add one!'
        : menus.map((menu: Menu) => (
            <button
              className="rounded-lg bg-white px-3 py-1 hover:bg-gray-400"
              type="button"
              key={menu.name}
              onClick={() => _selectMenu(menu.id, menu.name, menu.link)}
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

  const _addUserMenu = async () => {
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
      <div className="flex w-5/12 items-center gap-1">
        <div>Name:</div>
        <input
          className="w-full rounded-md border-2 px-1 hover:border-gray-600"
          type="text"
          placeholder="menu name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex w-7/12 items-center gap-1">
        <div>Link:</div>
        <input
          className="w-full rounded-md border-2 px-1 hover:border-gray-600"
          type="text"
          placeholder="paste link here"
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
