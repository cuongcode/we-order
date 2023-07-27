import React from "react";
import { useState, useEffect } from "react";

import Link from "next/link";
import { Order, Menu } from "@/types";
import { EMPTY_ORDER, NEW_DRINK_TABLE } from "@/constants";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const OrderPage = ({ query }: { query: any }) => {
  const [order, setOrder] = useState<Order | any>(EMPTY_ORDER);
  const [table, setTable] = useState<any>(NEW_DRINK_TABLE);

  useEffect(() => {
    _fetchOrder();
  }, []);

  //fail here
  useEffect(() => {
    if (order.tableDataId)
    _fetchTableData(order)
  }, []);

  // const _fetchOrders = async () => {
  //   const query = collection(db, "orders");
  //   onSnapshot(query, (snapshot) => {
  //     const updatedOrders = snapshot.docs.map((doc: any) => {
  //       return { ...doc.data(), id: doc.id };
  //     });
  //     setOrders(updatedOrders);
  //   });
  // };

  const _fetchOrder = async () => {
    const orderRef = doc(db, "orders", query.slug);
    const orderSnapshot = await getDoc(orderRef);
    const updatedOrder = { ...orderSnapshot.data(), id: orderSnapshot.id };
    setOrder(updatedOrder);
    _fetchTableData(updatedOrder)
  };

  const _fetchTableData = async (fetchOrder:any) => {
    const tableRef = doc(db, "table-data", fetchOrder.tableDataId);
    const tableSnapshot = await getDoc(tableRef);
    const updatedTable = { ...tableSnapshot.data(), id: tableSnapshot.id };
    setTable(updatedTable);
  };

const _test = async () => {
  const updatedTable = {...table, shipFee: table.shipFee + 1}
  const tableRef = doc(db, "table-data", table.id);
  await updateDoc(tableRef, updatedTable)
}

  return (
    <div>
      <Link href="/">Landing Page</Link>
      <Link href="/create-order/">Create Order</Link>
      <div>{query.slug}</div>
      <button type="button" onClick={_fetchOrder}>
        Fetch Order
      </button>
      <div>
        {order.menus.map((menu: Menu) => (
          <div className="flex flex-col">
            <span>{menu.name}</span>
            <span>{menu.link}</span>
          </div>
        ))}
      </div>
      <div>Table Id: {table.id}</div>
      <div>Ship fee: {table.shipFee}</div>
      <button type="button" onClick={_test}>Ship fee + 1</button>
      <div>Discount: {table.discount}</div>
    </div>
  );
};

export default OrderPage;

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};
