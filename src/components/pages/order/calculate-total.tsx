import { Bars2Icon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { DrinkTableRow, Order } from '@/types';
import { numberArraySum } from '@/utils/base';

export const CalculateTotal = ({ rows }: { rows: DrinkTableRow[] }) => {
  const [total, setTotal] = useState('');
  const [shopOwnerPay, setShopOwnerPay] = useState('');

  const { order } = useSelector(selector.order);

  // use memo
  const prices = rows.map((row: DrinkTableRow) => Number(row.price));
  // use memo
  const currentTotal = numberArraySum(prices);
  const currentShopOwnerPay =
    currentTotal + Number(order.shipFee) - Number(order.discount);

  useEffect(() => {
    setTotal(currentTotal.toLocaleString('en-US'));
    setShopOwnerPay(currentShopOwnerPay.toLocaleString('en-US'));
  }, [currentTotal, currentShopOwnerPay]);

  return (
    <div className="flex items-center rounded-xl bg-gray-200 px-3 pb-5 pt-9">
      <div className="relative w-fit">
        <div className="absolute -top-5 left-1 text-sm">Total</div>
        <div className="w-24 rounded-lg border-2 bg-gray-400 px-2 py-1">
          {total}
        </div>
      </div>
      <PlusIcon className="h-5 w-5" />
      <ShipFeeInput order={order} />
      <MinusIcon className="h-5 w-5" />
      <DiscountInput order={order} />
      <Bars2Icon className="h-5 w-5" />
      <div className="relative ml-4 w-fit">
        <div className="absolute -top-5 left-1 text-sm">Shop Owner Pay</div>
        <div className="w-32 rounded-lg border-2 bg-gray-400 px-2 py-1 text-center text-2xl">
          {shopOwnerPay}
        </div>
      </div>
    </div>
  );
};

const ShipFeeInput = ({ order }: { order: Order }) => {
  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, 'orders', order.id);
    // ux loading
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Ship Fee</div>
      <input
        className="w-24 rounded-lg border-2 px-2 py-1 hover:border-gray-600"
        type="number"
        value={order.shipFee}
        name="shipFee"
        // {name, value} = e.target
        onChange={(e) => _updateOrder(e.target.name, e.target.value)}
      />
    </div>
  );
};

const DiscountInput = ({ order }: { order: Order }) => {
  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, 'orders', order.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Discount</div>
      <input
        className="w-24 rounded-lg border-2 px-2 py-1 hover:border-gray-600"
        type="number"
        value={order.discount}
        name="discount"
        onChange={(e) => _updateOrder(e.target.name, e.target.value)}
      />
    </div>
  );
};
