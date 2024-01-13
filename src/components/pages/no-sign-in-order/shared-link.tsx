import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Text } from '@/components/base';
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
      <Text preset="h4" text="Share this link :" />
      <div className="flex w-fit items-center gap-4 rounded-xl border border-main-bg px-6 py-4">
        <Text
          preset="p2"
          className="font-light"
          text={`https://we-order-omega.vercel.app/no-sign-in-order/${noSignInOrder.id}`}
        />

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
