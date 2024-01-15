import { Bars2Icon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { DrinkTableRow, NoSignInOrder } from '@/types';
import { numberArraySum } from '@/utils/base';

export const CalculateTotal = () => {
  const [total, setTotal] = useState('');
  const [shopOwnerPay, setShopOwnerPay] = useState('');

  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  // use memo
  const prices = rows.map((row: DrinkTableRow) => Number(row.price));
  // use memo
  const currentTotal = numberArraySum(prices);
  const currentShopOwnerPay =
    currentTotal +
    Number(noSignInOrder.shipFee) -
    Number(noSignInOrder.discount);

  useEffect(() => {
    setTotal(currentTotal.toLocaleString('en-US'));
    setShopOwnerPay(currentShopOwnerPay.toLocaleString('en-US'));
  }, [currentTotal, currentShopOwnerPay]);

  return (
    <div className="flex items-center rounded-xl bg-main-bg px-3 pb-5 pt-9">
      <div className="relative w-fit">
        <div className="absolute -top-5 left-1 text-sm">Total</div>
        <div className="w-24 rounded-lg bg-main-cbg px-2 py-1">{total}</div>
      </div>
      <PlusIcon className="h-5 w-5" />
      <ShipFeeInput noSignInOrder={noSignInOrder} />
      <MinusIcon className="h-5 w-5" />
      <DiscountInput noSignInOrder={noSignInOrder} />
      <Bars2Icon className="h-5 w-5" />
      <div className="relative ml-4 w-fit">
        <div className="absolute -top-5 left-1 text-sm">Shop Owner Pay</div>
        <div className="w-32 rounded-lg bg-main-cbg px-2 py-1 text-center text-2xl">
          {shopOwnerPay}
        </div>
      </div>
    </div>
  );
};

const ShipFeeInput = ({ noSignInOrder }: { noSignInOrder: NoSignInOrder }) => {
  const _updateOrder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      [name]: value,
    });
  };
  return (
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Ship Fee</div>
      <input
        className="w-24 rounded-lg bg-main-cbg px-2 py-1 hover:border-gray-600"
        type="number"
        value={noSignInOrder.shipFee}
        name="shipFee"
        onChange={_updateOrder}
      />
    </div>
  );
};

const DiscountInput = ({ noSignInOrder }: { noSignInOrder: NoSignInOrder }) => {
  const _updateOrder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      [name]: value,
    });
  };
  return (
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Discount</div>
      <input
        className="w-24 rounded-lg bg-main-cbg px-2 py-1 hover:border-gray-600"
        type="number"
        value={noSignInOrder.discount}
        name="discount"
        onChange={_updateOrder}
      />
    </div>
  );
};
