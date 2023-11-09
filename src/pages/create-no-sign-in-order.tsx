import { collection, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';

import { db } from '@/firebase';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import type { NoSignInOrder } from '@/types';

const hasSpecialCharacters = (string: string) => {
  const specialChars = /[^A-Za-z0-9-]/;
  return specialChars.test(string);
};

const CreateAnonymousOrderPage = () => {
  const [hasSpecialChars, setHasSpecialChars] = useState(false);
  const [nameIsTaken, setNameIsTaken] = useState(false);
  const [errors, setErrors] = useState<any>([]);
  const [orderName, setOrderName] = useState('');
  const [password, setPassword] = useState('');
  const [orderNamePool, setorderNamePool] = useState<any>([]);

  useEffect(() => {
    _fetchNoSignInOrder();
  }, []);

  const _onOrderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (orderNamePool.includes(value)) {
      setNameIsTaken(true);
    } else {
      setNameIsTaken(false);
    }
    if (hasSpecialCharacters(value)) {
      setHasSpecialChars(true);
    } else {
      setHasSpecialChars(false);
    }
    setOrderName(value);
  };
  const _onOrderPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
  };
  const _onCreateNoSignInOrder = async () => {
    const newErrors = [];
    const newNoSignInOrder: NoSignInOrder = {
      id: orderName,
      isClosed: false,
      shipFee: 0,
      discount: 0,
      selectedMenuName: '',
      selectedMenuLink: '',
      password,
      nickname: '--',
      momo: '',
      bank1Name: '',
      bank1Number: '',
      bank2Name: '',
      bank2Number: '',
      avatar: '',
      momoQR: '',
      bankQR: '',
    };
    if (
      orderName !== '' &&
      password !== '' &&
      !nameIsTaken &&
      !hasSpecialChars
    ) {
      const ref = doc(db, 'no_sign_in_orders', orderName);
      await setDoc(ref, newNoSignInOrder);
      setOrderName('');
      setPassword('');
      setErrors([]);
      Router.push(`/no-sign-in-order/${orderName}`);
    }
    if (orderName === '') {
      newErrors.push('noNameError');
    }
    if (password === '') {
      newErrors.push('noPasswordError');
    }
    setErrors(newErrors);
  };
  const _fetchNoSignInOrder = async () => {
    const q = query(collection(db, 'no_sign_in_orders'));
    onSnapshot(q, (snapshot) => {
      const updatedNoSignInOrder = snapshot.docs.map((_doc: any) => {
        return _doc.id;
      });
      setorderNamePool(updatedNoSignInOrder);
    });
  };
  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div>Work on progress</div>
      <div>
        <div>Choose your link name</div>
        <div>https://we-order-omega.vercel.app/no-sign-in-order/</div>
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
        {nameIsTaken && orderName !== '' ? (
          <div className="text-red-400">Name is taken</div>
        ) : null}
        {hasSpecialChars ? (
          <div className="text-red-400">
            Name should only includes A-Z, a-z, 0-9 and no space
          </div>
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
