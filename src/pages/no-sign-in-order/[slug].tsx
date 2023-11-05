import {
  collection,
  onSnapshot,
  query as firestoreQuery,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { db } from '@/firebase';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const NoSignInOrderPage = ({ query }: { query: any }) => {
  const [orderNamePool, setorderNamePool] = useState<any>([]);
  useEffect(() => {
    _fetchNoSignInOrder();
  }, []);
  // const _fetchOrder = () => {
  //   const docRef = doc(db, 'orders', query?.slug);
  //   onSnapshot(docRef, (document) => {
  //     const newOrder: Order = {
  //       id: document.id,
  //       shipFee: document.data()?.shipFee,
  //       discount: document.data()?.discount,
  //       selectedMenuName: document.data()?.selectedMenuName,
  //       selectedMenuLink: document.data()?.selectedMenuLink,
  //       uid: document.data()?.uid,
  //       timestamp: document.data()?.timestamp,
  //       isClosed: document.data()?.isClosed,
  //       heart: document.data()?.heart,
  //     };
  //     dispatch(OrderActions.setOrder(newOrder));
  //   });
  // };
  const _fetchNoSignInOrder = async () => {
    const q = firestoreQuery(collection(db, 'no_sign_in_orders'));
    onSnapshot(q, (snapshot) => {
      const updatedNoSignInOrder = snapshot.docs.map((_doc: any) => {
        return _doc.id;
      });
      setorderNamePool(updatedNoSignInOrder);
    });
  };
  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      {!orderNamePool.includes(query.slug) ? (
        <div>Page not found</div>
      ) : (
        <div>
          <div>Work in progress</div>
          <div>{query.slug}</div>
        </div>
      )}
    </Main>
  );
};

export default NoSignInOrderPage;

NoSignInOrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};
