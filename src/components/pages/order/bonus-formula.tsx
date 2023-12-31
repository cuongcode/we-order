import { useSelector } from 'react-redux';

import { selector } from '@/redux';

export const BonusFormula = () => {
  const { order } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const quantity = rows.length;
  const bonus = (order.shipFee - order.discount) / quantity;
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
