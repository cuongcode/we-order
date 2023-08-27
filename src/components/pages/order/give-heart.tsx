import { HeartIcon as OutlineHeart } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeart } from '@heroicons/react/24/solid';
import {
  addDoc,
  collection,
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
  const { currentUser } = useSelector(selector.user);
  const { hearts } = useSelector(selector.heart);
  const dispatch = useDispatch();

  useEffect(() => {
    _fetchHeart();
  }, []);

  const _addHeart = async () => {
    if (currentUser) {
      const newHeart: Heart = {
        uid: currentUser.uid,
        nickname: String(currentUser.nickname),
      };
      await addDoc(collection(db, 'orders', order.id, 'hearts'), newHeart);
    } else {
      const newHeart: Heart = {
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
    <div className="flex items-center">
      <button onClick={_addHeart}>
        {hearts.length === 0 ? (
          <OutlineHeart className="h-4 w-4 text-red-400" />
        ) : (
          <SolidHeart className="h-4 w-4 text-red-400" />
        )}
      </button>
      <div>{hearts.length}</div>
    </div>
  );
};
