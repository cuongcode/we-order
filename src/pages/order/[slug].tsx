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
import { Icons } from "@/images";

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
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="flex flex-col mt-12 h-screen gap-5">
        <HeaderSection order={order} />
        <SharedLink orderId={query.slug} />
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

const HeaderSection = ({ order }: { order: Order }) => {
  return (
    <div className="flex w-full gap-4">
      <ShopOwner order={order} />
      <TranferInfo order={order} />
    </div>
  );
};

const TranferInfo = ({ order }: { order: Order }) => {
  return (
    <div className="flex flex-col gap-2 items-center rounded-3xl border-2 border-gray-500 w-48 py-3 px-3">
      <div className="font-bold">TRANSFER INFO</div>
      <div className="flex flex-col gap-2 items-start w-full">
        <div className="flex w-full">
          <div className="w-1/3">Momo</div>
          <div className="w-1/12">:</div>
          <div>{order.shopOwnerMomo}</div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3">Bank</div>
          <div>:</div>
        </div>
      </div>
    </div>
  );
};

const ShopOwner = ({ order }: { order: Order }) => {
  return (
    <div className="flex flex-col gap-1 items-center rounded-3xl border-2 border-gray-500 w-48 py-3 px-8">
      <div className="font-bold">SHOP OWNER</div>
      <div className="bg-white rounded-full p-1">
        <img
          className="rounded-full bg-gray-200"
          src={Icons.user_icon.src}
          alt="user-icon"
        />
      </div>
      <div>{order.shopOwnerName}</div>
    </div>
  );
};

const SharedLink = ({ orderId }: { orderId: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <div>Share this link :</div>
      <div className="border-2 rounded-lg w-fit py-1 px-3">
        <div>https://weorder/order/{orderId}</div>
      </div>
    </div>
  );
};
