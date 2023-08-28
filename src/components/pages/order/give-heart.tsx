import { HeartIcon as OutlineHeart } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeart } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { db } from '@/firebase';
import { HeartActions, selector } from '@/redux';
import type { DrinkTableRow, Heart } from '@/types';

export const GiveHeartRow = ({ row }: { row: DrinkTableRow }) => {
  const { order } = useSelector(selector.order);

  const _updateRow = async () => {
    const docRef = doc(db, 'orders', order.id, 'rows', row.id);
    await updateDoc(docRef, {
      heart: increment(1),
    });
  };

  return (
    <div className="flex items-center">
      <button onClick={_updateRow}>
        {row.heart === 0 ? (
          <OutlineHeart className="h-4 w-4 text-red-400" />
        ) : (
          <SolidHeart className="h-4 w-4 text-red-400" />
        )}
      </button>
      <div>{row.heart}</div>
    </div>
  );
};

export const GiveHeartShopOwner = () => {
  const { order } = useSelector(selector.order);
  const { currentUser, shopOwner } = useSelector(selector.user);
  const { hearts } = useSelector(selector.heart);
  const dispatch = useDispatch();

  useEffect(() => {
    _fetchHeart();
  }, []);

  const _addHeart = async () => {
    if (currentUser?.uid === shopOwner?.uid) {
      return;
    }
    if (
      currentUser &&
      hearts.map((heart: Heart) => heart.uid).includes(currentUser.uid)
    ) {
      const id = hearts.filter(
        (heart: Heart) => heart.uid === currentUser.uid,
      )[0]?.id;
      await deleteDoc(doc(db, 'orders', order.id, 'hearts', String(id)));
      return;
    }
    if (currentUser) {
      const newHeart = {
        uid: currentUser.uid,
        nickname: String(currentUser.nickname),
      };
      await addDoc(collection(db, 'orders', order.id, 'hearts'), newHeart);
    } else {
      const newHeart = {
        uid: '',
        nickname: '',
      };
      await addDoc(collection(db, 'orders', order.id, 'hearts'), newHeart);
    }
  };

  const _fetchHeart = () => {
    const heartsRef = collection(db, 'orders', order.id, 'hearts');
    const q = query(heartsRef);
    onSnapshot(q, (snapshot) => {
      const updatedHearts = snapshot.docs.map((document: any) => {
        return { ...document.data(), id: document.id };
      });
      dispatch(HeartActions.setHearts(updatedHearts));
    });
  };

  return (
    <div className="relative flex items-center">
      <button onClick={_addHeart}>
        {hearts.length === 0 ? (
          <OutlineHeart className="h-4 w-4 text-red-400" />
        ) : (
          <SolidHeart className="h-4 w-4 text-red-400" />
        )}
      </button>
      <div
        className={clsx({
          absolute: true,
          '-right-2': hearts.length < 10,
          '-right-4': hearts.length >= 10,
        })}
      >
        {hearts.length}
      </div>
    </div>
  );
};
