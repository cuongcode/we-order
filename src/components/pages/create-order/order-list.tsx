import dayjs from 'dayjs';
import Router from 'next/router';

import type { Order } from '@/types';

import { DeleteOrderButton } from './delete-order-button';

export const OrderList = ({ orders }: { orders: Order[] }) => {
  const _openOrder = (id: string | null) => {
    Router.push(`/order/${id}`);
  };

  return (
    <div>
      <div className="mb-3 text-center font-semibold">MY ORDERS</div>
      <div className="flex flex-col gap-1">
        {orders.length === 0
          ? 'You have no order. Create one!'
          : orders.map((order: Order) => (
              <div key={order.id} className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => _openOrder(order.id)}
                  className="w-fit"
                >
                  {order.selectedMenuName}
                </button>
                <div className="flex items-center gap-1">
                  <div className="text-sm font-extralight text-gray-500">
                    {dayjs
                      .unix(order.timestamp?.seconds)
                      .format('hh:mm, ddd-DD-MMM-YYYY')}
                  </div>
                  <DeleteOrderButton order={order} />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
