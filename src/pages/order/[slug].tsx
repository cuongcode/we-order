import React from "react";
import { useState, useEffect } from "react";

import { useCheckClickOutside } from "@/hooks";

import { DrinkTableRow, Order, Menu } from "@/types";

import { PlusIcon } from "@heroicons/react/24/outline";

import {
  Table,
  CalculateTotal,
  ShopOwner,
  TranferInfo,
  SharedLink,
} from "@/components/pages/order";

import {
  doc,
  onSnapshot,
  collection,
  orderBy,
  query as firestoreQuery,
} from "firebase/firestore";
import { db } from "@/firebase";

import { Main } from "@/templates/Main";
import { Meta } from "@/layouts/Meta";

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
      <div className="flex flex-col mt-12 h-fit w-full lg:flex lg:flex-row lg:gap-5">
        <div className="flex flex-col lg:grow">
          <div className="mb-10 flex w-full gap-4 text-sm">
            <ShopOwner order={order} />
            <TranferInfo order={order} />
          </div>
          <div className="mb-10">
            <SharedLink orderId={order.id} />
          </div>
          <div className="mb-5">
            <Table rows={rows} order={order} />
          </div>
          <div className="mb-10">
            <CalculateTotal order={order} rows={rows} />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-2/5">
          <MenusDropdown order={order} />
          <iframe
            src={order.selectedMenuLink}
            className="w-full h-screen border-2 p-5 rounded-xl"
          />
        </div>
      </div>
    </Main>
  );
};

export default OrderPage;

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};

const MenusDropdown = ({ order }: { order: Order }) => {
  const [isDropdown, setIsDropdown] = useState(false);

  const dropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  return (
    <div className="relative">
      <button
        type="button"
        className="w-fit bg-gray-200 px-3 py-2 rounded-lg drop-shadow-md"
        onClick={() => setIsDropdown(true)}
      >
        {order.selectedMenuName}
      </button>
      {isDropdown ? (
        <div
          ref={dropdownRef}
          className="absolute top-12 flex flex-col gap-2 bg-gray-200 rounded-lg p-2"
        >
          <AddMenuForm />
          <Menus />
        </div>
      ) : null}
    </div>
  );
};

const Menus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    _fetchMenus();
  }, []);

  const _fetchMenus = async () => {
    onSnapshot(collection(db, "menus"), (snapshot) => {
      const updatedMenus = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setMenus(updatedMenus);
    });
  };

  const _selectMenu = () => {
    //
  };

  return (
    <div className="flex flex-wrap gap-2">
      {menus.map((menu: Menu) => (
        <button
          className="px-3 py-1 rounded-lg bg-white hover:bg-gray-400"
          type="button"
          key={menu.id}
          onClick={_selectMenu}
        >
          {menu.name}
        </button>
      ))}
    </div>
  );
};

const AddMenuForm = () => {
  return (
    <div className="flex gap-2 items-center">
      <div>Name:</div>
      <input
        className="px-1 rounded-md border-2 hover:border-gray-600 w-28"
        type="text"
        placeholder="menu name"
      />
      <div>Link:</div>
      <input
        className="px-1 rounded-md border-2 hover:border-gray-600 w-56"
        type="text"
        placeholder="paste link here"
      />
      <button
        type="button"
        className="p-1 bg-white rounded-md hover:bg-gray-400"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
