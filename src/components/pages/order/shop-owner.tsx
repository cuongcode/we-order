import { useState } from "react";

import { Order } from "@/types";

import { Icons } from "@/images";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/outline";

import { db } from "@/firebase";
import {
  doc,
  updateDoc,
} from "firebase/firestore";


export const ShopOwner = ({ order }: { order: Order }) => {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 bg-white w-36 h-40 py-3 px-3 drop-shadow-md">
      <div className="font-bold">SHOP OWNER</div>
      <div className="bg-gray-200 rounded-full p-1 w-20 mt-2">
        <img
          className="rounded-full bg-gray-200"
          src={Icons.user_icon.src}
          alt="user-icon"
        />
      </div>
      <div className="mt-1">
        <ShopOwnerNameInput order={order} />
      </div>
    </div>
  );
};

const ShopOwnerNameInput = ({ order }: { order: Order }) => {
  const [isEdit, setIsEdit] = useState(false);
  const _updateOrder = async (field: string, newValue: any) => {
    const docRef = doc(db, "orders", order.id);
    await updateDoc(docRef, {
      [field]: newValue,
    });
  };
  return (
    <div className="relative">
      {isEdit ? (
        <>
        <input
          className="h-6 border-2 w-20 text-center rounded-md hover:border-gray-600"
          type="text"
          value={order.shopOwnerName}
          name="shopOwnerName"
          onChange={(e) => _updateOrder(e.target.name, e.target.value)}
        />
        <button
            className="absolute top-0 -right-5"
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            <CheckIcon className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <div className="h-6 border-2 w-20 text-center border-white">{order.shopOwnerName}</div>
          <button
            className="absolute top-1 -right-5"
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