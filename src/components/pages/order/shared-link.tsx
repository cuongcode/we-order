import { useState } from "react";

import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

export const SharedLink = ({ orderId }: { orderId: string }) => {
  const [isClick, setIsClick] = useState(false);

  const _copyClipboard = () => {
    navigator.clipboard.writeText(
      `https://we-order-omega.vercel.app/order/${orderId}`
    );
    setIsClick(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div>Share this link :</div>
      <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg w-fit py-1 px-3">
        <div>https://we-order-omega.vercel.app/order/{orderId}</div>
        {!isClick ? (
          <button type="button" onClick={_copyClipboard}>
            <ClipboardDocumentIcon className="w-5 h-5" />
          </button>
        ) : (
          <CheckIcon
            className="w-5 h-5 text-green-500"
            onMouseLeave={() => {
              setTimeout(() => setIsClick(false), 1000);
            }}
          />
        )}
      </div>
    </div>
  );
};
