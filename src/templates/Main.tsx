import { signOut } from 'firebase/auth';
import Link from 'next/link';
import router from 'next/router';
import type { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '@/firebase';
import { LogoImages } from '@/images';
import { selector, UserActions } from '@/redux';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const { currentUser } = useSelector(selector.user);
  const dispatch = useDispatch();

  const _onSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(UserActions.setCurrentUser(null));
      router.push('/');
    } catch (error) {
      console.log('sign out error', error);
    }
  };

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
          <Link
            href={currentUser ? '/create-order/' : '/sign-in/'}
            className="rounded-lg bg-white px-2 py-1 hover:bg-gray-500"
          >
            New Order
          </Link>
          {currentUser ? <div>Welcome {currentUser?.nickname}</div> : null}
          {currentUser ? <button onClick={_onSignOut}>Sign out</button> : null}
        </div>
      </div>

      <main>{props.children}</main>
    </div>
  );
};

export { Main };
