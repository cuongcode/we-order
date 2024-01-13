import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Text } from '@/components/base';
import { Portal } from '@/components/common';
import { useCheckClickOutside } from '@/hooks';
import { Icons } from '@/images';
import { selector } from '@/redux';

export const ShopOwnerProfile = () => {
  const { noSignInOrder } = useSelector(selector.order);
  return (
    <div className="relative flex h-full w-full flex-col items-center gap-6 rounded-3xl bg-slate-800 p-3">
      <div className="relative h-28 w-full rounded-2xl bg-slate-900">
        <ShopOwnerImage />
      </div>
      <div className="flex flex-col">
        <Text
          preset="h3b"
          text={noSignInOrder?.nickname}
          className="self-center font-semibold"
        />
        <Text
          preset="p2"
          text="Shop Owner"
          className="self-center font-light"
        />
      </div>
      <TransferInfo className="mb-3 self-center" />
      {/* <CloseOrderButton /> */}
    </div>
  );
};

const ShopOwnerImage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useCheckClickOutside(() => {
    setIsOpen(false);
  });

  const _onOpen = async () => {
    setIsOpen(true);
  };

  return (
    <div className="absolute  w-fit rounded-full bg-slate-800 p-1">
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

// const CloseOrderButton = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { noSignInOrder } = useSelector(selector.order);

//   const _onCheckPassword = () => {
//     setIsOpen(true);
//   };

//   const _updateOrder = async () => {
//     setIsOpen(false);
//     const docRef = doc(db, 'no_sign_in_orders', noSignInOrder.id);
//     await updateDoc(docRef, {
//       isClosed: !noSignInOrder.isClosed,
//     });
//   };

//   return (
//     <>
//       <button
//         className="absolute top-40 flex w-36 items-center gap-2 rounded-lg bg-slate-800 p-1 px-2 hover:bg-gray-400"
//         onClick={_onCheckPassword}
//       >
//         {noSignInOrder.isClosed ? (
//           <>
//             <LockClosedIcon className="h-4 w-4" />
//             <div className="min-w-max">Order is closed</div>
//           </>
//         ) : (
//           <>
//             <LockOpenIcon className="h-4 w-4" />
//             <div className="min-w-max">Order is open</div>
//           </>
//         )}
//       </button>
//       {isOpen ? (
//         <CheckPasswordPortal
//           onClose={() => setIsOpen(false)}
//           onEdit={_updateOrder}
//         />
//       ) : null}
//     </>
//   );
// };

const TransferInfo = ({ className }: { className: string }) => {
  const { noSignInOrder } = useSelector(selector.order);
  return (
    <div className={clsx('flex w-64 justify-between', className)}>
      <div className="flex flex-col items-center">
        <Text preset="h4b" text="Momo" />
        <Text
          preset="p2"
          className="font-light"
          text={noSignInOrder?.momo || '--'}
        />
      </div>
      <div className="flex flex-col items-center">
        <Text preset="h4b" text="Bank" />
        <div className="flex items-center gap-3">
          <Text
            preset="p2"
            className="font-light"
            text={
              noSignInOrder ? noSignInOrder.bank1Name?.toString() || '--' : ''
            }
          />
          <Text
            preset="p2"
            className="font-light"
            text={noSignInOrder ? noSignInOrder.bank1Number?.toString() : ''}
          />
        </div>
      </div>
    </div>
  );
};
