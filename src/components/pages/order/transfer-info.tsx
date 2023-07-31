import { useState } from "react";

import { Order } from "@/types";

import { PencilIcon, CheckIcon } from "@heroicons/react/24/outline";

import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const TranferInfo = ({ order }: { order: Order }) => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl border-2 bg-white w-56 h-40 py-3 px-3 drop-shadow-md">
      <div className="font-bold">TRANSFER INFO</div>
      <div className="flex flex-col gap-2 items-start w-full">
        <div className="flex w-full items-center h-6">
          <div className="w-11">Momo</div>
          <div className="mr-2">:</div>
          <div className="grow">
            <ShopOwnerMomoInput order={order} />
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-11">Bank</div>
          <div>:</div>
        </div>
      </div>
    </div>
  );
};

const ShopOwnerMomoInput = ({ order }: { order: Order }) => {
  const [isEdit, setIsEdit] = useState(false);

  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, "orders", order.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="flex justify-between items-center">
      {isEdit ? (
        <>
          <input
            className="border-2 px-1 rounded-md w-28 hover:border-gray-600"
            type="text"
            value={order.shopOwnerMomo}
            name="shopOwnerMomo"
            onChange={(e) => _updateOrder(e.target.name, e.target.value)}
          />
          <button
            className=""
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            <CheckIcon className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <div className="border-2 px-1 rounded-md w-28 border-white">
            {order.shopOwnerMomo}
          </div>
          <button
            className=""
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            <PencilIcon className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
};
