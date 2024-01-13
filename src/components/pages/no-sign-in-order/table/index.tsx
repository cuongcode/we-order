import { BarsArrowDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import { debounce, range } from 'lodash';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { RowsActions, selector } from '@/redux';
import type { Dish, DrinkTableRow } from '@/types';

import { OfferedByFormula } from '../../order';
import { TableAddRowButton } from './add-row-button';
import { BonusFormula } from './bonus-formula';
import { DeleteRowButton } from './delete-row-button';
import { DropDownInput } from './drop-down-input';
import { RowInput } from './row-input';
import { ShowFormula } from './show-formula';
import { TransferFormula } from './transfer-formula';
import { TransferTickBox } from './transfer-tickbox';

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
      className={clsx(
        'flex flex-col gap-2 rounded-2xl px-8 py-5',
        noSignInOrder.isClosed ? 'bg-main-cbg' : 'bg-main-bg',
      )}
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
    <div className="mb-2 flex w-full items-center gap-1 border-b border-b-gray-800 pb-2 text-xs font-semibold">
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
      className={clsx(
        'flex w-full items-center gap-1 rounded-md text-xs',
        row.isTick ? 'bg-gray-400' : '',
      )}
    >
      <div className="w-3">{rowIndex}</div>
      <RowInput
        name="name"
        value={row.name}
        disabled={noSignInOrder.isClosed}
        onChange={_updateRow}
        isTick={row.isTick}
        className="w-14"
      />

      <RowInput
        name="drink"
        value={row.drink.toUpperCase()}
        disabled={noSignInOrder.isClosed}
        onChange={_updateRow}
        onClick={_showAutoComplete}
        isTick={row.isTick}
        className="relative z-50 grow"
        placeholder="Type Here"
      >
        {showAutoComplete ? (
          <div
            ref={autoCompleteRef}
            className="absolute -right-80 top-0 z-10 flex max-h-72 flex-col divide-y divide-main-bg overflow-x-auto rounded-lg bg-main-cbg p-1 shadow-lg"
          >
            {autoCompleteList?.map((dish: Dish) => {
              return (
                <button
                  key={dish.id}
                  className="flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-gray-800"
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
      </RowInput>

      <RowInput
        className="w-32"
        placeholder="No topping"
        value={row.topping}
        name="topping"
        disabled={noSignInOrder.isClosed}
        onChange={_updateRow}
        isTick={row.isTick}
      />

      <RowInput
        className="w-14"
        type="number"
        value={row.price !== 0 ? row.price : ''}
        name="price"
        disabled={noSignInOrder.isClosed}
        onChange={_updateRow}
        isTick={row.isTick}
      />
      <DropDownInput
        className="z-40 w-8"
        isTick={row.isTick}
        row={row}
        field="size"
        options={SIZE_OPTIONS}
      />
      <DropDownInput
        className="z-30 w-11"
        isTick={row.isTick}
        row={row}
        field="sugar"
        options={PERCENTAGE_OPTIONS}
      />
      <DropDownInput
        className="z-20 w-11"
        isTick={row.isTick}
        row={row}
        field="ice"
        options={PERCENTAGE_OPTIONS}
      />
      <DropDownInput
        className="z-10 w-16"
        isTick={row.isTick}
        row={row}
        field="offerBy"
        options={offerByOptions}
      />
      <div className="flex w-24 items-center gap-1">
        <ShowFormula transfer={transfer}>
          {row.offerBy !== '--' ? (
            <div className="absolute -top-16 right-0 z-50 flex flex-col gap-2 divide-y-2 rounded-lg bg-main-cbg p-2">
              <OfferedByFormula row={row} />
            </div>
          ) : (
            <div className="absolute -top-28 right-0 z-50 flex flex-col gap-2 divide-y-2 rounded-lg bg-main-cbg p-2">
              <TransferFormula row={row} transfer={transfer} />
              <BonusFormula />
            </div>
          )}
        </ShowFormula>
        {noSignInOrder.isClosed ? (
          <TransferTickBox row={row} />
        ) : (
          <DeleteRowButton row={row} />
        )}
      </div>
    </div>
  );
};
