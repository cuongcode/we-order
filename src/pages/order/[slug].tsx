import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ImageGallery } from '@/components/common';
import {
  CalculateTotal,
  MenusDropdown,
  SharedLink,
  ShopOwnerProfile,
  ShopOwnerTranferInfo,
  Table,
  WantedBoard,
} from '@/components/pages/order';
import { db, storage } from '@/firebase';
import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import {
  OrderActions,
  RowsActions,
  selector,
  UserActions,
  WantedActions,
} from '@/redux';
import { Main } from '@/templates/Main';
import type { Order, User } from '@/types';

const OrderPage = ({ query }: { query: any }) => {
  const { order } = useSelector(selector.order);
  const [menuImageList, setMenuImageList] = useState<string[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (query) {
      _fetchOrder();
      _fetchRows();
      _fetchWanteds();
    }
  }, []);

  useEffect(() => {
    if (order.uid) {
      _fetchShopOwner(order.uid);
    }
    if (order.selectedMenuLink === '') {
      _fetchMenuImages(order.uid, order.selectedMenuName.replace(/\s+/g, ''));
    }
  }, [order.uid, order.selectedMenuLink]);

  const _fetchOrder = () => {
    const docRef = doc(db, 'orders', query?.slug);
    onSnapshot(docRef, (document) => {
      const newOrder: Order = {
        id: document.id,
        shipFee: document.data()?.shipFee,
        discount: document.data()?.discount,
        selectedMenuName: document.data()?.selectedMenuName,
        selectedMenuLink: document.data()?.selectedMenuLink,
        uid: document.data()?.uid,
        timestamp: document.data()?.timestamp,
        isClosed: document.data()?.isClosed,
        heart: document.data()?.heart,
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

  const _fetchWanteds = () => {
    const wantedsRef = collection(db, 'orders', query?.slug, 'wanteds');
    const q = firestoreQuery(wantedsRef);
    onSnapshot(q, (snapshot) => {
      const updatedWanteds = snapshot.docs.map((document: any) => {
        return { ...document.data(), id: document.id };
      });
      dispatch(WantedActions.setWanteds(updatedWanteds));
    });
  };

  const _fetchShopOwner = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    onSnapshot(docRef, (_doc) => {
      const updatedShopOwner: User = {
        uid,
        nickname: _doc.data()?.nickname,
        momo: _doc.data()?.momo,
        bank1Name: _doc.data()?.bank1Name,
        bank1Number: _doc.data()?.bank1Number,
        bank2Name: _doc.data()?.bank2Name,
        bank2Number: _doc.data()?.bank2Number,
        avatar: _doc.data()?.avatar,
        momoQR: _doc.data()?.momoQR,
        bankQR: _doc.data()?.bankQR,
      };
      dispatch(UserActions.setShopOwner(updatedShopOwner));
    });
  };

  const _fetchMenuImages = async (uid: string, menuName: string) => {
    const storageRef = ref(storage, `users/${uid}/menus/${menuName}`);
    const files = await listAll(storageRef);
    files.items.forEach(async (itemRef) => {
      const url = await getDownloadURL(ref(storage, itemRef.fullPath));
      setMenuImageList((prev: any) => [...prev, url]);
    });
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      {!order.uid ? (
        <div>Page not found</div>
      ) : (
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
              <ShopOwnerProfile />
              <ShopOwnerTranferInfo />
              <QRBoard />
              <div className="m-auto h-40 w-60 rounded-3xl border-2 bg-white p-5 drop-shadow-md">
                <div className="mt-3">
                  <WantedBoard />
                </div>
              </div>
            </div>
            <div className="mb-10">
              <SharedLink />
            </div>
            <div className="relative mb-5">
              {order.isClosed ? (
                <div className="absolute -top-7 right-1/2 text-xl font-bold text-gray-600">
                  CLOSED
                </div>
              ) : null}
              <Table />
            </div>
            <div className="mb-10">
              <CalculateTotal />
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:w-1/2">
            <MenusDropdown />
            {/* <iframe
              title="menu-frame"
              src={order.selectedMenuLink}
              className="h-screen w-full rounded-xl border-2 p-5"
            /> */}
            {order.selectedMenuLink !== '' ? (
              <iframe
                title="menu-frame"
                src={order.selectedMenuLink}
                className="h-screen w-full rounded-xl border-2 p-5"
              />
            ) : (
              <div className="no-scrollbar flex h-screen flex-col gap-2 overflow-x-auto">
                {menuImageList.map((url: string) => {
                  return (
                    <img
                      key={url}
                      src={url}
                      alt="user-icon"
                      className="w-full rounded-xl"
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Main>
  );
};

export default OrderPage;

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};

const QRBoard = () => {
  const { currentUser, shopOwner } = useSelector(selector.user);

  return (
    <div className="flex h-40 w-20 flex-col justify-between rounded-3xl border-2 bg-white  p-1 drop-shadow-md">
      <div className="relative">
        <div className="rounded-2xl border-2">
          {shopOwner?.momoQR && shopOwner?.momoQR !== '' ? (
            <img
              src={shopOwner.momoQR}
              alt=""
              className="rounded-2xl bg-blue-200"
            />
          ) : (
            <div className="flex h-16 w-16 flex-col justify-center">
              <div className="text-center text-xs">Momo QR</div>
            </div>
          )}
          {currentUser && currentUser.uid === shopOwner?.uid ? (
            <div className="absolute -right-6 top-0">
              <ImageGallery field="momoQR" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="relative">
        <div className="rounded-2xl border-2">
          {shopOwner?.bankQR && shopOwner?.bankQR !== '' ? (
            <img
              src={shopOwner.bankQR}
              alt=""
              className="rounded-2xl bg-blue-200"
            />
          ) : (
            <div className="flex h-16 w-16 flex-col justify-center">
              <div className="text-center text-xs">Bank QR</div>
            </div>
          )}
          {currentUser && currentUser.uid === shopOwner?.uid ? (
            <div className="absolute -right-6 top-0">
              <ImageGallery field="bankQR" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// export const getStaticPaths = async () => {
//   // const paths: any = [];

//   // const querySnapshot = await getDocs(collection(db, 'orders'));
//   // querySnapshot.forEach((_doc: any) =>
//   //   paths.push({
//   //     params: { slug: _doc.id },
//   //   }),
//   // );
//   const paths = await getOrders();
//   return {
//     paths,
//     fallback: 'blocking',
//   };
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
