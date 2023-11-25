import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Portal } from '@/components/common';
import { useCheckClickOutside } from '@/hooks';
import { selector } from '@/redux';

export const CheckPasswordPortal = ({
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
