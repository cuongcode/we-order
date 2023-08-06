import {
  CheckIcon,
  HeartIcon as OutlineHeart,
  QuestionMarkCircleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeart } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { deleteDoc, doc, increment, updateDoc } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import type { DrinkTableRow, Order } from '@/types';

export const TableRow = ({
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
      <div className="relative w-14 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          value={row.name}
          name="name"
          onChange={_updateRow}
        />
        <div className="absolute -right-2 top-4 ">
          <Heart row={row} order={order} />
        </div>
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
        {/* <DrinkInput order={order} row={row} /> */}
      </div>
      <div className="w-14 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="number"
          value={row.price !== 0 ? row.price : ''}
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
      <div className="w-32 rounded-md border-2 bg-white p-1 drop-shadow-md hover:border-gray-600">
        <input
          className="w-full"
          type="text"
          placeholder="No topping"
          value={row.topping}
          name="topping"
          onChange={_updateRow}
        />
      </div>
      <div className="z-10 w-16 rounded-md border-2 bg-white p-1 drop-shadow-md">
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
        <Question>
          {row.offerBy !== '--' ? (
            <div className="absolute -top-16 right-0 z-10 flex flex-col gap-2 divide-y-2 rounded-lg bg-white p-2">
              <OfferedByFormula row={row} />
            </div>
          ) : (
            <div className="absolute -top-28 right-0 z-10 flex flex-col gap-2 divide-y-2 rounded-lg bg-white p-2">
              <TransferFormula
                row={row}
                transfer={transfer}
                order={order}
                rows={rows}
              />
              <BonusFormula order={order} rows={rows} />
            </div>
          )}
        </Question>
        <DeleteRowButton order={order} row={row} />
      </div>
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

const Heart = ({ order, row }: { order: Order; row: DrinkTableRow }) => {
  const _updateRow = async () => {
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await updateDoc(docRef, {
      heart: increment(1),
    });
  };

  return (
    <div className="flex items-center">
      <button onClick={_updateRow}>
        {row.heart === 0 ? (
          <OutlineHeart className="h-4 w-4 text-red-400" />
        ) : (
          <SolidHeart className="h-4 w-4 text-red-400" />
        )}
      </button>
      <div>{row.heart}</div>
    </div>
  );
};

const Question = ({ children }: { children: ReactNode }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseOver={() => setIsHover(true)}
      onFocus={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onBlur={() => setIsHover(false)}
    >
      <QuestionMarkCircleIcon className="h-5 w-5" />
      {isHover ? children : null}
    </div>
  );
};

const TransferFormula = ({
  transfer,
  row,
  order,
  rows,
}: {
  transfer: number | undefined;
  row: DrinkTableRow;
  order: Order;
  rows: DrinkTableRow[];
}) => {
  const quantity = rows.length;
  const bonus = (order.shipFee - order.discount) / quantity;
  const roundedBonus = Math.ceil(bonus / 100) * 100;

  const transferList: number[] = rows.map(
    (r: DrinkTableRow) => Number(r.price) + roundedBonus,
  );

  return (
    <div className="flex gap-1">
      <div>
        <div className="font-semibold">transfer</div>
        <div>{transfer?.toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>=</div>
        <div>=</div>
      </div>
      <div>
        <div className="font-semibold">price</div>
        <div>{Number(row.price).toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>+</div>
        <div>+</div>
      </div>
      <div className="text-red-400">
        <div className="font-semibold">bonus</div>
        <div>({roundedBonus.toLocaleString('en-US')})</div>
      </div>
      {rows.map((r: DrinkTableRow, index: number) => {
        if (r.offerBy === row.name) {
          return (
            <>
              <div>
                <div>+</div>
                <div>+</div>
              </div>
              <div>
                <div>{r.name}</div>
                <div>{transferList[index]?.toLocaleString('en-US')}</div>
              </div>
            </>
          );
        }
        return null;
      })}
    </div>
  );
};

const BonusFormula = ({
  rows,
  order,
}: {
  rows: DrinkTableRow[];
  order: Order;
}) => {
  const quantity = rows.length;
  const bonus = (order.shipFee - order.discount) / quantity;
  const roundedBonus = Math.ceil(bonus / 100) * 100;

  return (
    <div className="flex gap-1">
      <div className="text-red-400">
        <div className="font-semibold">bonus</div>
        <div>{roundedBonus.toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>=</div>
        <div>=</div>
      </div>
      <div>
        <div>(</div>
        <div>(</div>
      </div>
      <div className="min-w-fit">
        <div className="font-semibold">ship fee</div>
        <div>{Number(order.shipFee).toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>-</div>
        <div>-</div>
      </div>
      <div>
        <div className="font-semibold">discount</div>
        <div>{Number(order.discount).toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>)</div>
        <div>)</div>
      </div>
      <div>
        <div>/</div>
        <div>/</div>
      </div>
      <div>
        <div>quantity</div>
        <div>{quantity}</div>
      </div>
    </div>
  );
};

const OfferedByFormula = ({ row }: { row: DrinkTableRow }) => {
  return (
    <div className="flex w-40 flex-col">
      <div className="flex gap-1">
        <div>You are offered by</div>
        <div className="font-semibold">{row.offerBy.toLocaleUpperCase()}</div>
      </div>
      <div className="flex gap-1">
        <div>Give a big</div>
        <SolidHeart className="h-5 w-5 text-red-400" />
        <div>to</div>
        <div className="font-semibold">{row.offerBy.toLocaleUpperCase()}</div>
      </div>
    </div>
  );
};

// const DrinkInput = ({ order, row }: { order: Order; row: DrinkTableRow }) => {
//   const [isEdit, setIsEdit] = useState(false);
//   const [drink, setDrink] = useState('');

//   const _onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setDrink(value);
//   };
//   const _updateRow = async () => {
//     const docRef = doc(db, 'orders', order.id, 'rows', row.id);
//     await updateDoc(docRef, {
//       drink,
//     });
//     setIsEdit(false);
//   };

//   return (
//     <div className="relative">
//       {isEdit || row.drink === '' ? (
//         <>
//           <input
//             className="w-full"
//             type="text"
//             placeholder="Type Here"
//             value={drink.toUpperCase()}
//             name="drink"
//             onChange={_onChange}
//           />
//           <button className="absolute right-0 top-0" onClick={_updateRow}>
//             <CheckIcon className="h-4 w-4" />
//           </button>
//         </>
//       ) : (
//         <>
//           <div className="w-full">{row.drink.toUpperCase()}</div>
//           <button
//             className="absolute right-0 top-0"
//             onClick={() => setIsEdit(!isEdit)}
//           >
//             <PencilSquareIcon className="h-4 w-4" />
//           </button>
//         </>
//       )}
//     </div>
//   );
// };
