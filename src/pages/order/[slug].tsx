import React from "react";
import { useState, useEffect } from "react";

import Link from "next/link";
import { Order, Menu } from '@/types';
import { EMPTY_ORDER } from "@/constants";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const OrderPage = ({ query }: { query: any }) => {

const [order, setOrder] = useState<Order | any>(EMPTY_ORDER)

useEffect(()=> {
  _fetchOrder()
},[])

const _fetchOrder = async () => {
  const orderRef = doc(db, "orders", query.slug)
  const orderSnapshot = await getDoc(orderRef)
  const updatedOrder = {... orderSnapshot.data(), id: orderSnapshot.id}
  setOrder(updatedOrder)
};

  return (
    <div>
      <Link href="/">Landing Page</Link>
      <Link href="/create-order/">Create Order</Link>
      <div>{query.slug}</div>
      <button type="button" onClick={_fetchOrder}>Fetch Order</button>
      <div>
        {order.menus.map((menu:Menu) => <div>
          <span>{menu.name}</span>
          <span>{menu.link}</span>
        </div> )}
      </div>
    </div>
  );
};

export default OrderPage;

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};
