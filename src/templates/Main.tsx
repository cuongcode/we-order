import Link from 'next/link';
import type { ReactNode } from 'react';

import { LogoImages } from '@/images';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="w-full p-5 font-nunito text-gray-800 antialiased">
    {props.meta}

    <div className="flex h-12 items-center justify-between rounded-xl bg-gray-400 py-1 pl-2 pr-4">
      <div className="flex h-full items-center gap-4">
        <Link className="h-full rounded-full bg-white p-2" href="/">
          <img className="h-full" src={LogoImages.logo.src} alt="logo" />
        </Link>
        <Link href="/create-order/" className="rounded-lg bg-white px-2 py-1">
          Create Order
        </Link>
      </div>
      <div className="flex gap-4">
        <div>Login</div>
        <div>Register</div>
      </div>
    </div>

    <img
      className="m-auto mt-12 w-7/12 "
      src={LogoImages.title_logo.src}
      alt="title-logo"
    />

    <main>{props.children}</main>
  </div>
);

export { Main };
