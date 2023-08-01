import React from "react";
import { useState, useEffect } from "react";

import { DrinkTableRow, Order } from "@/types";

import {
  Table,
  CalculateTotal,
  ShopOwner,
  TranferInfo,
  SharedLink,
  MenusDropdown,
} from "@/components/pages/order";

import {
  doc,
  onSnapshot,
  collection,
  orderBy,
  query as firestoreQuery,
} from "firebase/firestore";
import { db } from "@/firebase";

import { Main } from "@/templates/Main";
import { Meta } from "@/layouts/Meta";

const OrderPage = ({ query }: { query: any }) => {
  const [order, setOrder] = useState<Order | any>({
    id: "",
    shipFee: 0,
    discount: 0,
    shopOwnerName: "",
    shopOwnerMomo: "",
    selectedMenuName: "",
    selectedMenuLink: "",
  });

  const [rows, setRows] = useState<DrinkTableRow[]>([]);

  useEffect(() => {
    _fetchOrder();
    _fetchRows();
  }, []);

  const _fetchOrder = async () => {
    const docRef = doc(db, "orders", query.slug);
    onSnapshot(docRef, (doc) => {
      setOrder({ ...doc.data(), id: doc.id });
    });
  };

  const _fetchRows = async () => {
    const rowsRef = collection(db, "orders", query.slug, "rows");
    const q = firestoreQuery(rowsRef, orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
      const updatedRows = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setRows(updatedRows);
    });
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="flex flex-col mt-12 h-fit w-full lg:flex lg:flex-row lg:gap-5">
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
            src={order.selectedMenuLink}
            className="w-full h-screen border-2 p-5 rounded-xl"
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
