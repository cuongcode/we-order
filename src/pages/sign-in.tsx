import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { auth, db, provider } from '@/firebase';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import type { User } from '@/types';

const SignIn = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        _fetchUser(user.uid);
      }
    });
  }, []);

  const _fetchUser = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    onSnapshot(docRef, (_doc) => {
      const updatedCurrentUser: User = {
        uid: _doc.data()?.uid,
        nickname: _doc.data()?.nickname,
        momo: _doc.data()?.momo,
        bank1Name: _doc.data()?.bank1Name,
        bank1Number: _doc.data()?.bank1Number,
        bank2Name: _doc.data()?.bank2Name,
        bank2Number: _doc.data()?.bank2Number,
      };
      setCurrentUser(updatedCurrentUser);
    });
  };

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
      setCurrentUser(firestoreUser);
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
    }
  };

  const _onSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.log('sign out error', error);
    }
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="flex w-full flex-col items-center bg-gray-200">
        <div className="flex gap-5">
          <button onClick={_onSignIn}>Sign In</button>
          <button onClick={_onSignOut}>Sign Out</button>
        </div>
        <UserName currentUser={currentUser} />
      </div>
    </Main>
  );
};

export default SignIn;

const UserName = ({ currentUser }: { currentUser: User | null }) => {
  const [nickname, setNickname] = useState('');

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNickname(value);
  };

  const _updateUserName = async () => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(docRef, {
        nickname,
      });
    }
  };

  return (
    <div>
      <div>{currentUser ? currentUser.nickname : 'No user'}</div>
      <input type="text" value={nickname} onChange={_onChange} />
      <button onClick={_updateUserName}>Save</button>
    </div>
  );
};
