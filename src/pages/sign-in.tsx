import router from 'next/router';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Button, Text } from '@/components/base';
import { Icons } from '@/images';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const SignIn = () => {
  // const dispatch = useDispatch();

  // const _onSignIn = async () => {
  //   const result = await signInWithPopup(auth, provider);
  //   const { user } = result;
  //   const docRef = doc(db, 'users', user.uid);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     const firestoreUser: User = {
  //       uid: docSnap.data()?.uid,
  //       nickname: docSnap.data()?.nickname,
  //       momo: docSnap.data()?.momo,
  //       bank1Name: docSnap.data()?.bank1Name,
  //       bank1Number: docSnap.data()?.bank1Number,
  //       bank2Name: docSnap.data()?.bank2Name,
  //       bank2Number: docSnap.data()?.bank2Number,
  //       menus: docSnap.data()?.menus,
  //       avatar: docSnap.data()?.avatar,
  //       momoQR: docSnap.data()?.momoQR,
  //       bankQR: docSnap.data()?.bankQR,
  //     };
  //     dispatch(UserActions.setCurrentUser(firestoreUser));
  //   } else {
  //     const newUser: User = {
  //       uid: user.uid,
  //       nickname: user.displayName,
  //       momo: '',
  //       bank1Name: '',
  //       bank1Number: '',
  //       bank2Name: '',
  //       bank2Number: '',
  //       menus: [],
  //       avatar: '',
  //       momoQR: '',
  //       bankQR: '',
  //     };
  //     await setDoc(docRef, newUser);
  //     dispatch(UserActions.setCurrentUser(newUser));
  //   }
  //   router.push('/create-order/');
  // };

  const _onComingSoom = () => {
    toast.success('Feature coming soon', {
      style: {
        textAlign: 'center',
      },
    });
  };

  const _onNoSignInOrder = () => {
    router.push('/create-no-sign-in-order/');
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="m-auto flex max-w-xl flex-col">
        <Text preset="h1b" text="Sign In" />
        <Text
          preset="p2"
          className="font-light"
          text="Sign in with google account or as anonymous"
        />
        <div className="mt-6 flex flex-col items-center justify-center gap-3 self-stretch">
          <Button
            onClick={_onComingSoom}
            className="flex items-center justify-center gap-2 self-stretch bg-main-bg"
          >
            <img
              className="w-5"
              src={Icons.google_icon.src}
              alt="google-icon"
            />
            <Text preset="p2" text="Sign in with Google" />
          </Button>
          <Button
            onClick={_onNoSignInOrder}
            className="flex items-center justify-center gap-2 self-stretch"
          >
            <Text preset="p2" text="Sign in as anonymous" />
          </Button>
        </div>
        <Toaster />
      </div>
    </Main>
  );
};

export default SignIn;
