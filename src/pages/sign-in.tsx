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
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
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
      }
    });
  }, []);

  const _onSignIn = async () => {
    await signInWithPopup(auth, provider);
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

const UserName = ({ currentUser }: { currentUser: any }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(currentUser?.nickname);
  }, []);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUsername(value);
  };

  const _updateUserName = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser?.uid);
          await updateDoc(docRef, {
            nickname: username,
          });
        }
      }
    });
  };
  return (
    <div>
      <div>{currentUser ? username : 'No user'}</div>
      <input type="text" value={username} onChange={_onChange} />
      <button onClick={_updateUserName}>Save</button>
    </div>
  );
};
