import { collection, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import Router from 'next/router';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import { BaseInput, Button } from '@/components/base';
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
    if (value !== '') {
      const newError = errors.filter((i: any) => i !== 'noNameError');
      setErrors(newError);
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
      <div className="m-auto flex max-w-5xl flex-col font-semibold">
        <div className="flex w-full flex-col gap-4 text-sm">
          <div className="m-auto flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <Input
                title="Pick a name"
                value={orderName}
                placeholder="john-cena"
                onChange={_onOrderNameChange}
                prefix="https://we-order-omega.vercel.app/no-sign-in-order/"
                errorText={
                  <>
                    {errors.includes('noNameError') ? (
                      <div className="text-red-400">Please input a name</div>
                    ) : null}
                    {nameIsTaken && orderName !== '' ? (
                      <div className="text-red-400">Name is taken</div>
                    ) : null}
                    {hasSpecialChars ? (
                      <div className="text-red-400">
                        Name should only includes A-Z, a-z, 0-9 or &#39;-&#39;
                        and no space
                      </div>
                    ) : null}
                  </>
                }
              />
              <Input
                title="Enter a password"
                value={password}
                placeholder="example: 123456"
                onChange={_onOrderPasswordChange}
                errorText={
                  errors.includes('noPasswordError') ? (
                    <div className="text-red-400">Please input a password</div>
                  ) : null
                }
              />
            </div>
            <Button
              text="Create Order Page"
              className="self-center"
              onClick={_onCreateNoSignInOrder}
            />
          </div>
        </div>
      </div>
    </Main>
  );
};

export default CreateAnonymousOrderPage;

const Input = ({
  title,
  value,
  onChange,
  errorText,
  prefix,
  placeholder,
}: {
  title: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  errorText: ReactNode;
  prefix?: string;
  placeholder?: string;
}) => {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex">
        <div className="text-base font-medium">{title}</div>
        <div className="text-violet-500">*</div>
      </div>
      <div className="flex items-center gap-2">
        <BaseInput
          placeholder={placeholder}
          errorText={errorText}
          value={value}
          onChange={onChange}
          prefix={prefix}
        />
      </div>
    </div>
  );
};
