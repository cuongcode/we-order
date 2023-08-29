import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  MenusSection,
  NewOrderButton,
  OrderList,
  UserProfile,
  UserTranferInfo,
} from '@/components/pages/create-order';
import { auth, db } from '@/firebase';
import { LogoImages } from '@/images';
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
              <MenusSection
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
