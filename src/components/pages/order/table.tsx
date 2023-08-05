import {
  CheckIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { range } from 'lodash';
import { useState } from 'react';

import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import type { DrinkTableRow, Order } from '@/types';

export const Table = ({
  rows,
  order,
}: {
  rows: DrinkTableRow[];
  order: Order;
}) => {
  const quanity = rows.length;
  const bonus = (Number(order.shipFee) - Number(order.discount)) / quanity;
  const roundedBonus = Math.ceil(bonus / 100) * 100;

  const transferList: number[] = rows.map((row: DrinkTableRow) => {
    if (row.offerBy !== '--') {
      return 0;
    }
    let transfer = Number(row.price) + roundedBonus;
    for (let i = 0; i < rows.length; i += 1) {
      if (rows[i]?.offerBy === row.name) {
        transfer += Number(rows[i]?.price) + roundedBonus;
      }
    }
    return transfer;
  });

  const numberArray = range(1, rows.length + 1, 1);

  return (
    <div className="flex flex-col gap-3 rounded-xl border-2 bg-gray-200 p-3">
      <TableHeader />
      <div className="flex w-full flex-col gap-2">
        {rows.map((row: DrinkTableRow, index: number) => (
          <Row
            key={row.id}
            row={row}
            order={order}
            rows={rows}
            rowIndex={numberArray[index]}
            transfer={transferList[index]}
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
  transfer,
}: {
  rows: DrinkTableRow[];
  row: DrinkTableRow;
  order: Order;
  rowIndex: any;
  transfer: number | undefined;
}) => {
  const SIZES = ['S', 'M', 'L', 'XL'];
  const PERCENTAGE = ['100%', '80%', '50%', '20%', '0%'];
  const offerByOptions = [
    '--',
    ...rows
      .filter((_row: DrinkTableRow) => _row.offerBy === '--')
      .map((_row: DrinkTableRow) => _row.name),
  ].filter((option: string) => option !== row.name);

  // const prices = rows.map((row: DrinkTableRow) => Number(row.price));
  // const total = numberArraySum(prices);
  // const currentShopOwnerPay =
  // total + Number(order.shipFee) - Number(order.discount);

  const _updateRow = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await updateDoc(docRef, {
      [name]: value,
    });
  };

  return (
    <div key={row.id} className="flex w-full items-center gap-2 text-xs">
      <div className="w-4">{rowIndex}</div>

      <div className="w-14 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          value={row.name}
          name="name"
          onChange={_updateRow}
        />
      </div>
      <div className="grow rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="Type Here"
          value={row.drink.toUpperCase()}
          name="drink"
          onChange={_updateRow}
        />
      </div>
      <div className="w-14 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="number"
          value={row.price}
          name="price"
          onChange={_updateRow}
        />
      </div>
      <div className="z-30 w-8 rounded-md border-2 bg-white p-1 drop-shadow-md">
        <OptionsDropdown row={row} order={order} options={SIZES} field="size" />
      </div>
      <div className="z-20 w-11 rounded-md border-2 bg-white p-1 drop-shadow-md">
        <OptionsDropdown
          row={row}
          order={order}
          options={PERCENTAGE}
          field="sugar"
        />
      </div>
      <div className="z-10 w-11 rounded-md border-2 bg-white p-1 drop-shadow-md">
        <OptionsDropdown
          row={row}
          order={order}
          options={PERCENTAGE}
          field="ice"
        />
      </div>
      <div className="w-36 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="No topping"
          value={row.topping}
          name="topping"
          onChange={_updateRow}
        />
      </div>
      <div className="z-10 w-14 rounded-md border-2 bg-white p-1 drop-shadow-md">
        <OfferByDropdown
          rows={rows}
          row={row}
          order={order}
          options={offerByOptions}
          field="offerBy"
        />
      </div>
      <div className="flex w-28 items-center gap-1">
        <div className="w-16 rounded-md bg-gray-400 p-1 drop-shadow-md">
          {transfer?.toLocaleString('en-US')}
        </div>
        <div className="cursor-pointer">
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </div>
        <DeleteRowButton order={order} row={row} />
      </div>
    </div>
  );
};

const TableHeader = () => {
  return (
    <div className="flex w-full items-center gap-2 text-xs font-semibold">
      <div className="w-4" />
      <div className="w-14">Name</div>
      <div className="grow">Drink</div>
      <div className="w-14 ">Price</div>
      <div className="w-8">Size</div>
      <div className="w-11">Sugar</div>
      <div className="w-11">Ice</div>
      <div className="w-36">Notes</div>
      <div className="w-14">Offer by</div>
      <div className="w-28">Transfer</div>
    </div>
  );
};

const AddRowButton = ({ orderId }: { orderId: string }) => {
  const _addRow = async () => {
    const newRow = {
      timestamp: serverTimestamp(),
      name: '',
      drink: '',
      size: 'S',
      price: 0,
      sugar: '100%',
      ice: '100%',
      topping: '',
      heart: 0,
      offerBy: '--',
      isTick: false,
    };
    await addDoc(collection(db, 'orders', orderId, 'rows'), newRow);
  };
  return (
    <button
      className="w-full rounded-lg bg-white px-2 py-1 drop-shadow-sm hover:drop-shadow-md "
      type="button"
      onClick={_addRow}
    >
      <PlusIcon className="m-auto h-5 w-5" />
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
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await deleteDoc(docRef);
  };

  return (
    <div ref={deleteRowButtonRef} className="relative">
      <button
        type="button"
        onClick={() => setIsDropdown(true)}
        className="rounded-md bg-gray-400 p-1 hover:bg-gray-500"
      >
        <TrashIcon className="h-3 w-3" />
      </button>
      {isDropdown ? (
        <div className="absolute -left-7 top-6 z-10 flex gap-1 rounded-md bg-white p-1">
          <button className="rounded-md bg-gray-200 p-1" onClick={_deleteRow}>
            <CheckIcon className="h-3 w-3" />
          </button>
          <button
            className="rounded-md bg-gray-200 p-1"
            onClick={() => setIsDropdown(false)}
          >
            <XMarkIcon className="h-3 w-3" />
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
  options: string[];
  order: Order;
  row: DrinkTableRow;
  field: keyof DrinkTableRow;
}) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const showOptions = options.filter((option: string) => option !== row[field]);

  const optionDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  const _updateRow = async (newValue: string) => {
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
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
            'absolute flex flex-col items-center gap-1 bg-gray-400 p-1 rounded-lg':
              true,
            '-top-1 left-10': field === 'sugar' || field === 'ice',
            '-top-1 left-7': field === 'size',
            '-top-1 left-14': field === 'offerBy',
          })}
        >
          {showOptions.map((option: string) => (
            <button
              key={option}
              type="button"
              className={clsx({
                'bg-white rounded-md text-center hover:bg-gray-500': true,
                'w-9 h-6': field === 'sugar' || field === 'ice',
                'w-6 h-6': field === 'size',
                'h-6 w-14': field === 'offerBy',
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

const OfferByDropdown = ({
  rows,
  options,
  order,
  row,
  field,
}: {
  rows: DrinkTableRow[];
  options: string[];
  order: Order;
  row: DrinkTableRow;
  field: keyof DrinkTableRow;
}) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const showOptions = options.filter((option: string) => option !== row[field]);

  const optionDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  const _updateRow = async (newValue: string) => {
    const updatedRows = rows.filter(
      (r: DrinkTableRow) => r.offerBy === row.name,
    );

    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });

    updatedRows.forEach(async (r: DrinkTableRow) => {
      const ref = doc(db, 'orders', order.id, 'rows', r.id);
      await updateDoc(ref, {
        [field]: newValue,
      });
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
            'absolute flex flex-col items-center gap-1 bg-gray-400 p-1 rounded-lg':
              true,
            '-top-1 left-10': field === 'sugar' || field === 'ice',
            '-top-1 left-7': field === 'size',
            '-top-1 left-14': field === 'offerBy',
          })}
        >
          {showOptions.map((option: string) => (
            <button
              key={option}
              type="button"
              className={clsx({
                'bg-white rounded-md text-center hover:bg-gray-500': true,
                'w-9 h-6': field === 'sugar' || field === 'ice',
                'w-6 h-6': field === 'size',
                'h-6 w-14': field === 'offerBy',
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
