import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from 'firebase/firestore';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CalculateTotal,
  MenusDropdown,
  SharedLink,
  ShopOwnerProfile,
  Table,
} from '@/components/pages/no-sign-in-order';
import { db } from '@/firebase';
import { Meta } from '@/layouts/Meta';
import { OrderActions, RowsActions, selector } from '@/redux';
import { ApiInstance } from '@/services/api';
import { handleError } from '@/services/apiHelper';
import { Main } from '@/templates/Main';
import type { Dish, NoSignInOrder } from '@/types';

const NoSignInOrderPage = ({
  orderId,
  dishes,
}: {
  orderId: any;
  dishes: Dish[];
}) => {
  const { noSignInOrder } = useSelector(selector.order);
  const [orderNamePool, setorderNamePool] = useState<any>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    _fetchNoSignInOrders();
  }, []);
  useEffect(() => {
    if (orderId) {
      _fetchNoSignInOrder();
      _fetchRows();
    }
  }, []);
  useEffect(() => {
    if (
      orderNamePool.includes(orderId) &&
      noSignInOrder.selectedMenuLink !== ''
    ) {
      _addMenuLink();
    }
  }, [noSignInOrder.selectedMenuLink]);

  const _fetchNoSignInOrder = () => {
    const docRef = doc(db, 'no_sign_in_orders', orderId);
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
    const rowsRef = collection(db, 'no_sign_in_orders', orderId, 'rows');
    const q = firestoreQuery(rowsRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      const updatedRows = snapshot.docs.map((document: any) => {
        return { ...document.data(), id: document.id };
      });
      dispatch(RowsActions.setRows(updatedRows));
    });
  };
  const _addMenuLink = () => {
    const url = new URL(noSignInOrder.selectedMenuLink);
    if (url.hostname === 'shopeefood.vn') {
      Router.push(
        `/no-sign-in-order/${noSignInOrder.id}/${url.pathname.slice(1)}`,
      );
    }
  };
  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      {!orderNamePool.includes(orderId) ? (
        <div>Page not found</div>
      ) : (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center 2xl:flex-row 2xl:items-start 2xl:gap-5">
          <div className="mt-10 flex w-full max-w-4xl flex-col 2xl:w-1/2">
            <div className="mb-10 flex w-full gap-4 text-sm">
              <div className="w-full shrink-0">
                <ShopOwnerProfile />
              </div>
              {/* <div className="h-40 w-56 shrink-0">
                <ShopOwnerTransferInfo />
              </div> */}
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
              <Table dishes={dishes} />
            </div>
            <div className="mb-10">
              <CalculateTotal />
            </div>
          </div>
          <div className="flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-3 2xl:mt-10 2xl:w-1/2">
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

export const getServerSideProps = async (context: any) => {
  const { query } = context;
  const orderId = query.slug[0];
  if (query.slug.length > 1) {
    const menuLink = query.slug.slice(1).join('/');
    const res1 = await ApiInstance.getDeliveryId(menuLink);

    const { result, error } = handleError(res1);
    if (error) {
      //
    }
    const deliveryId = result.reply.delivery_id;

    const res = await ApiInstance.getDishes(deliveryId);
    // @ts-ignore
    const dish_types = res.data.reply.menu_infos;
    // const dish_type_names = dish_types.map((type: any) => type.dish_type_name);
    const dishes = dish_types
      .map(
        (type: any) =>
          type.dishes?.map((dish: any) => {
            return {
              id: dish.id,
              name: dish.name,
              price: dish.price.value,
              photo: dish.photos[0].value,
            };
          }),
      )
      .flat();
    return { props: { query, orderId, dishes } };
  }
  return { props: { query, orderId } };
};
