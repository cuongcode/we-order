import clsx from 'clsx';
import { range } from 'lodash';
import { useSelector } from 'react-redux';

import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

import { TableAddRowButton } from './table-add-row-button';
import { TableHeader } from './table-header';
import { TableRow } from './table-row';

export const Table = () => {
  const { order } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const quanity = rows.length;
  const bonus = (Number(order.shipFee) - Number(order.discount)) / quanity;
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
        'bg-gray-200': !order.isClosed,
        'bg-gray-400': order.isClosed,
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
          />
        ))}
      </div>
      <TableAddRowButton />
    </div>
  );
};
