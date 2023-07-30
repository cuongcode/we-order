import React from "react";
import { useState, useEffect } from "react";

import { DrinkTableRow, Order } from "@/types";

import { ClipboardDocumentIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  orderBy,
  query as firestoreQuery,
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
      <div className="flex flex-col mt-12 h-screen gap-5 p-5 w-full">
        <HeaderSection order={order} />
        <SharedLink orderId={query.slug} />
        <ShipFeeInput order={order} orderId={query.slug} />
        <DiscountInput order={order} orderId={query.slug} />
        <AddRowButton orderId={query.slug} />
        <div className="flex flex-col gap-2 w-full">
          {rows.map((row: DrinkTableRow) => (
            <Row row={row} orderId={query.slug} />
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

const Row = ({ row, orderId }: { row: DrinkTableRow; orderId: string }) => {
  const _updateRow = async (rowId: string, field: string, newValue: any) => {
    const docRef = doc(db, "orders", orderId, "rows", rowId);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div key={row.id} className="flex gap-2 items-center w-full">
      <div className="border-2 rounded-lg w-2/12">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.name}
          name="name"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="border-2 rounded-lg w-6/12">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.drink}
          name="drink"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="border-2 rounded-lg w-1/12">
        <input
          className="w-full"
          type="number"
          placeholder="Type Here"
          value={row.price}
          name="price"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="border-2 rounded-lg w-1/12">
        <input
          className="w-full"
          type="number"
          placeholder="Type Here"
          value={row.count}
          name="count"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="border-2 rounded-lg w-1/12">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.size}
          name="size"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="border-2 rounded-lg w-1/12">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.sugar}
          name="sugar"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="w-1/12">
        <input
          className="border-2 rounded-lg w-full"
          type="text"
          placeholder="Type Here"
          value={row.ice}
          name="ice"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="border-2 rounded-lg w-6/12">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.topping}
          name="topping"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
    </div>
  );
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
    <div className="flex flex-col gap-2 items-center rounded-3xl border-2 border-gray-300 w-48 py-3 px-3">
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
    <div className="flex flex-col gap-1 items-center rounded-3xl border-2 border-gray-300 w-48 py-3 px-8">
      <div className="font-bold">SHOP OWNER</div>
      <div className="bg-gray-200 rounded-full p-1">
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
  const _copyClipboard = () => {
    //
  };

  return (
    <div className="flex flex-col gap-2">
      <div>Share this link :</div>
      <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg w-fit py-1 px-3">
        <div>https://we-order-omega.vercel.app/order/{orderId}</div>
        <button type="button" onClick={_copyClipboard}>
          <ClipboardDocumentIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const AddRowButton = ({ orderId }: { orderId: string }) => {
  const _addRow = async () => {
    const newRow = {
      timestamp: serverTimestamp(),
      name: "",
      drink: "",
      size: "S",
      count: 1,
      price: 0,
      sugar: "100%",
      ice: "100%",
      topping: "",
      heart: 0,
      isTick: false,
    };
    await addDoc(collection(db, "orders", orderId, "rows"), newRow);
  };
  return (
    <button
      className="w-fit border-2 px-2 py-1 rounded-lg"
      type="button"
      onClick={_addRow}
    >
      <PlusIcon className="w-5 h-5" />
    </button>
  );
};

const ShipFeeInput = ({
  order,
  orderId,
}: {
  order: Order;
  orderId: string;
}) => {
  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="w-fit">
      <div>Ship Fee</div>
      <input
        className="border-2 px-1 rounded-lg w-24"
        type="number"
        value={order.shipFee}
        name="shipFee"
        onChange={(e) => _updateOrder(e.target.name, e.target.value)}
      />
    </div>
  );
};

const DiscountInput = ({
  order,
  orderId,
}: {
  order: Order;
  orderId: string;
}) => {
  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="w-fit">
      <div>Discount</div>
      <input
        className="border-2 px-1 rounded-lg w-24"
        type="number"
        value={order.discount}
        name="discount"
        onChange={(e) => _updateOrder(e.target.name, e.target.value)}
      />
    </div>
  );
};
