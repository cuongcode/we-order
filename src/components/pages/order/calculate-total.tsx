import { Order } from "@/types";

import {
  PlusIcon,
  MinusIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";

import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export const CalculateTotal = ({
  order,
}: {
  order: Order;
}) => {
  return (
    <div className="flex items-center bg-gray-200 px-3 pt-9 pb-5 rounded-xl">
      <div className="relative w-fit">
        <div className="absolute -top-5 left-1 text-sm">Total</div>
        <div className="border-2 px-2 py-1 rounded-lg w-24 bg-gray-400">
          360000
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
          320000
        </div>
      </div>
    </div>
  );
};

const ShipFeeInput = ({
  order,
}: {
  order: Order;
}) => {
  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, "orders", order.id);
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
        onChange={(e) => _updateOrder(e.target.name, e.target.value)}
      />
    </div>
  );
};

const DiscountInput = ({
  order,
}: {
  order: Order;
}) => {
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