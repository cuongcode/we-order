import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { Order } from "@/types";
import { NEW_ORDER } from "@/constants";
import Router from "next/router";

const CreateOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    _fetchOrders();
  }, []);

  const _fetchOrders = async () => {
    const query = collection(db, "orders");
    onSnapshot(query, (snapshot) => {
      const updatedOrders = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setOrders(updatedOrders);
    });
  };

  const _createOrder = async () => {
    await addDoc(collection(db, "orders"), NEW_ORDER);
    _fetchOrders();
    // Router.push(`/order/${orderDoc.id}`);
  };

  const _openOrder = (id: string | null) => {
    Router.push(`/order/${id}`);
  };

  return (
    <div>
      <Link href="/">Landing Page</Link>
      <div>Anonymous</div>
      <button type="button" onClick={_createOrder}>
        Create Order
      </button>
      <div className="flex flex-col">
        {orders.map((order: Order) => (
          <button
            type="button"
            key={order.id}
            onClick={() => _openOrder(order.id)}
          >
            {order.id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreateOrderPage;
