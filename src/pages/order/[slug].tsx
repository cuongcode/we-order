import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';

import {
  CalculateTotal,
  MenusDropdown,
  SharedLink,
  ShopOwner,
  Table,
  TranferInfo,
} from '@/components/pages/order';
import { db, storage } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { Icons, LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import {
  OrderActions,
  RowsActions,
  selector,
  UserActions,
  WantedActions,
} from '@/redux';
import { Main } from '@/templates/Main';
import type { Order, User, WantedInfo } from '@/types';

const OrderPage = ({ query }: { query: any }) => {
  const { order } = useSelector(selector.order);
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
  }, [order.uid]);

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
      };
      dispatch(UserActions.setShopOwner(updatedShopOwner));
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
              <ShopOwner />
              <TranferInfo />
              <div className="m-auto h-40 w-60 rounded-3xl border-2 bg-white p-5 drop-shadow-md">
                <div className="mt-1">
                  <SimpleSlider />
                </div>

                {/* <WantedBoard /> */}
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
            <iframe
              title="menu-frame"
              src={order.selectedMenuLink}
              className="h-screen w-full rounded-xl border-2 p-5"
            />
          </div>
        </div>
      )}
    </Main>
  );
};

export default OrderPage;

const SLIDER_SETTINGS = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  arrows: false,
  draggable: true,
};

const SimpleSlider = () => {
  const { wanteds } = useSelector(selector.wanted);
  const { order } = useSelector(selector.order);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<Blob | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [isShow, setIsShow] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const uploadFormRef = useCheckClickOutside(() => {
    setIsShow(false);
    setSelectedFile(undefined);
    formRef.current?.reset();
    setMessage('');
    setError('');
  });

  const _onUpload = () => {
    if (message === '') {
      setError('Please input a message');
      return;
    }
    if (selectedFile === undefined) {
      setError('Please select a picture');
      return;
    }
    const storageRef = ref(storage, `wanted/${order?.id}/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      'state_changed',
      () => {
        //
      },
      () => {
        //
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        if (order) {
          const newWanted = {
            avatar: downloadUrl,
            message,
          };
          await addDoc(
            collection(db, 'orders', order?.id, 'wanteds'),
            newWanted,
          );
        }
      },
    );

    setSelectedFile(undefined);
    formRef.current?.reset();
    setMessage('');
    setError('');
    setIsShow(false);
  };

  const _onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length !== 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const _onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  const _onShow = () => {
    setIsShow(true);
  };

  return (
    <div className="relative">
      <Slider {...SLIDER_SETTINGS}>
        {wanteds.length === 0 ? <WantedSample /> : Wanteds(wanteds)}
      </Slider>
      <button className="absolute -bottom-10 -right-11" onClick={_onShow}>
        <CloudArrowUpIcon className="h-5 w-5" />
      </button>
      <div className="absolute -top-9 left-16 font-bold">WANTED</div>
      {isShow ? (
        <div
          ref={uploadFormRef}
          className="absolute -right-8 top-36 flex flex-col gap-2 bg-gray-200 p-2"
        >
          <form ref={formRef} action="" className="flex flex-col gap-2">
            <input
              type="file"
              accept="/image/*"
              onChange={_onFileChange}
              className="text-xs"
            />
            <input
              className="h-6 rounded-md"
              type="text"
              value={message}
              name="message"
              onChange={_onMessageChange}
            />
          </form>
          <button onClick={_onUpload} className="rounded-md bg-gray-400 py-1">
            Upload
          </button>
          {error !== '' ? <div className="text-red-400">{error}</div> : null}
        </div>
      ) : null}
    </div>
  );
};

const Wanteds = (listItem: WantedInfo[]) => {
  return listItem.map((w: WantedInfo) => (
    <div key={w.id} className="flex gap-2">
      <img
        className="h-24 w-24 rounded-lg bg-gray-200 object-cover"
        src={w.avatar}
        alt="user-icon"
      />
      <div className="h-24 w-28 leading-4 tracking-tight">
        <div>{w.message}</div>
      </div>
    </div>
  ));
};

const WantedSample = () => {
  return (
    <div className="flex gap-2">
      <img
        className="h-24 w-24 rounded-lg bg-gray-200 object-cover"
        src={Icons.user_icon.src}
        alt="user-icon"
      />
      <div className="h-24 w-28 leading-4 tracking-tight">
        <div>Write a message to someone if he/she still owe you money.</div>
      </div>
    </div>
  );
};

OrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
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
