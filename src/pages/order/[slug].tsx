import React from "react";
import { useState, useEffect } from "react";

import { DrinkTableRow, Order } from "@/types";

import { Table, CalculateTotal } from "@/components/pages";

import { ClipboardDocumentIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/outline";

import {
  doc,
  onSnapshot,
  collection,
  orderBy,
  updateDoc,
  query as firestoreQuery,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Main } from "@/templates/Main";
import { Meta } from "@/layouts/Meta";
import { Icons } from "@/images";

const OrderPage = ({ query }: { query: any }) => {
  const [order, setOrder] = useState<Order | any>({
    id: "",
    shipFee: 0,
    discount: 0,
    shopOwnerName: "",
    shopOwnerMomo: "",
    selectedMenuName: "",
    selectedMenuLink: "",
  });

  const [rows, setRows] = useState<DrinkTableRow[]>([]);

  useEffect(() => {
    _fetchOrder();
    _fetchRows();
  }, []);

  const _fetchOrder = async () => {
    const docRef = doc(db, "orders", query.slug);
    onSnapshot(docRef, (doc) => {
      setOrder({ ...doc.data(), id: doc.id });
    });
  };

  const _fetchRows = async () => {
    const rowsRef = collection(db, "orders", query.slug, "rows");
    const q = firestoreQuery(rowsRef, orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
      const updatedRows = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setRows(updatedRows);
    });
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="flex flex-col mt-12 h-screen gap-5 w-full">
        <HeaderSection order={order} />
        <SharedLink orderId={order.id} />
        <Table rows={rows} orderId={order.id} />
        <CalculateTotal order={order} />
        <div>Menu: {order.selectedsMenuName}</div>
        <div>Menu: {order.selectedMenuLink}</div>
      </div>
    </Main>
  );
};

export default OrderPage;

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};

const HeaderSection = ({ order }: { order: Order }) => {
  return (
    <div className="flex w-full gap-4 text-sm">
      <ShopOwner order={order} />
      <TranferInfo order={order} />
    </div>
  );
};

const TranferInfo = ({ order }: { order: Order }) => {
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

const ShopOwner = ({ order }: { order: Order }) => {
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

const SharedLink = ({ orderId }: { orderId: string }) => {
  const _copyClipboard = () => {
    //
  };

  return (
    <div className="flex flex-col gap-2">
      <div>Share this link :</div>
      <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg w-fit py-1 px-3">
        <div>https://we-order-omega.vercel.app/order/{orderId}</div>
        <button type="button" onClick={_copyClipboard}>
          <ClipboardDocumentIcon className="w-5 h-5" />
        </button>
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