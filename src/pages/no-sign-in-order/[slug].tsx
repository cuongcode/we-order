import {
  CheckIcon,
  ClipboardDocumentIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import {
  collection,
  doc,
  onSnapshot,
  query as firestoreQuery,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Portal } from '@/components/common';
import { CalculateTotal, MenusDropdown, Table } from '@/components/pages/order';
import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { Icons, LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { OrderActions, selector } from '@/redux';
import { Main } from '@/templates/Main';
import type { NoSignInOrder } from '@/types';

const NoSignInOrderPage = ({ query }: { query: any }) => {
  const [orderNamePool, setorderNamePool] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    _fetchNoSignInOrders();
  }, []);
  useEffect(() => {
    _fetchNoSignInOrder();
  }, []);
  const _fetchNoSignInOrder = () => {
    const docRef = doc(db, 'no_sign_in_orders', query?.slug);
    onSnapshot(docRef, (document) => {
      const newOrder: NoSignInOrder = {
        id: document.id,
        isClosed: document.data()?.isClosed,
        shipFee: document.data()?.shipFee,
        discount: document.data()?.discount,
        selectedMenuName: document.data()?.selectedMenuName,
        selectedMenuLink: document.data()?.selectedMenuLink,
        password: document.data()?.password,
        nickname: document.data()?.nickname,
        momo: document.data()?.momo,
        bank1Name: document.data()?.bank1Name,
        bank1Number: document.data()?.bank1Number,
        bank2Name: document.data()?.bank2Name,
        bank2Number: document.data()?.bank2Number,
        avatar: document.data()?.avatar,
        momoQR: document.data()?.momoQR,
        bankQR: document.data()?.bankQR,
      };
      dispatch(OrderActions.setNoSignInOrder(newOrder));
    });
  };
  const _fetchNoSignInOrders = async () => {
    const q = firestoreQuery(collection(db, 'no_sign_in_orders'));
    onSnapshot(q, (snapshot) => {
      const updatedNoSignInOrders = snapshot.docs.map((_doc: any) => {
        return _doc.id;
      });
      setorderNamePool(updatedNoSignInOrders);
    });
  };
  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      {!orderNamePool.includes(query.slug) ? (
        <div>Page not found</div>
      ) : (
        <div className="mt-12 flex h-fit w-full flex-col items-center 2xl:flex-row 2xl:items-start 2xl:gap-5">
          <div className="flex w-full max-w-4xl flex-col 2xl:w-1/2">
            <div className="mb-10 w-full">
              <img
                className="m-auto w-1/2"
                src={LogoImages.title_logo.src}
                alt="title-logo"
              />
            </div>

            <div className="mb-10 flex w-full gap-4 text-sm">
              <div className="h-40 w-36 shrink-0">
                <ShopOwnerProfile />
              </div>
              <div className="h-40 w-56 shrink-0">
                <ShopOwnerTranferInfo />
              </div>
            </div>

            <div className="mb-10">
              <SharedLink />
            </div>
            <div className="relative mb-5">
              {/* {order.isClosed ? (
                <div className="absolute -top-7 right-1/2 text-xl font-bold text-gray-600">
                  CLOSED
                </div>
              ) : null} */}
              <Table />
            </div>
            <div className="mb-10">
              <CalculateTotal />
            </div>
          </div>
          <div className="flex w-full max-w-4xl flex-col gap-3 2xl:w-1/2">
            <MenusDropdown />
          </div>
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

const ShopOwnerProfile = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">SHOP OWNER</div>
      <ShopOwnerImage />
      <div className="mt-1">
        <ShopOwnerNameInput />
      </div>
      <CloseOrderButton />
    </div>
  );
};

export const ShopOwnerImage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useCheckClickOutside(() => {
    setIsOpen(false);
  });

  const _onOpen = async () => {
    setIsOpen(true);
  };

  return (
    <div className="relative rounded-full bg-gray-500 p-1">
      <button
        onClick={_onOpen}
        className="flex h-20 w-20 rounded-full bg-gray-200"
      >
        <img
          className="h-full w-full rounded-full object-cover"
          src={Icons.user_icon.src}
          alt="user-icon"
        />
        {isOpen ? (
          <Portal>
            <div className="fixed inset-0 z-50 h-full w-full bg-gray-800/50">
              <div
                ref={modalRef}
                className="m-auto mt-16 flex h-fit w-fit rounded-xl bg-white p-5"
              >
                <img
                  src={Icons.user_icon.src}
                  alt=""
                  className="h-72 w-72 rounded-2xl object-cover"
                />
              </div>
            </div>
          </Portal>
        ) : null}
      </button>
    </div>
  );
};

const ShopOwnerNameInput = () => {
  const { noSignInOrder } = useSelector(selector.order);
  const [shopOwnerName, setShopOwnerName] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const _onEdit = () => {
    if (noSignInOrder?.nickname) {
      setShopOwnerName(noSignInOrder.nickname);
    }
    setIsEdit(true);
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setShopOwnerName(value);
  };

  const _updateUserNickname = async () => {
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      nickname: shopOwnerName,
    });
    setIsEdit(false);
  };

  return (
    <div className="relative">
      {isEdit ? (
        <>
          <div className="h-6 w-20 rounded-md border-2 text-center hover:border-gray-600">
            <input
              className="h-5 w-full rounded-md text-center"
              type="text"
              value={shopOwnerName}
              name="shopOwnerName"
              onChange={_onChange}
            />
          </div>
          <button
            className="absolute -right-5 top-1"
            onClick={_updateUserNickname}
          >
            <CheckIcon className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <div className="h-6 w-20 rounded-md border-2 border-white text-center">
            {noSignInOrder?.nickname}
          </div>
          <button className="absolute -right-5 top-2" onClick={_onEdit}>
            <PencilSquareIcon className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
};

const CloseOrderButton = () => {
  // const { order } = useSelector(selector.order);

  const _updateOrder = async () => {
    // const docRef = doc(db, 'orders', order.id);
    // await updateDoc(docRef, {
    //   isClosed: !order.isClosed,
    // });
  };

  return (
    <button
      className="absolute top-40 flex w-36 items-center gap-2 rounded-lg bg-gray-200 p-1 px-2 hover:bg-gray-400"
      onClick={_updateOrder}
    >
      {true ? (
        <>
          <LockClosedIcon className="h-4 w-4" />
          <div className="min-w-max">Order is closed</div>
        </>
      ) : (
        <>
          <LockOpenIcon className="h-4 w-4" />
          <div className="min-w-max">Order is open</div>
        </>
      )}
    </button>
  );
};

const ShopOwnerTranferInfo = () => {
  return (
    <div className="flex h-full w-full flex-col items-center gap-2 rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="font-bold">TRANSFER INFO</div>
      <div className="flex w-full flex-col items-start">
        <div className="flex h-6 w-full items-center">
          <div className="w-11">Momo</div>
          <div className="mx-2">:</div>
          <div className="grow">
            <ShopOwnerMomoInput />
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-11">Bank</div>
          <div className="mx-2">:</div>
        </div>
        <div className="flex w-full flex-col">
          <ShopOwnerBankInput field1="bank1Name" field2="bank1Number" />
          <ShopOwnerBankInput field1="bank2Name" field2="bank2Number" />
        </div>
      </div>
    </div>
  );
};
const ShopOwnerMomoInput = () => {
  const { noSignInOrder } = useSelector(selector.order);
  const [momo, setMomo] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const _onEdit = () => {
    if (noSignInOrder) {
      setMomo(noSignInOrder.momo);
    }
    setIsEdit(true);
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMomo(value);
  };

  const _updateUserMomo = async () => {
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      momo,
    });
    setIsEdit(false);
  };

  return (
    <div className="flex items-center justify-between">
      {isEdit ? (
        <>
          <input
            className="w-28 rounded-md border-2 px-1 hover:border-gray-600"
            type="text"
            value={momo}
            name="shopOwnerMomo"
            onChange={_onChange}
          />
          <button className="" onClick={_updateUserMomo}>
            <CheckIcon className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div className="w-28 rounded-md border-2 border-white px-1">
            {noSignInOrder?.momo || '--'}
          </div>
          <button className="" onClick={_onEdit}>
            <PencilSquareIcon className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
};

const ShopOwnerBankInput = ({
  field1,
  field2,
}: {
  field1: keyof NoSignInOrder;
  field2: keyof NoSignInOrder;
}) => {
  const { noSignInOrder } = useSelector(selector.order);
  const [bankName, setBankName] = useState<any>('');
  const [bankNumber, setBankNumber] = useState<any>('');
  const [isEdit, setIsEdit] = useState(false);

  const _onEdit = () => {
    if (noSignInOrder) {
      setBankName(noSignInOrder[field1]);
      setBankNumber(noSignInOrder[field2]);
      setIsEdit(true);
    }
  };

  const _onBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBankName(value);
  };
  const _onBankNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBankNumber(value);
  };

  const _updateUserBank = async () => {
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      [field1]: bankName,
      [field2]: bankNumber,
    });
    setIsEdit(false);
  };

  return (
    <div className="flex w-full items-center justify-between">
      {isEdit ? (
        <>
          <div className="flex items-center">
            <input
              className="w-12 rounded-md border-2 px-1 hover:border-gray-600"
              type="text"
              value={bankName}
              onChange={_onBankNameChange}
            />
            <input
              className="w-32 rounded-md border-2 px-1 hover:border-gray-600"
              type="text"
              value={bankNumber}
              onChange={_onBankNumberChange}
            />
          </div>
          <button className="" onClick={_updateUserBank}>
            <CheckIcon className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <div className="w-12 rounded-md border-2 border-white px-1">
              {noSignInOrder ? noSignInOrder[field1]?.toString() || '--' : ''}
            </div>
            <div className="w-32 rounded-md border-2 border-white px-1">
              {noSignInOrder ? noSignInOrder[field2]?.toString() : ''}
            </div>
          </div>
          <button className="" onClick={_onEdit}>
            <PencilSquareIcon className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
};

const SharedLink = () => {
  const [isClick, setIsClick] = useState(false);

  const { noSignInOrder } = useSelector(selector.order);

  const _copyClipboard = () => {
    navigator.clipboard.writeText(
      `https://we-order-omega.vercel.app/order/${noSignInOrder.id}`,
    );
    setIsClick(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div>Share this link :</div>
      <div className="flex w-fit items-center gap-2 rounded-lg border-2 border-gray-300 px-3 py-1">
        <div>
          https://we-order-omega.vercel.app/no-sign-in-order/{noSignInOrder.id}
        </div>
        {!isClick ? (
          <button type="button" onClick={_copyClipboard}>
            <ClipboardDocumentIcon className="h-5 w-5" />
          </button>
        ) : (
          <CheckIcon
            className="h-5 w-5 text-green-500"
            onMouseLeave={() => {
              setTimeout(() => setIsClick(false), 1000);
            }}
          />
        )}
      </div>
    </div>
  );
};
