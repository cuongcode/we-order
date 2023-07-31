import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

export const SharedLink = ({ orderId }: { orderId: string }) => {
  const _copyClipboard = () => {
    //
  };

  return (
    <div className="flex flex-col gap-2">
      <div>Share this link :</div>
      <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg w-fit py-1 px-3">
        <div>https://we-order-omega.vercel.app/order/{orderId}</div>
        <button type="button" onClick={_copyClipboard}>
          <ClipboardDocumentIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};