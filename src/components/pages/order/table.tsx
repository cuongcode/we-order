import { DrinkTableRow } from "@/types";

import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

import {
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

export const Table = ({
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