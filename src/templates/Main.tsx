import {
  ArrowLeftCircleIcon,
  EllipsisHorizontalCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth';
import router from 'next/router';
import { type ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Text } from '@/components/base';
import { auth } from '@/firebase';
import { useCheckClickOutside } from '@/hooks';
import { LogoImages } from '@/images';
import { selector, UserActions } from '@/redux';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-main-cbg p-2 font-dmsan text-white antialiased">
      {props.meta}

      <Navbar />

      <main className="flex min-h-0 flex-1 flex-col px-10">
        {props.children}
      </main>

      <Footer />
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
        <EllipsisHorizontalCircleIcon className="h-5 w-5" />
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

const Navbar = () => {
  const { currentUser } = useSelector(selector.user);

  const _onHome = () => {
    router.push('/');
  };
  const _onSignIn = () => {
    router.push('/sign-in/');
  };
  const _onCreateOrder = () => {
    router.push('/create-order/');
  };
  return (
    <div className="flex h-10 items-center justify-between">
      <Text preset="h4" className="font-bold" text="We Order" />
      <div className="flex h-full w-fit items-center gap-4 self-end rounded-full bg-main-bg p-2">
        {currentUser ? (
          <>
            <Text preset="p2" text={`Welcome ${currentUser?.nickname}`} />
            <Button preset="base" onClick={_onCreateOrder}>
              <PlusCircleIcon className="h-5 w-5 text-white" />
            </Button>
            <SignOutDropdown />
          </>
        ) : (
          <Button preset="base" onClick={_onSignIn}>
            <ArrowLeftCircleIcon className="h-5 w-5 text-white" />
          </Button>
        )}
        <Button preset="image" onClick={_onHome}>
          <img className="h-full" src={LogoImages.logo.src} alt="logo" />
        </Button>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="mt-10 flex self-center">
      <Text
        preset="p3"
        text="© 2024 We Oder. Made with love by Cuong Nguyen."
      />
    </div>
  );
};
