import Link from "next/link";
import { LogoImages } from "@/images";
import type { ReactNode } from "react";

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="w-full text-gray-700 antialiased p-5 bg-gray-200">
    {props.meta}

    <div className="flex h-12 py-1 pl-2 pr-4 bg-gray-400 rounded-xl justify-between items-center">
      <div className="flex gap-4 h-full items-center">
        <Link className="bg-white p-2 rounded-full h-full" href="/">
          <img className="h-full" src={LogoImages.logo.src} alt="logo" />
        </Link>
        <Link href="/create-order/" className="py-1 px-2 rounded-lg bg-white">
          Create Order
        </Link>
      </div>
      <div className="flex gap-4">
        <div>Login</div>
        <div>Register</div>
      </div>
    </div>

<img className="w-7/12 m-auto mt-5" src={LogoImages.title_logo.src} alt="title-logo" />

    <main>{props.children}</main>
  </div>
);

export { Main };
