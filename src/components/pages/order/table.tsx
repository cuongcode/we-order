import { useState, useEffect } from "react";

import { DrinkTableRow, Order } from "@/types";

import { numberArraySum } from "@/utils/base";

import { useCheckClickOutside } from "@/hooks";

import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

import {
  PlusIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export const Table = ({
  rows,
  order,
}: {
  rows: DrinkTableRow[];
  order: Order;
}) => {
  return (
    <div className="p-3 border-2 rounded-xl flex flex-col gap-3 bg-gray-200">
      <TableHeader />
      <div className="flex flex-col gap-2 w-full">
        {rows.map((row: DrinkTableRow) => (
          <Row key={row.id} row={row} order={order} rows={rows} />
        ))}
      </div>
      <AddRowButton orderId={order.id} />
    </div>
  );
};

const Row = ({
  rows,
  row,
  order,
}: {
  rows: DrinkTableRow[];
  row: DrinkTableRow;
  order: Order;
}) => {
  const [transfer, setTransfer] = useState("");

  const counts = rows.map((row: DrinkTableRow) => Number(row.count));
  const quanity = numberArraySum(counts);
  const bonus = (Number(order.shipFee) - Number(order.discount)) / quanity;
  const roundedBonus = Math.ceil(bonus / 100) * 100;
  const currentTransfer = Number(row.price) + roundedBonus;

  // const prices = rows.map((row: DrinkTableRow) => Number(row.price));
  // const total = numberArraySum(prices);
  // const currentShopOwnerPay =
  // total + Number(order.shipFee) - Number(order.discount);

  useEffect(() => {
    setTransfer(currentTransfer.toLocaleString("en-US"));
  }, [currentTransfer]);

  const _updateRow = async (rowId: string, field: string, newValue: any) => {
    const docRef = doc(db, "orders", order.id, "rows", rowId);
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
      <div className="w-36 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
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
        --
      </div>
      <div className="w-24  flex items-center gap-1">
        <div className="w-14 p-1 bg-gray-400 drop-shadow-md rounded-md">
          {transfer}
        </div>
        <div className="cursor-pointer">
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </div>
        <DeleteRowButton order={order} row={row} />
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
      <div className="w-36">Notes</div>
      <div className="w-14">Offer by</div>
      <div className="w-24">Transfer</div>
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

const DeleteRowButton = ({
  order,
  row,
}: {
  order: Order;
  row: DrinkTableRow;
}) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const deleteRowButtonRef = useCheckClickOutside(() => setIsDropdown(false));

  const _deleteRow = async () => {
    const docRef = doc(db, "orders", order.id, "rows", row.id);
    await deleteDoc(docRef);
  };

  return (
    <div ref={deleteRowButtonRef} className="relative">
      <button
        type="button"
        onClick={() => setIsDropdown(true)}
        className="p-1 bg-gray-400 rounded-md hover:bg-gray-500"
      >
        <TrashIcon className="w-3 h-3" />
      </button>
      {isDropdown ? (
        <div className="z-10 absolute top-6 -left-7 flex gap-1 bg-white p-1 rounded-md">
          <button className="p-1 rounded-md bg-gray-200" onClick={_deleteRow}>
            <CheckIcon className="w-3 h-3" />
          </button>
          <button
            className="p-1 rounded-md bg-gray-200"
            onClick={() => setIsDropdown(false)}
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
