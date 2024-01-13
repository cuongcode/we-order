import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Text } from '@/components/base';
import { Portal } from '@/components/common';
import { db } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { selector } from '@/redux';

import { CheckPasswordPortal } from './check-password-portal';

export const ShopOwnerTransferInfo = () => {
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
    <div className="flex h-full w-full flex-col items-center gap-2 rounded-3xl bg-slate-800 p-3 drop-shadow-md">
      <div className="relative flex w-full items-center justify-center">
        <Text text="TRANSFER INFO" />
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
      <TransferInfo />
    </div>
  );
};

const TransferInfo = () => {
  const { noSignInOrder } = useSelector(selector.order);
  return (
    <div className="grid w-full grid-cols-[48px_12px_1fr] grid-rows-2 flex-col">
      <Text preset="p2" text="Momo" />
      <Text preset="p2" text=":" className="w-fit" />
      <Text preset="p2" text={noSignInOrder?.momo || '--'} />
      <Text preset="p2" text="Bank" />
      <Text preset="p2" text=":" />
      <div className="flex items-center gap-4">
        <Text
          preset="p2"
          text={
            noSignInOrder ? noSignInOrder.bank1Name?.toString() || '--' : ''
          }
        />
        <Text
          preset="p2"
          text={noSignInOrder ? noSignInOrder.bank1Number?.toString() : ''}
        />
      </div>
    </div>
  );
};
