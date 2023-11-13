import {
  Bars2Icon,
  BarsArrowDownIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  LockClosedIcon,
  LockOpenIcon,
  MinusIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { range } from 'lodash';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Portal } from '@/components/common';
import { OfferedByFormula, ShowFormula } from '@/components/pages/order';
import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { Icons, LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { OrderActions, RowsActions, selector } from '@/redux';
import { Main } from '@/templates/Main';
import type { DrinkTableRow, Menu, NoSignInOrder } from '@/types';
import { numberArraySum } from '@/utils/base';

const NoSignInOrderPage = ({ query }: { query: any }) => {
  const { noSignInOrder } = useSelector(selector.order);
  const [orderNamePool, setorderNamePool] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    _fetchNoSignInOrders();
  }, []);
  useEffect(() => {
    if (query) {
      _fetchNoSignInOrder();
      _fetchRows();
    }
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
  const _fetchRows = () => {
    const rowsRef = collection(db, 'no_sign_in_orders', query?.slug, 'rows');
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
              {noSignInOrder.isClosed ? (
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
          <div className="flex w-full max-w-4xl flex-col gap-3 2xl:w-1/2">
            <MenusDropdown />
            <iframe
              title="menu-frame"
              src={noSignInOrder.selectedMenuLink}
              className="h-screen w-full rounded-xl border-2 p-5"
            />
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

  return (
    <div className="relative">
      <div className="h-6 w-20 rounded-md border-2 border-white text-center">
        {noSignInOrder?.nickname}
      </div>
    </div>
  );
};

const CheckPasswordPortal = ({
  onClose,
  onEdit,
}: {
  onClose: () => void;
  onEdit: () => void;
}) => {
  const modalRef = useCheckClickOutside(() => {
    onClose();
  });
  const _onEdit = () => {
    onEdit();
  };
  return (
    <Portal>
      <div className="fixed inset-0 z-50 h-full w-full bg-gray-800/50">
        <div
          ref={modalRef}
          className="m-auto mt-16 flex h-48 w-96 flex-col gap-5 rounded-xl bg-white p-5"
        >
          <CheckPassword
            allowEdit={() => _onEdit()}
            onClose={() => onClose()}
          />
        </div>
      </div>
    </Portal>
  );
};

const CheckPassword = ({
  allowEdit,
  onClose,
}: {
  allowEdit: () => void;
  onClose: () => void;
}) => {
  const [isWrong, setIsWrong] = useState(false);
  const { noSignInOrder } = useSelector(selector.order);
  const [password, setPassword] = useState('');
  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
  };
  const _checkPassword = () => {
    if (password === noSignInOrder.password) {
      allowEdit();
    } else {
      setIsWrong(true);
    }
  };
  const _onCancel = () => {
    onClose();
  };
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-lg font-semibold">Enter your password</div>
      <div className="relative w-full">
        <div className="w-full rounded-md border-2 p-1">
          <input
            type="text"
            value={password}
            onChange={_onChange}
            className="w-full"
          />
        </div>
        {isWrong ? (
          <div className="absolute text-red-400">
            Incorrect password. Please try again.
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex w-full gap-2">
        <button
          onClick={_onCancel}
          className="w-1/2 rounded-md bg-gray-200 py-2 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          className="w-1/2 rounded-md bg-gray-200 py-2 hover:bg-gray-400"
          onClick={_checkPassword}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const CloseOrderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { noSignInOrder } = useSelector(selector.order);

  const _onCheckPassword = () => {
    setIsOpen(true);
  };

  const _updateOrder = async () => {
    setIsOpen(false);
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      isClosed: !noSignInOrder.isClosed,
    });
  };

  return (
    <>
      <button
        className="absolute top-40 flex w-36 items-center gap-2 rounded-lg bg-gray-200 p-1 px-2 hover:bg-gray-400"
        onClick={_onCheckPassword}
      >
        {noSignInOrder.isClosed ? (
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
      {isOpen ? (
        <CheckPasswordPortal
          onClose={() => setIsOpen(false)}
          onEdit={_updateOrder}
        />
      ) : null}
    </>
  );
};

const ShopOwnerTranferInfo = () => {
  const { noSignInOrder } = useSelector(selector.order);
  const [nickname, setNickname] = useState('');
  const [momo, setMomo] = useState('');
  const [bank1Name, setBank1Name] = useState('');
  const [bank1Number, setBank1Number] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const modalRef = useCheckClickOutside(() => {
    setIsEdit(false);
  });
  const _onNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNickname(value);
  };
  const _onMomoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMomo(value);
  };
  const _onbank1NameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBank1Name(value);
  };
  const _onbank1NumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBank1Number(value);
  };
  const _onCheckPassword = () => {
    setIsOpen(true);
  };
  const onEdit = () => {
    setIsOpen(false);
    setNickname(noSignInOrder.nickname);
    setMomo(noSignInOrder.momo);
    setBank1Name(noSignInOrder.bank1Name);
    setBank1Number(noSignInOrder.bank1Number);
    setIsEdit(true);
  };
  const _onCancel = () => {
    setIsEdit(false);
  };
  const _updateUserProfile = async () => {
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      nickname,
      momo,
      bank1Name,
      bank1Number,
    });
    setIsEdit(false);
  };
  return (
    <div className="flex h-full w-full flex-col items-center gap-2 rounded-3xl border-2 bg-white p-3 drop-shadow-md">
      <div className="relative flex w-full items-center justify-center">
        <div className="font-bold">TRANSFER INFO</div>
        <button className="absolute right-0" onClick={_onCheckPassword}>
          <PencilSquareIcon className="h-3 w-3" />
        </button>
        {isOpen ? (
          <CheckPasswordPortal
            onClose={() => setIsOpen(false)}
            onEdit={onEdit}
          />
        ) : null}
        {isEdit ? (
          <Portal>
            <div className="fixed inset-0 z-50 h-full w-full bg-gray-800/50">
              <div
                ref={modalRef}
                className="m-auto mt-16 flex h-fit w-96 flex-col gap-5 rounded-xl bg-white p-5"
              >
                <div className="flex flex-col items-center gap-5">
                  <div className="text-lg font-semibold">Your Profile</div>
                  <div className=" w-full">
                    <div>Nickname: </div>
                    <div className="w-full rounded-md border-2 p-1">
                      <input
                        type="text"
                        value={nickname}
                        onChange={_onNicknameChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className=" w-full">
                    <div>Momo: </div>
                    <div className="w-full rounded-md border-2 p-1">
                      <input
                        type="text"
                        value={momo}
                        onChange={_onMomoChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className=" w-full">
                    <div>Bank Name: </div>
                    <div className="w-full rounded-md border-2 p-1">
                      <input
                        type="text"
                        value={bank1Name}
                        onChange={_onbank1NameChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className=" w-full">
                    <div>Bank Number: </div>
                    <div className="w-full rounded-md border-2 p-1">
                      <input
                        type="text"
                        value={bank1Number}
                        onChange={_onbank1NumberChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex w-full gap-2">
                    <button
                      onClick={_onCancel}
                      className="w-1/2 rounded-md bg-gray-200 py-2 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={_updateUserProfile}
                      className="w-1/2 rounded-md bg-gray-200 py-2 hover:bg-gray-400"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Portal>
        ) : null}
      </div>
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

  return (
    <div className="flex items-center justify-between">
      <div className="w-28 rounded-md border-2 border-white px-1">
        {noSignInOrder?.momo || '--'}
      </div>
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
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 rounded-md border-2 border-white px-1">
          {noSignInOrder ? noSignInOrder[field1]?.toString() || '--' : ''}
        </div>
        <div className="w-32 rounded-md border-2 border-white px-1">
          {noSignInOrder ? noSignInOrder[field2]?.toString() : ''}
        </div>
      </div>
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

const Table = () => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const quanity = rows.length;
  const bonus =
    (Number(noSignInOrder.shipFee) - Number(noSignInOrder.discount)) / quanity;
  const roundedBonus = Math.ceil(bonus / 500) * 500;

  const transferList: number[] = rows.map((row: DrinkTableRow) => {
    if (row.offerBy !== '--') {
      return 0;
    }
    let transfer = Number(row.price) + roundedBonus;
    for (let i = 0; i < rows.length; i += 1) {
      if (rows[i]?.offerBy === row.name) {
        transfer += Number(rows[i]?.price) + roundedBonus;
      }
    }
    return transfer;
  });

  const numberArray = range(1, rows.length + 1, 1);

  return (
    <div
      className={clsx({
        'flex flex-col gap-2 rounded-xl border-2 p-1': true,
        'bg-gray-200': !noSignInOrder.isClosed,
        'bg-gray-400': noSignInOrder.isClosed,
      })}
    >
      <div className="hidden w-full md:block">
        <TableHeader />
      </div>
      <div className="flex w-full flex-col gap-2">
        {rows.map((row: DrinkTableRow, index: number) => (
          <TableRow
            key={row.id}
            row={row}
            rowIndex={numberArray[index]}
            transfer={transferList[index]}
          />
        ))}
      </div>
      <TableAddRowButton />
    </div>
  );
};

const TableHeader = () => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);
  const dispatch = useDispatch();

  const _SortDrinkName = () => {
    const sortedRows = [...rows];
    sortedRows.sort((rowA: DrinkTableRow, rowB: DrinkTableRow) => {
      const x = rowA.drink.trim().toLowerCase();
      const y = rowB.drink.trim().toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    dispatch(RowsActions.setRows(sortedRows));
  };

  return (
    <div className="flex w-full items-center gap-1 text-xs font-semibold">
      <div className="w-3" />
      <div className="w-14">Name</div>
      <div className="flex grow items-center gap-2">
        <div>Drink</div>
        {noSignInOrder.isClosed ? (
          <button
            onClick={_SortDrinkName}
            className="flex items-center gap-1 rounded-md bg-white px-1 font-normal"
          >
            <BarsArrowDownIcon className="h-4 w-4" />
            <div>A-Z</div>
          </button>
        ) : null}
      </div>
      <div className="w-32">Notes/Topping</div>
      <div className="w-14 ">Price</div>
      <div className="w-8">Size</div>
      <div className="w-11">Sugar</div>
      <div className="w-11">Ice</div>
      <div className="w-16">Offered by</div>
      <div className="w-24">Transfer</div>
    </div>
  );
};

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'];
const PERCENTAGE_OPTIONS = ['100%', '70%', '50%', '30%', '0%'];

const TableRow = ({
  row,
  rowIndex,
  transfer,
}: {
  row: DrinkTableRow;
  rowIndex: any;
  transfer: number | undefined;
}) => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  // useMemo here ?
  const offerByOptions = [
    '--',
    ...rows
      .filter((_row: DrinkTableRow) => _row.offerBy === '--')
      .map((_row: DrinkTableRow) => _row.name),
  ].filter((option: string) => option !== row.name && option !== '');

  const _updateRow = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await updateDoc(docRef, {
      [name]: value,
    });
  };

  return (
    <div
      key={row.id}
      className={clsx({
        'flex w-full items-center gap-1 rounded-md text-xs': true,
        'bg-gray-400': row.isTick,
      })}
    >
      <div className="w-3">{rowIndex}</div>
      <div
        className={clsx({
          'relative w-14 rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600':
            true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <input
          className={clsx({
            'w-full font-semibold': true,
            'bg-gray-400': row.isTick,
          })}
          type="text"
          value={row.name}
          name="name"
          disabled={noSignInOrder.isClosed}
          onChange={_updateRow}
        />
        <div className="absolute -right-2 top-4 " />
      </div>
      <div
        className={clsx({
          'grow rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600':
            true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <input
          className={clsx({
            'w-full': true,
            'bg-gray-400': row.isTick,
          })}
          type="text"
          placeholder="Type Here"
          value={row.drink.toUpperCase()}
          name="drink"
          disabled={noSignInOrder.isClosed}
          onChange={_updateRow}
        />
      </div>
      <div
        className={clsx({
          'w-32 rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600':
            true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <input
          className={clsx({
            'w-full': true,
            'bg-gray-400': row.isTick,
          })}
          type="text"
          placeholder="No topping"
          value={row.topping}
          name="topping"
          disabled={noSignInOrder.isClosed}
          onChange={_updateRow}
        />
      </div>
      <div
        className={clsx({
          'w-14 rounded-md border-2 p-1 drop-shadow-md hover:border-gray-600':
            true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <input
          className={clsx({
            'w-full': true,
            'bg-gray-400': row.isTick,
          })}
          type="number"
          value={row.price !== 0 ? row.price : ''}
          name="price"
          disabled={noSignInOrder.isClosed}
          onChange={_updateRow}
        />
      </div>
      <div
        className={clsx({
          'z-40 w-8 rounded-md border-2 p-1 drop-shadow-md': true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <OptionsDropdown row={row} options={SIZE_OPTIONS} field="size" />
      </div>
      <div
        className={clsx({
          'z-30 w-11 rounded-md border-2 p-1 drop-shadow-md': true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <OptionsDropdown row={row} options={PERCENTAGE_OPTIONS} field="sugar" />
      </div>
      <div
        className={clsx({
          'z-20 w-11 rounded-md border-2 p-1 drop-shadow-md': true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <OptionsDropdown row={row} options={PERCENTAGE_OPTIONS} field="ice" />
      </div>

      <div
        className={clsx({
          'z-10 w-16 rounded-md border-2 p-1 drop-shadow-md': true,
          'bg-white': !row.isTick,
          'bg-gray-400': row.isTick,
        })}
      >
        <OptionsDropdown row={row} options={offerByOptions} field="offerBy" />
      </div>
      <div className="flex w-24 items-center gap-1">
        <ShowFormula transfer={transfer}>
          {row.offerBy !== '--' ? (
            <div className="absolute -top-16 right-0 z-50 flex flex-col gap-2 divide-y-2 rounded-lg bg-white p-2">
              <OfferedByFormula row={row} />
            </div>
          ) : (
            <div className="absolute -top-28 right-0 z-50 flex flex-col gap-2 divide-y-2 rounded-lg bg-white p-2">
              <TransferFormula row={row} transfer={transfer} />
              <BonusFormula />
            </div>
          )}
        </ShowFormula>
        {noSignInOrder.isClosed ? (
          <TranferTickBox row={row} />
        ) : (
          <DeleteRowButton row={row} />
        )}
      </div>
    </div>
  );
};

const OptionsDropdown = ({
  options,
  row,
  field,
}: {
  options: string[];
  row: DrinkTableRow;
  field: keyof DrinkTableRow;
}) => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const [isDropdown, setIsDropdown] = useState(false);

  const showOptions = options.filter((option: string) => option !== row[field]);

  const optionDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  const _onDropdown = () => {
    if (!noSignInOrder.isClosed) {
      setIsDropdown(true);
    }
  };

  const _updateManyRows = async (newValue: string) => {
    const updatedRows = rows.filter(
      (r: DrinkTableRow) => r.offerBy === row.name,
    );
    updatedRows.forEach(async (r: DrinkTableRow) => {
      const ref = doc(db, 'no_sign_in_orders', noSignInOrder.id, 'rows', r.id);
      await updateDoc(ref, {
        [field]: newValue,
      });
    });
  };

  const _updateRow = async (newValue: string) => {
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await updateDoc(docRef, {
      [field]: newValue,
    });
    if (field === 'offerBy') {
      _updateManyRows(newValue);
    }
    setIsDropdown(false);
  };

  return (
    <div
      ref={optionDropdownRef}
      className={clsx({ relative: true, 'bg-gray-400': row.isTick })}
    >
      <button type="button" className="w-full" onClick={_onDropdown}>
        {row[field]}
      </button>
      {isDropdown && showOptions.length !== 0 ? (
        <div
          className={clsx({
            'absolute flex flex-col items-center gap-1 bg-gray-400 p-1 rounded-lg':
              true,
            '-top-1 left-10': field === 'sugar' || field === 'ice',
            '-top-1 left-7': field === 'size',
            '-top-1 left-16': field === 'offerBy',
          })}
        >
          {showOptions.map((option: string) => (
            <button
              key={option}
              type="button"
              className={clsx({
                'bg-white rounded-md text-center hover:bg-gray-500': true,
                'w-9 h-6': field === 'sugar' || field === 'ice',
                'w-6 h-6': field === 'size',
                'h-6 w-14': field === 'offerBy',
              })}
              onClick={() => _updateRow(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const TransferFormula = ({
  transfer,
  row,
}: {
  transfer: number | undefined;
  row: DrinkTableRow;
}) => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const quantity = rows.length;
  const bonus = (noSignInOrder.shipFee - noSignInOrder.discount) / quantity;
  const roundedBonus = Math.ceil(bonus / 500) * 500;

  const transferList: number[] = rows.map(
    (r: DrinkTableRow) => Number(r.price) + roundedBonus,
  );

  return (
    <div className="flex gap-1">
      <div>
        <div className="font-semibold">transfer</div>
        <div>{transfer?.toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>=</div>
        <div>=</div>
      </div>
      <div>
        <div className="font-semibold">price</div>
        <div>{Number(row.price).toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>+</div>
        <div>+</div>
      </div>
      <div className="text-red-400">
        <div className="font-semibold">bonus</div>
        <div>({roundedBonus.toLocaleString('en-US')})</div>
      </div>
      {rows.map((r: DrinkTableRow, index: number) => {
        if (r.offerBy === row.name) {
          return (
            <>
              <div>
                <div>+</div>
                <div>+</div>
              </div>
              <div>
                <div>{r.name}</div>
                <div>{transferList[index]?.toLocaleString('en-US')}</div>
              </div>
            </>
          );
        }
        return null;
      })}
    </div>
  );
};

const BonusFormula = () => {
  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  const quantity = rows.length;
  const bonus = (noSignInOrder.shipFee - noSignInOrder.discount) / quantity;
  const roundedBonus = Math.ceil(bonus / 500) * 500;

  return (
    <div className="flex gap-1">
      <div className="text-red-400">
        <div className="font-semibold">bonus</div>
        <div>{roundedBonus.toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>=</div>
        <div>=</div>
      </div>
      <div>
        <div>(</div>
        <div>(</div>
      </div>
      <div className="min-w-max">
        <div className="font-semibold">ship fee</div>
        <div>{Number(noSignInOrder.shipFee).toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>-</div>
        <div>-</div>
      </div>
      <div>
        <div className="font-semibold">discount</div>
        <div>{Number(noSignInOrder.discount).toLocaleString('en-US')}</div>
      </div>
      <div>
        <div>)</div>
        <div>)</div>
      </div>
      <div>
        <div>/</div>
        <div>/</div>
      </div>
      <div>
        <div>quantity</div>
        <div>{quantity}</div>
      </div>
    </div>
  );
};

const TranferTickBox = ({ row }: { row: DrinkTableRow }) => {
  const { noSignInOrder } = useSelector(selector.order);

  const _onTick = async () => {
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await updateDoc(docRef, {
      isTick: !row.isTick,
    });
  };

  return (
    <button className="h-5 w-5 rounded-md bg-white" onClick={_onTick}>
      {row.isTick ? (
        <CheckIcon className="m-auto h-4 w-4 text-green-600" />
      ) : null}
    </button>
  );
};

const DeleteRowButton = ({ row }: { row: DrinkTableRow }) => {
  const { noSignInOrder } = useSelector(selector.order);

  const [isDropdown, setIsDropdown] = useState(false);

  const deleteRowButtonRef = useCheckClickOutside(() => setIsDropdown(false));

  const _deleteRow = async () => {
    const q = firestoreQuery(
      collection(db, 'no_sign_in_orders', noSignInOrder.id, 'rows'),
    );
    const queryrRows = await getDocs(q);
    queryrRows.forEach(async (_row) => {
      if (_row.data().offerBy === row.name) {
        await updateDoc(
          doc(db, 'no_sign_in_orders', noSignInOrder.id, 'rows', _row.id),
          {
            offerBy: '--',
          },
        );
      }
    });
    const docRef = doc(
      db,
      'no_sign_in_orders',
      noSignInOrder.id,
      'rows',
      row.id,
    );
    await deleteDoc(docRef);
  };

  return (
    <div ref={deleteRowButtonRef} className="relative">
      <button
        type="button"
        onClick={() => setIsDropdown(true)}
        className="rounded-md bg-gray-400 p-1 hover:bg-gray-500"
      >
        <TrashIcon className="h-3 w-3" />
      </button>
      {isDropdown ? (
        <div className="absolute -left-7 top-6 z-10 flex gap-1 rounded-md bg-white p-1">
          <button className="rounded-md bg-gray-200 p-1" onClick={_deleteRow}>
            <CheckIcon className="h-3 w-3" />
          </button>
          <button
            className="rounded-md bg-gray-200 p-1"
            onClick={() => setIsDropdown(false)}
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

const TableAddRowButton = () => {
  const { noSignInOrder } = useSelector(selector.order);

  const _addRow = async () => {
    if (noSignInOrder.isClosed) {
      return;
    }
    const newRow = {
      timestamp: serverTimestamp(),
      name: '',
      drink: '',
      size: 'S',
      price: 0,
      sugar: '100%',
      ice: '100%',
      topping: '',
      heart: 0,
      offerBy: '--',
      isTick: false,
    };
    await addDoc(
      collection(db, 'no_sign_in_orders', noSignInOrder.id, 'rows'),
      newRow,
    );
  };
  return (
    <button
      className={clsx({
        'w-full rounded-lg px-2 py-1 drop-shadow-sm hover:drop-shadow-md': true,
        'bg-white': !noSignInOrder.isClosed,
        'bg-gray-400': noSignInOrder.isClosed,
      })}
      type="button"
      onClick={_addRow}
    >
      {noSignInOrder.isClosed ? (
        <NoSymbolIcon className="m-auto h-5 w-5" />
      ) : (
        <PlusIcon className="m-auto h-5 w-5" />
      )}
    </button>
  );
};

const CalculateTotal = () => {
  const [total, setTotal] = useState('');
  const [shopOwnerPay, setShopOwnerPay] = useState('');

  const { noSignInOrder } = useSelector(selector.order);
  const { rows } = useSelector(selector.rows);

  // use memo
  const prices = rows.map((row: DrinkTableRow) => Number(row.price));
  // use memo
  const currentTotal = numberArraySum(prices);
  const currentShopOwnerPay =
    currentTotal +
    Number(noSignInOrder.shipFee) -
    Number(noSignInOrder.discount);

  useEffect(() => {
    setTotal(currentTotal.toLocaleString('en-US'));
    setShopOwnerPay(currentShopOwnerPay.toLocaleString('en-US'));
  }, [currentTotal, currentShopOwnerPay]);

  return (
    <div className="flex items-center rounded-xl bg-gray-200 px-3 pb-5 pt-9">
      <div className="relative w-fit">
        <div className="absolute -top-5 left-1 text-sm">Total</div>
        <div className="w-24 rounded-lg border-2 bg-gray-400 px-2 py-1">
          {total}
        </div>
      </div>
      <PlusIcon className="h-5 w-5" />
      <ShipFeeInput noSignInOrder={noSignInOrder} />
      <MinusIcon className="h-5 w-5" />
      <DiscountInput noSignInOrder={noSignInOrder} />
      <Bars2Icon className="h-5 w-5" />
      <div className="relative ml-4 w-fit">
        <div className="absolute -top-5 left-1 text-sm">Shop Owner Pay</div>
        <div className="w-32 rounded-lg border-2 bg-gray-400 px-2 py-1 text-center text-2xl">
          {shopOwnerPay}
        </div>
      </div>
    </div>
  );
};

const ShipFeeInput = ({ noSignInOrder }: { noSignInOrder: NoSignInOrder }) => {
  const _updateOrder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      [name]: value,
    });
  };
  return (
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Ship Fee</div>
      <input
        className="w-24 rounded-lg border-2 px-2 py-1 hover:border-gray-600"
        type="number"
        value={noSignInOrder.shipFee}
        name="shipFee"
        onChange={_updateOrder}
      />
    </div>
  );
};

const DiscountInput = ({ noSignInOrder }: { noSignInOrder: NoSignInOrder }) => {
  const _updateOrder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      [name]: value,
    });
  };
  return (
    <div className="relative w-fit">
      <div className="absolute -top-5 left-1 text-sm">Discount</div>
      <input
        className="w-24 rounded-lg border-2 px-2 py-1 hover:border-gray-600"
        type="number"
        value={noSignInOrder.discount}
        name="discount"
        onChange={_updateOrder}
      />
    </div>
  );
};

const MenusDropdown = () => {
  const { noSignInOrder } = useSelector(selector.order);

  const [isDropdown, setIsDropdown] = useState(false);

  const menuDropdownRef = useCheckClickOutside(() => setIsDropdown(false));

  return (
    <div className="relative">
      <button
        type="button"
        className="w-fit rounded-lg bg-gray-200 px-3 py-2 drop-shadow-md"
        onClick={() => setIsDropdown(true)}
      >
        {noSignInOrder.selectedMenuName !== ''
          ? noSignInOrder.selectedMenuName
          : 'Input a menu'}
      </button>
      {isDropdown ? (
        <div
          ref={menuDropdownRef}
          className="absolute top-12 flex w-full flex-col gap-2 rounded-lg bg-gray-200 p-2"
        >
          <AddMenuForm />
          <Menus noSignInOrder={noSignInOrder} />
        </div>
      ) : null}
    </div>
  );
};

const Menus = ({ noSignInOrder }: { noSignInOrder: NoSignInOrder }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  useEffect(() => {
    _fetchMenus();
  }, []);

  const _fetchMenus = async () => {
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    onSnapshot(docRef, (_doc) => {
      const updatedMenus: Menu[] = _doc.data()?.menus;
      setMenus(updatedMenus);
    });
  };

  const _selectMenu = async (menuName: string, menuLink: string) => {
    const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(docRef, {
      selectedMenuName: menuName,
      selectedMenuLink: menuLink,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {menus?.map((menu: Menu) => (
        <button
          className="rounded-lg bg-white px-3 py-1 hover:bg-gray-400"
          type="button"
          key={menu.id}
          onClick={() => _selectMenu(menu.name, menu.link)}
        >
          {menu.name}
        </button>
      ))}
    </div>
  );
};

const { v4: uuidv4 } = require('uuid');

const AddMenuForm = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const { noSignInOrder } = useSelector(selector.order);

  const _addMenu = async () => {
    const userRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
    await updateDoc(userRef, {
      menus: arrayUnion({ id: uuidv4(), name, link }),
    });
    setName('');
    setLink('');
  };

  return (
    <div className="flex items-center gap-2">
      <div>Name:</div>
      <input
        className="w-48 rounded-md border-2 px-1 hover:border-gray-600"
        type="text"
        placeholder="menu name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>Link:</div>
      <input
        className="w-48 rounded-md border-2 px-1 hover:border-gray-600"
        type="text"
        placeholder="paste link here"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        type="button"
        className="rounded-md bg-white p-1 hover:bg-gray-400"
        onClick={_addMenu}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
