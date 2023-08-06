import { range } from 'lodash';
import { useSelector } from 'react-redux';

import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

import { TableAddRowButton } from './table-add-row-button';
import { TableHeader } from './table-header';
import { TableRow } from './table-row';

export const Table = ({ rows }: { rows: DrinkTableRow[] }) => {
  const { redux_order } = useSelector(selector.order);

  const quanity = rows.length;
  const bonus =
    (Number(redux_order.shipFee) - Number(redux_order.discount)) / quanity;
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
          <TableRow
            key={row.id}
            row={row}
            order={redux_order}
            rows={rows}
            rowIndex={numberArray[index]}
            transfer={transferList[index]}
          />
        ))}
      </div>
      <TableAddRowButton orderId={redux_order.id} />
    </div>
  );
};
