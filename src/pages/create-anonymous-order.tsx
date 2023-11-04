import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';

import { db } from '@/firebase';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import type { NoSignInOrder } from '@/types';

const CreateAnonymousOrderPage = () => {
  const [errors, setErrors] = useState<any>([]);
  const [orderName, setOrderName] = useState('');
  const [password, setPassword] = useState('');
  // const [orderNamePool, setorderNamePool] = useState<any>([]);

  // useEffect(() => {
  //   _fetchOrders();
  // }, []);

  const _onOrderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setOrderName(value);
  };
  const _onOrderPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
  };
  const _onCreateNoSignInOrder = async () => {
    const newNoSignInOrder: NoSignInOrder = {
      id: orderName,
      isClosed: false,
      shipFee: 0,
      discount: 0,
      selectedMenuName: '',
      selectedMenuLink: '',
      password,
    };
    if (orderName !== '' && password !== '') {
      const ref = doc(db, 'no_sign_in_orders', orderName);
      await setDoc(ref, newNoSignInOrder);
      setOrderName('');
      setPassword('');
      setErrors([]);
    }
    const newErrors = [];
    if (orderName === '') {
      newErrors.push('noNameError');
    }
    if (password === '') {
      newErrors.push('noPasswordError');
    }
    setErrors(newErrors);
  };
  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div>Work on progress</div>
      <div>
        <div>Choose your link name. No space and special character.</div>
        <div>https://we-order-omega.vercel.app/order/</div>
        <div className="w-64 rounded-md border-2 bg-red-300">
          <input
            type="text"
            placeholder="Enter a name for your link"
            className="w-full"
            value={orderName}
            onChange={_onOrderNameChange}
          />
        </div>
        {errors.includes('noNameError') ? (
          <div className="text-red-400">Please input a name</div>
        ) : null}
        <div>
          Enter a password (easy one). It will prevent other people to edit your
          order
        </div>
        <div className="w-64 rounded-md border-2 bg-red-300">
          <input
            type="text"
            placeholder="Enter an easy password"
            className="w-full"
            value={password}
            onChange={_onOrderPasswordChange}
          />
        </div>
        {errors.includes('noPasswordError') ? (
          <div className="text-red-400">Please input a password</div>
        ) : null}
        <div className="w-fit rounded-md bg-gray-200 px-2 py-1 hover:bg-gray-400">
          <button onClick={_onCreateNoSignInOrder}>Create Order Page</button>
        </div>
        <div>
          When your order has been created, you can always reuse it or create a
          new one.
        </div>
      </div>
    </Main>
  );
};

export default CreateAnonymousOrderPage;

// `https://we-order-omega.vercel.app/order/${order.id}`,

// const _openOrder = (id: string | null) => {
//   Router.push(`/order/${id}`);
// };

// const _createOrder = async () => {
//   if (currentUser) {
//     if (selectedMenu.name === '') {
//       setError('Please select a menu');
//       return;
//     }
//     if (orders.length === 10) {
//       setError('You have got your maximum number of orders');
//       return;
//     }
//     const newOrder = {
//       timestamp: serverTimestamp(),
//       shipFee: 0,
//       discount: 0,
//       selectedMenuName: selectedMenu.name,
//       selectedMenuLink: selectedMenu.link,
//       uid: currentUser.uid,
//       isClosed: false,
//       heart: 0,
//     };
//     await addDoc(collection(db, 'orders'), newOrder);
//     setError('');
//   }
// };

// const _fetchOrders = async () => {
//   if (currentUser) {
//     const q = query(
//       collection(db, 'orders'),
//       where('uid', '==', currentUser.uid),
//       orderBy('timestamp', 'desc'),
//     );
//     onSnapshot(q, (snapshot) => {
//       const updatedOrders = snapshot.docs.map((_doc: any) => {
//         return { ..._doc.data(), id: _doc.id };
//       });
//       setOrders(updatedOrders);
//     });
//   }
// };
