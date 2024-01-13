import { useSelector } from 'react-redux';

import { selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

export const TransferFormula = ({
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
    <div className="flex gap-1 px-5 py-3">
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
