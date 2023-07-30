import React from "react";
import { useState, useEffect } from "react";

import { DrinkTableRow, Order } from "@/types";

import {
  ClipboardDocumentIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  MinusIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";

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
      <div className="flex flex-col mt-12 h-screen gap-5 w-full">
        <HeaderSection order={order} />
        <SharedLink orderId={query.slug} />
        <Table rows={rows} orderId={query.slug} />
        <CalculateTotal order={order} orderId={query.slug} />
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

const Table = ({
  rows,
  orderId,
}: {
  rows: DrinkTableRow[];
  orderId: string;
}) => {
  return (
    <div className="p-3 border-2 rounded-xl flex flex-col gap-3 bg-gray-200">
      <TableHeader />
      <div className="flex flex-col gap-2 w-full">
        {rows.map((row: DrinkTableRow) => (
          <Row row={row} orderId={orderId} />
        ))}
      </div>
      <AddRowButton orderId={orderId} />
    </div>
  );
};

const Row = ({ row, orderId }: { row: DrinkTableRow; orderId: string }) => {
  const _updateRow = async (rowId: string, field: string, newValue: any) => {
    const docRef = doc(db, "orders", orderId, "rows", rowId);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div key={row.id} className="flex gap-2 items-center w-full text-xs">
      <div className="w-14 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          value={row.name}
          name="name"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="grow p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.drink}
          name="drink"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="w-14 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="number"
          value={row.price}
          name="price"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="w-9 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full text-center"
          type="number"
          value={row.count}
          name="count"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="w-9 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full text-center"
          type="text"
          value={row.size}
          name="size"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="w-12 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          value={row.sugar}
          name="sugar"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="w-12 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          value={row.ice}
          name="ice"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="w-44 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="No topping"
          value={row.topping}
          name="topping"
          onChange={(e) => _updateRow(row.id, e.target.name, e.target.value)}
        />
      </div>
      <div className="w-14 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        Thuong
      </div>
      <div className="w-20  flex items-center gap-1">
        <div className="w-14 p-1 bg-gray-400 drop-shadow-md rounded-md">
          50000
        </div>
        <div className="cursor-pointer">
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const TableHeader = () => {
  return (
    <div className="flex gap-2 items-center w-full font-semibold text-xs">
      <div className="w-14">Name</div>
      <div className="grow">Drink</div>
      <div className="w-14 ">Price</div>
      <div className="w-9">Count</div>
      <div className="w-9">Size</div>
      <div className="w-12">Sugar</div>
      <div className="w-12">Ice</div>
      <div className="w-44">Topping</div>
      <div className="w-14">Offer by</div>
      <div className="w-20">Transfer</div>
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
      className="w-full bg-white drop-shadow-sm px-2 py-1 rounded-lg hover:drop-shadow-md "
      type="button"
      onClick={_addRow}
    >
      <PlusIcon className="w-5 h-5 m-auto" />
    </button>
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

const CalculateTotal = ({
  order,
  orderId,
}: {
  order: Order;
  orderId: string;
}) => {
  return (
    <div className="flex items-center bg-gray-200 px-3 pt-9 pb-5 rounded-xl">
      <div className="relative w-fit ml-4">
        <div className="absolute -top-5 left-1 text-sm">Total</div>
        <div className="border-2 px-2 py-1 rounded-lg w-24 bg-gray-400">
          360000
        </div>
      </div>
      <PlusIcon className="w-5 h-5" />
      <ShipFeeInput order={order} orderId={orderId} />
      <MinusIcon className="w-5 h-5" />
      <DiscountInput order={order} orderId={orderId} />
      <Bars2Icon className="w-5 h-5" />
      <div className="relative w-fit ml-4">
        <div className="absolute -top-5 left-1 text-sm">Shop Owner Pay</div>
        <div className="border-2 px-2 py-1 rounded-lg w-32 bg-gray-400 text-2xl text-center">
          320000
        </div>
      </div>
    </div>
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
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Ship Fee</div>
      <input
        className="border-2 px-2 py-1 rounded-lg w-24"
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
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Discount</div>
      <input
        className="border-2 px-2 py-1 rounded-lg w-24"
        type="number"
        value={order.discount}
        name="discount"
        onChange={(e) => _updateOrder(e.target.name, e.target.value)}
      />
    </div>
  );
};
