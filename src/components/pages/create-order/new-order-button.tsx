import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { Menu, Order } from '@/types';

export const NewOrderButton = ({
  orders,
  selectedMenu,
}: {
  orders: Order[];
  selectedMenu: Menu;
}) => {
  const [error, setError] = useState<string>('');
  const { currentUser } = useSelector(selector.user);

  const _createOrder = async () => {
    if (currentUser) {
      if (selectedMenu.name === '') {
        setError('Please select a menu');
        return;
      }
      if (orders.length === 10) {
        setError('You have got your maximum number of orders');
        return;
      }
      const newOrder = {
        timestamp: serverTimestamp(),
        shipFee: 0,
        discount: 0,
        selectedMenuName: selectedMenu.name,
        selectedMenuLink: selectedMenu.link,
        uid: currentUser.uid,
        isClosed: false,
        heart: 0,
      };
      await addDoc(collection(db, 'orders'), newOrder);
      setError('');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={_createOrder}
        className="w-full rounded-lg bg-gray-200 py-2 hover:bg-gray-400"
      >
        New Order
      </button>
      {error !== '' ? (
        <div className="absolute text-red-500">{error}</div>
      ) : null}
    </div>
  );
};
