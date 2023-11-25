import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CalculateTotal,
  MenusDropdown,
  SharedLink,
  ShopOwnerProfile,
  ShopOwnerTransferInfo,
  Table,
} from '@/components/pages/no-sign-in-order';
import { db } from '@/firebase';
import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { OrderActions, RowsActions, selector } from '@/redux';
import { Main } from '@/templates/Main';
import type { NoSignInOrder } from '@/types';

const NoSignInOrderPage = ({ query }: { query: any }) => {
  const { noSignInOrder } = useSelector(selector.order);
  const [orderNamePool, setorderNamePool] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    _fetchNoSignInOrders();
  }, []);
  useEffect(() => {
    if (query) {
      _fetchNoSignInOrder();
      _fetchRows();
    }
  }, []);
  const _fetchNoSignInOrder = () => {
    const docRef = doc(db, 'no_sign_in_orders', query?.slug);
    onSnapshot(docRef, (document) => {
      const newOrder: NoSignInOrder = {
        id: document.id,
        isClosed: document.data()?.isClosed,
        shipFee: document.data()?.shipFee,
        discount: document.data()?.discount,
        selectedMenuName: document.data()?.selectedMenuName,
        selectedMenuLink: document.data()?.selectedMenuLink,
        password: document.data()?.password,
        nickname: document.data()?.nickname,
        momo: document.data()?.momo,
        bank1Name: document.data()?.bank1Name,
        bank1Number: document.data()?.bank1Number,
        bank2Name: document.data()?.bank2Name,
        bank2Number: document.data()?.bank2Number,
        avatar: document.data()?.avatar,
        momoQR: document.data()?.momoQR,
        bankQR: document.data()?.bankQR,
      };
      dispatch(OrderActions.setNoSignInOrder(newOrder));
    });
  };
  const _fetchNoSignInOrders = async () => {
    const q = firestoreQuery(collection(db, 'no_sign_in_orders'));
    onSnapshot(q, (snapshot) => {
      const updatedNoSignInOrders = snapshot.docs.map((_doc: any) => {
        return _doc.id;
      });
      setorderNamePool(updatedNoSignInOrders);
    });
  };
  const _fetchRows = () => {
    const rowsRef = collection(db, 'no_sign_in_orders', query?.slug, 'rows');
    const q = firestoreQuery(rowsRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      const updatedRows = snapshot.docs.map((document: any) => {
        return { ...document.data(), id: document.id };
      });
      dispatch(RowsActions.setRows(updatedRows));
    });
  };
  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      {!orderNamePool.includes(query.slug) ? (
        <div>Page not found</div>
      ) : (
        <div className="mt-12 flex h-fit w-full flex-col items-center 2xl:flex-row 2xl:items-start 2xl:gap-5">
          <div className="flex w-full max-w-4xl flex-col 2xl:w-1/2">
            <div className="mb-10 w-full">
              <img
                className="m-auto w-1/2"
                src={LogoImages.title_logo.src}
                alt="title-logo"
              />
            </div>

            <div className="mb-10 flex w-full gap-4 text-sm">
              <div className="h-40 w-36 shrink-0">
                <ShopOwnerProfile />
              </div>
              <div className="h-40 w-56 shrink-0">
                <ShopOwnerTransferInfo />
              </div>
            </div>

            <div className="mb-10">
              <SharedLink />
            </div>
            <div className="relative mb-5">
              {noSignInOrder.isClosed ? (
                <div className="absolute -top-7 right-1/2 text-xl font-bold text-gray-600">
                  CLOSED
                </div>
              ) : null}
              <Table />
            </div>
            <div className="mb-10">
              <CalculateTotal />
            </div>
          </div>
          <div className="flex w-full max-w-4xl flex-col gap-3 2xl:w-1/2">
            <MenusDropdown />
            <iframe
              title="menu-frame"
              src={noSignInOrder.selectedMenuLink}
              className="h-screen w-full rounded-xl border-2 p-5"
            />
          </div>
        </div>
      )}
    </Main>
  );
};

export default NoSignInOrderPage;

NoSignInOrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};
