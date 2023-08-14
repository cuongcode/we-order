import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import router from 'next/router';
import { type ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { LogoImages } from '@/images';
import { selector, UserActions } from '@/redux';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const { currentUser } = useSelector(selector.user);

  return (
    <div className="w-full p-5 font-nunito text-gray-800 antialiased">
      {props.meta}

      <div className="flex h-12 items-center justify-between rounded-xl bg-gray-400 py-1 pl-2 pr-4">
        <div className="flex h-full items-center gap-4">
          <Link className="h-full rounded-full bg-white p-2" href="/">
            <img className="h-full" src={LogoImages.logo.src} alt="logo" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link
              href="/create-order/"
              className="rounded-lg bg-white px-2 py-1 hover:bg-gray-500"
            >
              New Order
            </Link>
          ) : (
            <Link
              href="/sign-in/"
              className="rounded-lg bg-white px-2 py-1 hover:bg-gray-500"
            >
              Sign In
            </Link>
          )}

          {currentUser ? <div>Welcome {currentUser?.nickname}</div> : null}
          {currentUser ? <SignOutDropdown /> : null}
        </div>
      </div>

      <main>{props.children}</main>
    </div>
  );
};

export { Main };

const SignOutDropdown = () => {
  const [isDropdown, setIsDropdown] = useState(false);
  const dispatch = useDispatch();

  const signOutRef = useCheckClickOutside(() => setIsDropdown(false));

  const _onDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  const _onSignOut = async () => {
    await signOut(auth);
    dispatch(UserActions.setCurrentUser(null));
    setIsDropdown(false);

    router.push('/');
  };

  return (
    <div ref={signOutRef} className="relative flex">
      <button onClick={_onDropdown} className="">
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
      {isDropdown ? (
        <button
          onClick={_onSignOut}
          className="absolute right-0 top-6 min-w-max rounded-lg bg-gray-200 p-1 px-2 hover:bg-gray-600"
        >
          Sign out
        </button>
      ) : null}
    </div>
  );
};
