import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';

import { auth, db } from '@/firebase';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import type { Order } from '@/types';

const CreateOrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  console.log(
    '🚀 ~ file: create-order.tsx:13 ~ CreateOrderPage ~ auth.currentUser:',
    auth.currentUser,
  );
  useEffect(() => {
    _fetchOrders();
  }, []);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       _fetchUser(user.uid);
  //     }
  //   });
  // }, []);

  // const _fetchUser = async (uid: string) => {
  //   const docRef = doc(db, 'users', uid);
  //   onSnapshot(docRef, (_doc) => {
  //     const updatedCurrentUser: User = {
  //       uid: _doc.data()?.uid,
  //       nickname: _doc.data()?.nickname,
  //       momo: _doc.data()?.momo,
  //       bank1Name: _doc.data()?.bank1Name,
  //       bank1Number: _doc.data()?.bank1Number,
  //       bank2Name: _doc.data()?.bank2Name,
  //       bank2Number: _doc.data()?.bank2Number,
  //     };
  //     dispatch(UserActions.setCurrentUser(updatedCurrentUser));
  //   });
  // };

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

// const UserName = () => {
//   const [nickname, setNickname] = useState('');

//   const { currentUser } = useSelector(selector.user);

//   const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setNickname(value);
//   };

//   const _updateUserName = async () => {
//     if (currentUser) {
//       const docRef = doc(db, 'users', currentUser?.uid);
//       await updateDoc(docRef, {
//         nickname,
//       });
//     }
//   };

//   return (
//     <div>
//       <input type="text" value={nickname} onChange={_onChange} />
//       <button onClick={_updateUserName}>Save</button>
//     </div>
//   );
// };
