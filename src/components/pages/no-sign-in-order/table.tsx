import {
  BarsArrowDownIcon,
  CheckIcon,
  NoSymbolIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query as firestoreQuery,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { debounce, range } from 'lodash';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { RowsActions, selector } from '@/redux';
import type { Dish, DrinkTableRow } from '@/types';

import { OfferedByFormula, ShowFormula } from '../order';

export const Table = ({ dishes }: { dishes: Dish[] }) => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const quanity = rows.length;
  const bonus =
    (Number(noSignInOrder.shipFee) - Number(noSignInOrder.discount)) / quanity;
  const roundedBonus = Math.ceil(bonus / 500) * 500;

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
    <div
      className={clsx({
        'flex flex-col gap-2 rounded-xl border-2 p-1': true,
        'bg-gray-200': !noSignInOrder.isClosed,
        'bg-gray-400': noSignInOrder.isClosed,
      })}
    >
      <div className="hidden w-full md:block">
        <TableHeader />
      </div>
      <div className="flex w-full flex-col gap-2">
        {rows.map((row: DrinkTableRow, index: number) => (
          <TableRow
            key={row.id}
            row={row}
            rowIndex={numberArray[index]}
            transfer={transferList[index]}
            dishes={dishes}
          />
        ))}
      </div>
      <TableAddRowButton />
    </div>
  );
};

const TableHeader = () => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);
  const dispatch = useDispatch();

  const _SortDrinkName = () => {
    const sortedRows = [...rows];
    sortedRows.sort((rowA: DrinkTableRow, rowB: DrinkTableRow) => {
      const x = rowA.drink.trim().toLowerCase();
      const y = rowB.drink.trim().toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    dispatch(RowsActions.setRows(sortedRows));
  };

  return (
    <div className="flex w-full items-center gap-1 text-xs font-semibold">
      <div className="w-3" />
      <div className="w-14">Name</div>
      <div className="flex grow items-center gap-2">
        <div>Drink</div>
        {noSignInOrder.isClosed ? (
          <button
            onClick={_SortDrinkName}
            className="flex items-center gap-1 rounded-md bg-white px-1 font-normal"
          >
            <BarsArrowDownIcon className="h-4 w-4" />
            <div>A-Z</div>
          </button>
        ) : null}
      </div>
      <div className="w-32">Notes/Topping</div>
      <div className="w-14 ">Price</div>
      <div className="w-8">Size</div>
      <div className="w-11">Sugar</div>
      <div className="w-11">Ice</div>
      <div className="w-16">Offered by</div>
      <div className="w-24">Transfer</div>
    </div>
  );
};

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'];
const PERCENTAGE_OPTIONS = ['100%', '70%', '50%', '30%', '0%'];

const TableRow = ({
  row,
  rowIndex,
  transfer,
  dishes,
}: {
  row: DrinkTableRow;
  rowIndex: any;
  transfer: number | undefined;
  dishes: Dish[];
}) => {
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [autoCompleteList, setAutoCompleteList] = useState<Dish[]>([]);
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  // useMemo here ?
  const offerByOptions = [
    '--',
    ...rows
      .filter((_row: DrinkTableRow) => _row.offerBy === '--')
      .map((_row: DrinkTableRow) => _row.name),
  ].filter((option: string) => option !== row.name && option !== '');

  const _debounceSearch = useCallback(
    debounce((searchString) => {
      _autoCompleteDrink(searchString);
    }, 500),
    [dishes],
  );

  const _updateRow = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await updateDoc(docRef, {
      [name]: value,
    });
    _debounceSearch(value);
  };

  const _showAutoComplete = () => {
    setShowAutoComplete(true);
  };

  const _autoCompleteDrink = (searchString: string) => {
    if (searchString === '') {
      setAutoCompleteList([]);
      return;
    }

    const list = dishes?.filter((dish: Dish) => {
      const normalizeDish = dish.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return normalizeDish.includes(searchString.toLocaleLowerCase());
    });
    setAutoCompleteList(list);
  };

  const autoCompleteRef = useCheckClickOutside(() => {
    setShowAutoComplete(false);
  });

  const _selectDrink = async (dish: Dish) => {
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await updateDoc(docRef, {
      drink: dish.name,
      price: dish.price,
    });
    setShowAutoComplete(false);
  };

  return (
    <div
      key={row.id}
      className={clsx({
        'flex w-full items-center gap-1 rounded-md text-xs': true,
        'bg-gray-400': row.isTick,
      })}
    >
      <div className="w-3">{rowIndex}</div>
      <div
        className={clsx({
          'relative w-14 rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600':
            true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <input
          className={clsx({
            'w-full font-semibold': true,
            'bg-gray-400': row.isTick,
          })}
          type="text"
          value={row.name}
          name="name"
          disabled={noSignInOrder.isClosed}
          onChange={_updateRow}
        />
        <div className="absolute -right-2 top-4 " />
      </div>
      <div
        className={clsx({
          'grow rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600 relative z-50':
            true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <input
          className={clsx({
            'w-full': true,
            'bg-gray-400': row.isTick,
          })}
          type="text"
          placeholder="Type Here"
          value={row.drink.toUpperCase()}
          name="drink"
          disabled={noSignInOrder.isClosed}
          onChange={_updateRow}
          onClick={_showAutoComplete}
        />
        {showAutoComplete ? (
          <div
            ref={autoCompleteRef}
            className="absolute -right-80 top-0 z-10 flex max-h-72 flex-col divide-y divide-gray-400 overflow-x-auto rounded-lg bg-white p-1 shadow-lg"
          >
            {autoCompleteList.map((dish: Dish) => {
              return (
                <button
                  key={dish.id}
                  className="flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-gray-400"
                  onClick={() => _selectDrink(dish)}
                >
                  <img
                    src={dish.photo}
                    alt="drink"
                    className="h-10 w-10 rounded-lg bg-gray-200 object-cover"
                  />
                  <div className="w-48 text-left"> {dish.name}</div>
                  <div> {dish.price.toLocaleString('en-US')}</div>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      <div
        className={clsx({
          'w-32 rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600':
            true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <input
          className={clsx({
            'w-full': true,
            'bg-gray-400': row.isTick,
          })}
          type="text"
          placeholder="No topping"
          value={row.topping}
          name="topping"
          disabled={noSignInOrder.isClosed}
          onChange={_updateRow}
        />
      </div>
      <div
        className={clsx({
          'w-14 rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600':
            true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <input
          className={clsx({
            'w-full': true,
            'bg-gray-400': row.isTick,
          })}
          type="number"
          value={row.price !== 0 ? row.price : ''}
          name="price"
          disabled={noSignInOrder.isClosed}
          onChange={_updateRow}
        />
      </div>
      <div
        className={clsx({
          'z-40 w-8 rounded-md border-2 p-1 drop-shadow-md': true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <OptionsDropdown row={row} options={SIZE_OPTIONS} field="size" />
      </div>
      <div
        className={clsx({
          'z-30 w-11 rounded-md border-2 p-1 drop-shadow-md': true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <OptionsDropdown row={row} options={PERCENTAGE_OPTIONS} field="sugar" />
      </div>
      <div
        className={clsx({
          'z-20 w-11 rounded-md border-2 p-1 drop-shadow-md': true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <OptionsDropdown row={row} options={PERCENTAGE_OPTIONS} field="ice" />
      </div>

      <div
        className={clsx({
          'z-10 w-16 rounded-md border-2 p-1 drop-shadow-md': true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <OptionsDropdown row={row} options={offerByOptions} field="offerBy" />
      </div>
      <div className="flex w-24 items-center gap-1">
        <ShowFormula transfer={transfer}>
          {row.offerBy !== '--' ? (
            <div className="absolute -top-16 right-0 z-50 flex flex-col gap-2 divide-y-2 rounded-lg bg-white p-2">
              <OfferedByFormula row={row} />
            </div>
          ) : (
            <div className="absolute -top-28 right-0 z-50 flex flex-col gap-2 divide-y-2 rounded-lg bg-white p-2">
              <TransferFormula row={row} transfer={transfer} />
              <BonusFormula />
            </div>
          )}
        </ShowFormula>
        {noSignInOrder.isClosed ? (
          <TranferTickBox row={row} />
        ) : (
          <DeleteRowButton row={row} />
        )}
      </div>
    </div>
  );
};

const OptionsDropdown = ({
  options,
  row,
  field,
}: {
  options: string[];
  row: DrinkTableRow;
  field: keyof DrinkTableRow;
}) => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const [isDropdown, setIsDropdown] = useState(false);

  const showOptions = options.filter((option: string) => option !== row[field]);

  const optionDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  const _onDropdown = () => {
    if (!noSignInOrder.isClosed) {
      setIsDropdown(true);
    }
  };

  const _updateManyRows = async (newValue: string) => {
    const updatedRows = rows.filter(
      (r: DrinkTableRow) => r.offerBy === row.name,
    );
    updatedRows.forEach(async (r: DrinkTableRow) => {
      const ref = doc(db, 'no_sign_in_orders', noSignInOrder.id, 'rows', r.id);
      await updateDoc(ref, {
        [field]: newValue,
      });
    });
  };

  const _updateRow = async (newValue: string) => {
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await updateDoc(docRef, {
      [field]: newValue,
    });
    if (field === 'offerBy') {
      _updateManyRows(newValue);
    }
    setIsDropdown(false);
  };

  return (
    <div
      ref={optionDropdownRef}
      className={clsx({ relative: true, 'bg-gray-400': row.isTick })}
    >
      <button type="button" className="w-full" onClick={_onDropdown}>
        {row[field]}
      </button>
      {isDropdown && showOptions.length !== 0 ? (
        <div
          className={clsx({
            'absolute flex flex-col items-center gap-1 bg-gray-400 p-1 rounded-lg':
              true,
            '-top-1 left-10': field === 'sugar' || field === 'ice',
            '-top-1 left-7': field === 'size',
            '-top-1 left-16': field === 'offerBy',
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

const TransferFormula = ({
  transfer,
  row,
}: {
  transfer: number | undefined;
  row: DrinkTableRow;
}) => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const quantity = rows.length;
  const bonus = (noSignInOrder.shipFee - noSignInOrder.discount) / quantity;
  const roundedBonus = Math.ceil(bonus / 500) * 500;

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

const BonusFormula = () => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const quantity = rows.length;
  const bonus = (noSignInOrder.shipFee - noSignInOrder.discount) / quantity;
  const roundedBonus = Math.ceil(bonus / 500) * 500;

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
      <div className="min-w-max">
        <div className="font-semibold">ship fee</div>
        <div>{Number(noSignInOrder.shipFee).toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>-</div>
        <div>-</div>
      </div>
      <div>
        <div className="font-semibold">discount</div>
        <div>{Number(noSignInOrder.discount).toLocaleString('en-US')}</div>
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

const TranferTickBox = ({ row }: { row: DrinkTableRow }) => {
  const { noSignInOrder } = useSelector(selector.order);

  const _onTick = async () => {
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await updateDoc(docRef, {
      isTick: !row.isTick,
    });
  };

  return (
    <button className="h-5 w-5 rounded-md bg-white" onClick={_onTick}>
      {row.isTick ? (
        <CheckIcon className="m-auto h-4 w-4 text-green-600" />
      ) : null}
    </button>
  );
};

const DeleteRowButton = ({ row }: { row: DrinkTableRow }) => {
  const { noSignInOrder } = useSelector(selector.order);

  const [isDropdown, setIsDropdown] = useState(false);

  const deleteRowButtonRef = useCheckClickOutside(() => setIsDropdown(false));

  const _deleteRow = async () => {
    const q = firestoreQuery(
      collection(db, 'no_sign_in_orders', noSignInOrder.id, 'rows'),
    );
    const queryrRows = await getDocs(q);
    queryrRows.forEach(async (_row) => {
      if (_row.data().offerBy === row.name) {
        await updateDoc(
          doc(db, 'no_sign_in_orders', noSignInOrder.id, 'rows', _row.id),
          {
            offerBy: '--',
          },
        );
      }
    });
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
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

const TableAddRowButton = () => {
  const { noSignInOrder } = useSelector(selector.order);

  const _addRow = async () => {
    if (noSignInOrder.isClosed) {
      return;
    }
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
    await addDoc(
      collection(db, 'no_sign_in_orders', noSignInOrder.id, 'rows'),
      newRow,
    );
  };
  return (
    <button
      className={clsx({
        'w-full rounded-lg px-2 py-1 drop-shadow-sm hover:drop-shadow-md': true,
        'bg-white': !noSignInOrder.isClosed,
        'bg-gray-400': noSignInOrder.isClosed,
      })}
      type="button"
      onClick={_addRow}
    >
      {noSignInOrder.isClosed ? (
        <NoSymbolIcon className="m-auto h-5 w-5" />
      ) : (
        <PlusIcon className="m-auto h-5 w-5" />
      )}
    </button>
  );
};
