import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from 'firebase/firestore';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CalculateTotal,
  MenusDropdown,
  SharedLink,
  ShopOwner,
  Table,
  TranferInfo,
} from '@/components/pages/order';
import { auth, db } from '@/firebase';
import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { OrderActions, RowsActions, selector } from '@/redux';
import { Main } from '@/templates/Main';
import type { Order } from '@/types';

const OrderPage = ({ query }: { query: any }) => {
  const [isHasOrder, setIsHasOrder] = useState(true);
  const { order } = useSelector(selector.order);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        _isHasOrder();
      } else {
        router.push(`/sign-in?from=/order/${query.slug}`);
      }
    });
  }, []);

  useEffect(() => {
    if (isHasOrder) {
      // onAuthStateChanged(auth, async (user) => {
      //   if (user) {
      //     _fetchOrder();
      //     _fetchRows();
      //   }
      // });
      _fetchOrder();
      _fetchRows();
    } else {
      router.push('/404');
    }
  }, [isHasOrder]);

  const _isHasOrder = async () => {
    const docRef = doc(db, 'orders', query?.slug);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      setIsHasOrder(false);
    }
  };

  const _fetchOrder = () => {
    const docRef = doc(db, 'orders', query?.slug);
    onSnapshot(docRef, (document) => {
      const newOrder: Order = {
        id: document.id,
        shipFee: document.data()?.shipFee,
        discount: document.data()?.discount,
        shopOwnerName: document.data()?.shopOwnerName,
        shopOwnerMomo: document.data()?.shopOwnerMomo,
        selectedMenuName: document.data()?.selectedMenuName,
        selectedMenuLink: document.data()?.selectedMenuLink,
        uid: document.data()?.selectedMenuLink,
        timestamp: document.data()?.timestamp,
      };
      dispatch(OrderActions.setOrder(newOrder));
    });
  };

  const _fetchRows = () => {
    const rowsRef = collection(db, 'orders', query?.slug, 'rows');
    const q = firestoreQuery(rowsRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      const updatedRows = snapshot.docs.map((document: any) => {
        return { ...document.data(), id: document.id };
      });
      dispatch(RowsActions.setRows(updatedRows));
    });
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="mt-12 flex h-fit w-full flex-col lg:flex lg:flex-row lg:gap-5">
        <div className="flex flex-col lg:w-1/2">
          <div className="mb-10 w-full">
            <img
              className="m-auto w-1/2"
              src={LogoImages.title_logo.src}
              alt="title-logo"
            />
          </div>
          <div className="mb-10 flex w-full gap-4 text-sm">
            <ShopOwner />
            <TranferInfo />
          </div>
          <div className="mb-10">
            <SharedLink />
          </div>
          <div className="mb-5">
            <Table />
          </div>
          <div className="mb-10">
            <CalculateTotal />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-1/2">
          <MenusDropdown />
          <iframe
            title="menu-frame"
            src={order.selectedMenuLink}
            className="h-screen w-full rounded-xl border-2 p-5"
          />
        </div>
      </div>
    </Main>
  );
};

export default OrderPage;

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};

// export const getStaticPaths = async () => {
//   const paths: any = [];
//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       const querySnapshot = await getDocs(collection(db, 'orders'));
//       querySnapshot.forEach((_doc: any) =>
//         paths.push({ params: { slug: _doc.id } }),
//       );
//     }
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// };

// origin
// export const getStaticPaths = async () => {
//   const paths: any = [];
//   onAuthStateChanged(auth, async (user) => {
//     console.log('🚀 ~ file: [slug].tsx:145 ~ onAuthStateChanged ~ user:', user);
//     if (user) {
//       const querySnapshot = await getDocs(collection(db, 'orders'));
//       querySnapshot.forEach((_doc: any) =>
//         paths.push({
//           path: `/order/${_doc.id}`,
//           params: { slug: _doc.id },
//         }),
//       );
//     }
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticPaths = async () => {
//   const paths: any = [];
//   const params: any = { slug: '', newOrder: {}, updatedRows: {} };
//   onAuthStateChanged(auth, async (user) => {
//     console.log('🚀 ~ file: [slug].tsx:145 ~ onAuthStateChanged ~ user:', user);
//     if (user) {
//       const querySnapshot = await getDocs(collection(db, 'orders'));
//       querySnapshot.forEach((_doc: any) => {
//         params.slug = _doc.id;

//         const docRef = doc(db, 'orders', _doc.id);
//         onSnapshot(docRef, (document) => {
//           const newOrder: Order = {
//             id: document.id,
//             shipFee: document.data()?.shipFee,
//             discount: document.data()?.discount,
//             shopOwnerName: document.data()?.shopOwnerName,
//             shopOwnerMomo: document.data()?.shopOwnerMomo,
//             selectedMenuName: document.data()?.selectedMenuName,
//             selectedMenuLink: document.data()?.selectedMenuLink,
//           };
//           params.newOrder = newOrder;
//         });

//         const rowsRef = collection(db, 'orders', _doc.id, 'rows');
//         const q = firestoreQuery(rowsRef, orderBy('timestamp'));
//         onSnapshot(q, (snapshot) => {
//           const updatedRows = snapshot.docs.map((document: any) => {
//             return { ...document.data(), id: document.id };
//           });
//           params.updatedRows = updatedRows;
//         });

//         paths.push({
//           path: `/order/${_doc.id}`,
//           params,
//         });
//       });
//     }
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps = async ({
//   params: { slug, newOrder, updatedRows },
// }: {
//   params: any;
//   slug: any;
//   newOrder: Order;
//   updatedRows: any;
// }) => {
//   const order = JSON.stringify(newOrder);
//   const rows = JSON.stringify(updatedRows);
//   const query = { slug, order, rows };
//   return { props: { query } };
// };

// export const getStaticProps = async ({
//   params: { slug },
// }: {
//   params: any;
//   slug: any;
// }) => {
//   const query = { slug };

//   return { props: { query } };
// };
