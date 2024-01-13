import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { selector } from '@/redux';

export const SharedLink = () => {
  const [isClick, setIsClick] = useState(false);

  const { noSignInOrder } = useSelector(selector.order);

  const _copyClipboard = () => {
    navigator.clipboard.writeText(
      `https://we-order-omega.vercel.app/no-sign-in-order/${noSignInOrder.id}`,
    );
    setIsClick(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div>Share this link :</div>
      <div className="flex w-fit items-center gap-2 rounded-lg border border-slate-800 px-3 py-1 text-sm font-light">
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
