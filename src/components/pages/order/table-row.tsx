import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { doc, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

import { BonusFormula } from './bonus-formula';
import { DeleteRowButton } from './delete-row-button';
import { OfferedByFormula } from './offered-by-formula';
import { OptionsDropdown } from './options-dropdown';
import { ShowFormula } from './show-formula';
import { TransferFormula } from './transfer-formula';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'];
const PERCENTAGE_OPTIONS = ['100%', '70%', '50%', '30%', '0%'];

export const TableRow = ({
  row,
  rowIndex,
  transfer,
}: {
  row: DrinkTableRow;
  rowIndex: any;
  transfer: number | undefined;
}) => {
  const { currentUser } = useSelector(selector.user);
  const { order } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  // useMemo here ?
  const offerByOptions = [
    '--',
    ...rows
      .filter((_row: DrinkTableRow) => _row.offerBy === '--')
      .map((_row: DrinkTableRow) => _row.name),
  ].filter((option: string) => option !== row.name && option !== '');

  const _updateRow = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await updateDoc(docRef, {
      [name]: value,
    });
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
          disabled={order.isClosed}
          onChange={_updateRow}
        />
        <div className="absolute -right-2 top-4 ">
          {/* <GiveHeart row={row} /> */}
        </div>
      </div>
      <div
        className={clsx({
          'grow rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600':
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
          disabled={order.isClosed}
          onChange={_updateRow}
        />
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
          disabled={order.isClosed}
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
          disabled={order.isClosed}
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
      <div className="flex w-28 items-center gap-1">
        <div className="w-16 rounded-sm bg-gray-400 p-1 drop-shadow-md">
          <div>{transfer?.toLocaleString('en-US')}</div>
        </div>
        <ShowFormula>
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
        {currentUser &&
        currentUser.uid === order.uid &&
        true &&
        order.isClosed ? (
          <TranferTickBox row={row} />
        ) : null}
        {!order.isClosed ? <DeleteRowButton row={row} /> : null}
      </div>
    </div>
  );
};

const TranferTickBox = ({ row }: { row: DrinkTableRow }) => {
  const { currentUser } = useSelector(selector.user);
  const { order } = useSelector(selector.order);

  const _onTick = async () => {
    if (currentUser && currentUser.uid === order.uid) {
      const docRef = doc(db, 'orders', order.id, 'rows', row.id);
      await updateDoc(docRef, {
        isTick: !row.isTick,
      });
    }
  };

  return (
    <button className="h-5 w-5 rounded-md bg-white" onClick={_onTick}>
      {row.isTick ? (
        <CheckIcon className="m-auto h-4 w-4 text-green-600" />
      ) : null}
    </button>
  );
};
