import React from "react";
import { useState, useEffect } from "react";

import { DrinkTableRow, Order } from "@/types";

import {
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  collection,
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
    const q = collection(db, "orders", query.slug, "rows");
    onSnapshot(q, (snapshot) => {
      const updatedRows = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setRows(updatedRows);
    });
  };

  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, "orders", query.slug);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };

  const _addRow = async () => {
    const newRow = { name: "", drink: "" };
    await addDoc(collection(db, "orders", query.slug, "rows"), newRow);
  };

  const _updateRow = async (rowId: string, field: string, newValue: any) => {
    const docRef = doc(db, "orders", query.slug, "rows", rowId);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };

  return (
    <Main meta={<Meta title="Order" description="" />}>
      <div className="flex flex-col bg-white mt-5 h-screen">
        <div>{query.slug}</div>
        <div>Shop Owner: {order.shopOwnerName}</div>
        <div>Momo: {order.shopOwnerMomo}</div>
        <div>Discount: {order.discount}</div>
        <div>
          <div>Ship Fee:</div>
          <input
            className="border-2"
            type="number"
            value={order.shipFee}
            name="shipFee"
            onChange={(e) => _updateOrder(e.target.name, e.target.value)}
          />
        </div>
        <button type="button" onClick={_addRow}>
          Add Row
        </button>
        <div>
          {rows.map((row: DrinkTableRow) => (
            <div key={row.id}>
              <input
                type="text"
                placeholder="Type Here"
                value={row.name}
                name="name"
                onChange={(e) =>
                  _updateRow(row.id, e.target.name, e.target.value)
                }
              />
              <span>{row.drink}</span>
            </div>
          ))}
        </div>
        <div>Menu: {order.selectedsMenuName}</div>
        <div>Menu: {order.selectedMenuLink}</div>
      </div>
    </Main>
  );
};

export default OrderPage;

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};
