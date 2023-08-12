import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from 'firebase/firestore';
import React, { useEffect } from 'react';
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
import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { OrderActions, RowsActions, selector } from '@/redux';
import { Main } from '@/templates/Main';
import type { Order } from '@/types';

const OrderPage = ({ query }: { query: any }) => {
  const { order } = useSelector(selector.order);
  const dispatch = useDispatch();

  useEffect(() => {
    _fetchOrder();
    _fetchRows();
  }, []);

  const _fetchOrder = () => {
    const docRef = doc(db, 'orders', query?.slug);
    onSnapshot(docRef, (document) => {
      const newOrder: Order = {
        id: document.id,
        shipFee: document.data()?.shipFee,
        discount: document.data()?.discount,
        shopOwnerName: document.data()?.shopOwnerName,
        shopOwnerMomo: document.data()?.shopOwnerMomo,
        selectedMenuName: document.data()?.selectedMenuName,
        selectedMenuLink: document.data()?.selectedMenuLink,
        uid: document.data()?.uid,
        timestamp: document.data()?.timestamp,
        bank1Name: document.data()?.bank1Name,
        bank1Number: document.data()?.bank1Number,
        bank2Name: document.data()?.bank2Name,
        bank2Number: document.data()?.bank2Number,
      };
      dispatch(OrderActions.setOrder(newOrder));
    });
  };

  const _fetchRows = () => {
    const rowsRef = collection(db, 'orders', query?.slug, 'rows');
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
      <div className="mt-12 flex h-fit w-full flex-col lg:flex lg:flex-row lg:gap-5">
        <div className="flex flex-col lg:w-1/2">
          <div className="mb-10 w-full">
            <img
              className="m-auto w-1/2"
              src={LogoImages.title_logo.src}
              alt="title-logo"
            />
          </div>
          <div className="mb-10 flex w-full gap-4 text-sm">
            <ShopOwner />
            <TranferInfo />
          </div>
          <div className="mb-10">
            <SharedLink />
          </div>
          <div className="mb-5">
            <Table />
          </div>
          <div className="mb-10">
            <CalculateTotal />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-1/2">
          <MenusDropdown />
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

// OrderPage.getInitialProps = async (context: any) => {
//   const { query } = context;
//   return { query };
// };

export const getStaticPaths = async () => {
  const paths: any = [];

  const querySnapshot = await getDocs(collection(db, 'orders'));
  querySnapshot.forEach((_doc: any) =>
    paths.push({
      params: { slug: _doc.id },
    }),
  );
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params: { slug },
}: {
  params: any;
  slug: any;
}) => {
  const query = { slug };
  return { props: { query } };
};
