import { BarsArrowDownIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';

import { RowsActions, selector } from '@/redux';
import type { DrinkTableRow } from '@/types';

export const TableHeader = () => {
  const { order } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);
  const dispatch = useDispatch();

  const _SortDrinkName = () => {
    const sortedRows = [...rows];
    sortedRows.sort((rowA: DrinkTableRow, rowB: DrinkTableRow) => {
      const x = rowA.drink.toLowerCase();
      const y = rowB.drink.toLowerCase();
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
      <div className="w-2" />
      <div className="w-14">Name</div>
      <div className="flex grow items-center gap-2">
        <div>Drink</div>
        {order.isClosed ? (
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
      <div className="w-28">Transfer</div>
    </div>
  );
};
