import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

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
import { Main } from '@/templates/Main';
import type { DrinkTableRow, Order } from '@/types';

const OrderPage = ({ query }: { query: any }) => {
  const [order, setOrder] = useState<Order | any>({
    id: '',
    shipFee: 0,
    discount: 0,
    shopOwnerName: '',
    shopOwnerMomo: '',
    selectedMenuName: '',
    selectedMenuLink: '',
  });

  const [rows, setRows] = useState<DrinkTableRow[]>([]);

  useEffect(() => {
    _fetchOrder();
    _fetchRows();
  }, []);

  const _fetchOrder = async () => {
    const docRef = doc(db, 'orders', query.slug);
    onSnapshot(docRef, (document) => {
      setOrder({ ...document.data(), id: document.id });
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
            <ShopOwner order={order} />
            <TranferInfo order={order} />
          </div>
          <div className="mb-10">
            <SharedLink orderId={order.id} />
          </div>
          <div className="mb-5">
            <Table rows={rows} order={order} />
          </div>
          <div className="mb-10">
            <CalculateTotal order={order} rows={rows} />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-2/5">
          <MenusDropdown order={order} />
          <iframe
            title="menu-frame"
            src={order.selectedMenuLink}
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
