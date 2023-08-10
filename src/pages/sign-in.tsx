import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import router from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';

import { auth, db, provider } from '@/firebase';
import { Icons, LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { UserActions } from '@/redux';
import { Main } from '@/templates/Main';
import type { User } from '@/types';

const SignIn = () => {
  const dispatch = useDispatch();

  const _onSignIn = async () => {
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const firestoreUser: User = {
        uid: docSnap.data()?.uid,
        nickname: docSnap.data()?.nickname,
        momo: docSnap.data()?.momo,
        bank1Name: docSnap.data()?.bank1Name,
        bank1Number: docSnap.data()?.bank1Number,
        bank2Name: docSnap.data()?.bank2Name,
        bank2Number: docSnap.data()?.bank2Number,
      };
      dispatch(UserActions.setCurrentUser(firestoreUser));
    } else {
      const newUser: User = {
        uid: user.uid,
        nickname: user.displayName,
        momo: '',
        bank1Name: '',
        bank1Number: '',
        bank2Name: '',
        bank2Number: '',
      };
      await setDoc(docRef, newUser);
      dispatch(UserActions.setCurrentUser(newUser));
    }
    router.push('/create-order/');
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="m-auto max-w-5xl font-semibold">
        <div className="mb-3 mt-12 w-full">
          <img
            className="m-auto w-1/2"
            src={LogoImages.title_logo.src}
            alt="title-logo"
          />
        </div>
        <div className="text-center text-lg">
          An easy way to order drink and food together
        </div>
        <div className="text-center text-lg">Order together is fun !</div>
        <div className="mt-12 flex items-center justify-center gap-8">
          <button
            onClick={_onSignIn}
            className="flex w-60 flex-col items-center gap-2 rounded-2xl bg-gray-200 py-3 hover:bg-gray-400"
          >
            <div className="w-10 rounded-full">
              <img src={Icons.google_icon.src} alt="user-icon" />
            </div>
            <div>Sign in with Google</div>
          </button>
          <button className="flex w-60 flex-col items-center gap-2 rounded-2xl bg-gray-200 py-3 hover:bg-gray-400">
            <div className="w-10 rounded-full">
              <img src={Icons.user_icon.src} alt="user-icon" />
            </div>
            <div>Sign in as Anonymous</div>
          </button>
        </div>
      </div>
    </Main>
  );
};

export default SignIn;
