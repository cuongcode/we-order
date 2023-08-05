import { useState, useEffect } from "react";

import { range } from "lodash";

import clsx from "clsx";

import { DrinkTableRow, Order } from "@/types";

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
  const numberArray = range(1, rows.length + 1, 1);

  return (
    <div className="p-3 border-2 rounded-xl flex flex-col gap-3 bg-gray-200">
      <TableHeader />
      <div className="flex flex-col gap-2 w-full">
        {rows.map((row: DrinkTableRow, index: number) => (
          <Row
            key={row.id}
            row={row}
            order={order}
            rows={rows}
            rowIndex={numberArray[index]}
          />
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
  rowIndex,
}: {
  rows: DrinkTableRow[];
  row: DrinkTableRow;
  order: Order;
  rowIndex: any;
}) => {
  const [transfer, setTransfer] = useState("");

  const SIZES = ["S", "M", "L", "XL"];
  const PERCENTAGE = ["100%", "80%", "50%", "20%", "0%"];

  const quanity = rows.length;
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

  const _updateRow = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(db, "orders", order.id, "rows", row.id);
    await updateDoc(docRef, {
      [name]: value,
    });
  };

  return (
    <div key={row.id} className="flex gap-2 items-center w-full text-xs">
      <div className="w-4">{rowIndex}</div>

      <div className="w-14 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          value={row.name}
          name="name"
          onChange={_updateRow}
        />
      </div>
      <div className="grow p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.drink.toUpperCase()}
          name="drink"
          onChange={_updateRow}
        />
      </div>
      <div className="w-14 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="number"
          value={row.price}
          name="price"
          onChange={_updateRow}
        />
      </div>
      <div className="z-30 w-8 p-1 bg-white border-2 drop-shadow-md rounded-md">
        <OptionsDropdown row={row} order={order} options={SIZES} field="size" />
      </div>
      <div className="z-20 w-11 p-1 bg-white border-2 drop-shadow-md rounded-md">
        <OptionsDropdown
          row={row}
          order={order}
          options={PERCENTAGE}
          field="sugar"
        />
      </div>
      <div className="z-10 w-11 p-1 bg-white border-2 drop-shadow-md rounded-md">
        <OptionsDropdown
          row={row}
          order={order}
          options={PERCENTAGE}
          field="ice"
        />
      </div>
      <div className="w-36 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="No topping"
          value={row.topping}
          name="topping"
          onChange={_updateRow}
        />
      </div>
      <div className="z-10 w-14 p-1 bg-white border-2 drop-shadow-md rounded-md hover:border-gray-600">
        <OfferByDropdown rows={rows} />
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
      <div className="w-4"></div>
      <div className="w-14">Name</div>
      <div className="grow">Drink</div>
      <div className="w-14 ">Price</div>
      <div className="w-8">Size</div>
      <div className="w-11">Sugar</div>
      <div className="w-11">Ice</div>
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

const OptionsDropdown = ({
  options,
  order,
  row,
  field,
}: {
  field: keyof DrinkTableRow;
  options: string[];
  order: Order;
  row: DrinkTableRow;
}) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const showOptions = options.filter((option: string) => option != row[field]);

  const optionDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  const _updateRow = async (newValue: string) => {
    const docRef = doc(db, "orders", order.id, "rows", row.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });
    setIsDropdown(false);
  };

  return (
    <div ref={optionDropdownRef} className="relative">
      <button
        type="button"
        className="w-full"
        onClick={() => setIsDropdown(true)}
      >
        {row[field]}
      </button>
      {isDropdown ? (
        <div
          className={clsx({
            "absolute flex flex-col items-center gap-1 bg-gray-400 p-1 rounded-lg":
              true,
            "-top-1 left-10": field === "sugar" || field === "ice",
            "-top-1 left-7": field === "size",
          })}
        >
          {showOptions.map((option: string) => (
            <button
              type="button"
              className={clsx({
                "bg-white rounded-md text-center hover:bg-gray-500": true,
                "w-9 h-6": field === "sugar" || field === "ice",
                "w-6 h-6": field === "size",
              })}
              onClick={() => _updateRow(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const OfferByDropdown = ({ rows }: { rows: DrinkTableRow[] }) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [offerBy, setOfferBy] = useState<string>("--");

  const showOptions = [
    "--",
    ...rows.map((row: DrinkTableRow) => row.name),
  ].filter((option: string) => option !== offerBy);

  const optionDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  return (
    <div ref={optionDropdownRef} className="relative">
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setIsDropdown(true)}
      >
        {offerBy}
      </button>
      {isDropdown ? (
        <div className="absolute -top-1 left-14 flex flex-col items-center gap-1 bg-gray-400 p-1 rounded-lg">
          {showOptions.map((option: string) => (
            <button
              type="button"
              className="bg-white w-14 h-6 rounded-md text-center hover:bg-gray-500"
              onClick={() => setOfferBy(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
