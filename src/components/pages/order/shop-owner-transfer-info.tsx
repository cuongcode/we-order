import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '@/firebase';
import { selector } from '@/redux';
import type { User } from '@/types';

export const ShopOwnerTranferInfo = () => {
  return (
    <div className="flex h-40 w-56 flex-col items-center gap-2 rounded-3xl border-2 bg-white p-3 drop-shadow-md">
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
  const { currentUser, shopOwner } = useSelector(selector.user);
  const [momo, setMomo] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const _onEdit = () => {
    if (shopOwner) {
      setMomo(shopOwner.momo);
    }
    setIsEdit(true);
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMomo(value);
  };

  const _updateUserMomo = async () => {
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(docRef, {
        momo,
      });
      setIsEdit(false);
    }
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
            {shopOwner?.momo || '--'}
          </div>
          {currentUser && currentUser?.uid === shopOwner?.uid ? (
            <button className="" onClick={_onEdit}>
              <PencilSquareIcon className="h-3 w-3" />
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};

const ShopOwnerBankInput = ({
  field1,
  field2,
}: {
  field1: keyof User;
  field2: keyof User;
}) => {
  const { currentUser, shopOwner } = useSelector(selector.user);
  const [bankName, setBankName] = useState<any>('');
  const [bankNumber, setBankNumber] = useState<any>('');
  const [isEdit, setIsEdit] = useState(false);

  const _onEdit = () => {
    if (shopOwner) {
      setBankName(shopOwner[field1]);
      setBankNumber(shopOwner[field2]);
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
    if (currentUser) {
      const docRef = doc(db, 'users', currentUser?.uid);
      await updateDoc(docRef, {
        [field1]: bankName,
        [field2]: bankNumber,
      });
      setIsEdit(false);
    }
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
              {shopOwner ? shopOwner[field1]?.toString() || '--' : ''}
            </div>
            <div className="w-32 rounded-md border-2 border-white px-1">
              {shopOwner ? shopOwner[field2]?.toString() : ''}
            </div>
          </div>
          {currentUser && currentUser?.uid === shopOwner?.uid ? (
            <button className="" onClick={_onEdit}>
              <PencilSquareIcon className="h-3 w-3" />
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};
