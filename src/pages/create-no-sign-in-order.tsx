import { collection, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';

import { db } from '@/firebase';
import { LogoImages } from '@/images';
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
      <div className="mt-12 flex h-fit w-full flex-col items-center 2xl:flex-row 2xl:items-start 2xl:gap-5">
        <div className="flex w-full max-w-4xl flex-col 2xl:w-1/2">
          <div className="mb-20 w-full">
            <img
              className="m-auto w-1/2"
              src={LogoImages.title_logo.src}
              alt="title-logo"
            />
          </div>

          <div className="flex w-full flex-col gap-4 text-sm">
            <div className="m-auto flex flex-col gap-2">
              <div className="relative">
                <div className="text-lg font-semibold">
                  Pick your link&#39;s name
                </div>
                <div className="flex gap-1">
                  <div>https://we-order-omega.vercel.app/no-sign-in-order/</div>
                  <div className="w-64 rounded-md border-2 px-2">
                    <input
                      type="text"
                      placeholder="john-cena"
                      className="w-full"
                      value={orderName}
                      onChange={_onOrderNameChange}
                    />
                  </div>
                </div>
                <div className="absolute">
                  {errors.includes('noNameError') ? (
                    <div className="text-red-400">Please input a name</div>
                  ) : null}
                  {nameIsTaken && orderName !== '' ? (
                    <div className="text-red-400">Name is taken</div>
                  ) : null}
                  {hasSpecialChars ? (
                    <div className="text-red-400">
                      Name should only includes A-Z, a-z, 0-9 or &#39;-&#39; and
                      no space
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative mt-10">
                <div className="text-lg font-semibold">Enter a password</div>
                <div className="w-64 rounded-md border-2 px-2">
                  <input
                    type="text"
                    placeholder="12345"
                    className="w-full"
                    value={password}
                    onChange={_onOrderPasswordChange}
                  />
                </div>
                <div className="absolute">
                  {errors.includes('noPasswordError') ? (
                    <div className="text-red-400">Please input a password</div>
                  ) : null}
                </div>
              </div>
              <div className="mt-10 flex justify-center">
                <button
                  className="rounded-lg bg-gray-200 p-4 text-lg hover:bg-gray-400"
                  onClick={_onCreateNoSignInOrder}
                >
                  Create Order Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default CreateAnonymousOrderPage;
