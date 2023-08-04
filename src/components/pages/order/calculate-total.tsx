import { useEffect, useState } from "react";

import { Order, DrinkTableRow } from "@/types";

import { numberArraySum } from "@/utils/base";

import { PlusIcon, MinusIcon, Bars2Icon } from "@heroicons/react/24/outline";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const CalculateTotal = ({
  order,
  rows,
}: {
  order: Order;
  rows: DrinkTableRow[];
}) => {
  const [total, setTotal] = useState('');
  const [shopOwnerPay, setShopOwnerPay] = useState('');

  // use memo
  const prices = rows.map((row: DrinkTableRow) => Number(row.price));
  // use memo
  const currentTotal = numberArraySum(prices);
  const currentShopOwnerPay =
    currentTotal + Number(order.shipFee) - Number(order.discount);

  useEffect(() => {
    setTotal(currentTotal.toLocaleString("en-US"));
    setShopOwnerPay(currentShopOwnerPay.toLocaleString("en-US"));
  }, [currentTotal, currentShopOwnerPay]);

  return (
    <div className="flex items-center bg-gray-200 px-3 pt-9 pb-5 rounded-xl">
      <div className="relative w-fit">
        <div className="absolute -top-5 left-1 text-sm">Total</div>
        <div className="border-2 px-2 py-1 rounded-lg w-24 bg-gray-400">
          {total}
        </div>
      </div>
      <PlusIcon className="w-5 h-5" />
      <ShipFeeInput order={order} />
      <MinusIcon className="w-5 h-5" />
      <DiscountInput order={order} />
      <Bars2Icon className="w-5 h-5" />
      <div className="relative w-fit ml-4">
        <div className="absolute -top-5 left-1 text-sm">Shop Owner Pay</div>
        <div className="border-2 px-2 py-1 rounded-lg w-32 bg-gray-400 text-2xl text-center">
          {shopOwnerPay}
        </div>
      </div>
    </div>
  );
};

const ShipFeeInput = ({ order }: { order: Order }) => {
  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, "orders", order.id);
    // ux loading
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Ship Fee</div>
      <input
        className="border-2 px-2 py-1 rounded-lg w-24 hover:border-gray-600"
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
    const docRef = doc(db, "orders", order.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Discount</div>
      <input
        className="border-2 px-2 py-1 rounded-lg w-24 hover:border-gray-600"
        type="number"
        value={order.discount}
        name="discount"
        onChange={(e) => _updateOrder(e.target.name, e.target.value)}
      />
    </div>
  );
};
