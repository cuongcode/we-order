import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';

import { db } from '@/firebase';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import type { Order } from '@/types';

const CreateOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    _fetchOrders();
  }, []);

  const _fetchOrders = async () => {
    const query = collection(db, 'orders');
    onSnapshot(query, (snapshot) => {
      const updatedOrders = snapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
      setOrders(updatedOrders);
    });
  };

  const _createOrder = async () => {
    const newOrder = {
      shipFee: 0,
      discount: 0,
      shopOwnerName: '',
      shopOwnerMomo: '',
      selectedMenuName: '',
      selectedMenuLink: '',
    };
    await addDoc(collection(db, 'orders'), newOrder);
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="flex w-96 flex-col gap-4 bg-green-100">
        <button type="button" onClick={_createOrder}>
          Create Order
        </button>
        <OrderList orders={orders} />
      </div>
    </Main>
  );
};

export default CreateOrderPage;

const OrderList = ({ orders }: { orders: Order[] }) => {
  const _openOrder = (id: string | null) => {
    Router.push(`/order/${id}`);
  };
  return (
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
  );
};
