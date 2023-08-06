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
  ShopOwner,
  Table,
  TranferInfo,
} from '@/components/pages/order';
import { db } from '@/firebase';
import { Meta } from '@/layouts/Meta';
import { OrderActions, selector } from '@/redux';
import { Main } from '@/templates/Main';
import type { DrinkTableRow, Order } from '@/types';

const OrderPage = ({ query }: { query: any }) => {
  // test redux
  const { redux_order } = useSelector(selector.order);
  const dispatch = useDispatch();

  const [rows, setRows] = useState<DrinkTableRow[]>([]);

  useEffect(() => {
    _fetchOrder();
    _fetchRows();
  }, []);

  const _fetchOrder = async () => {
    const docRef = doc(db, 'orders', query.slug);
    onSnapshot(docRef, (document) => {
      const newOrder: Order = {
        id: document.id,
        shipFee: document.data()?.shipFee,
        discount: document.data()?.discount,
        shopOwnerName: document.data()?.shopOwnerName,
        shopOwnerMomo: document.data()?.shopOwnerMomo,
        selectedMenuName: document.data()?.selectedMenuName,
        selectedMenuLink: document.data()?.selectedMenuLink,
      };
      dispatch(OrderActions.setOrder(newOrder));
    });
  };

  const _fetchRows = async () => {
    const rowsRef = collection(db, 'orders', query.slug, 'rows');
    const q = firestoreQuery(rowsRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      const updatedRows = snapshot.docs.map((document: any) => {
        return { ...document.data(), id: document.id };
      });
      setRows(updatedRows);
    });
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="mt-12 flex h-fit w-full flex-col lg:flex lg:flex-row lg:gap-5">
        <div className="flex flex-col lg:grow">
          <div className="mb-10 flex w-full gap-4 text-sm">
            <ShopOwner />
            <TranferInfo />
          </div>
          <div className="mb-10">
            <SharedLink />
          </div>
          <div className="mb-5">
            <Table rows={rows} />
          </div>
          <div className="mb-10">
            <CalculateTotal rows={rows} />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-2/5">
          <MenusDropdown />
          <iframe
            title="menu-frame"
            src={redux_order.selectedMenuLink}
            className="h-screen w-full rounded-xl border-2 p-5"
          />
        </div>
      </div>
    </Main>
  );
};

export default OrderPage;

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};
