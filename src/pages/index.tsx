// import Link from "next/link";
import { StopIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const LandingPage = () => {
  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="m-auto max-w-5xl font-semibold">
        <div className="mb-3 mt-12 w-full">
          <img
            className="m-auto w-1/2"
            src={LogoImages.title_logo.src}
            alt="title-logo"
          />
        </div>
        <div className="text-center text-lg">
          An easy way to order drink and food together
        </div>
        <div className="text-center text-lg">Order together is fun !</div>
        <div className="m-auto mt-24 flex w-fit list-disc flex-col gap-2">
          <div>Features :</div>
          <div className="flex items-center gap-2">
            <StopIcon className="h-4 w-4" />
            <span>Import and save your favorite</span>
            <span className="text-yellow-500">MENUS</span>
          </div>
          <div className="flex items-center gap-2">
            <StopIcon className="h-4 w-4" />
            <span className="text-purple-500">OFFER</span>
            <span>
              your friends drinks, your bill will be counted separately
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StopIcon className="h-4 w-4" />
            <span>If someone offers you a drink, give them a big</span>
            <HeartIcon className="h-6 w-6 text-red-500" />
            <span>(cause they may offer more)</span>
          </div>
          <div className="flex items-center gap-2">
            <StopIcon className="h-4 w-4" />
            <span>Set a</span>
            <span className="text-green-500">COUNTDOWN</span>
            <span>cause someone just cannot make up their mind</span>
          </div>
          <div className="flex items-center gap-2">
            <StopIcon className="h-4 w-4" />
            <span className="text-orange-500">WANTED</span>
            <span>someone if he/she still owes you money</span>
          </div>
        </div>
        <div className="m-auto mt-20 w-fit">
          <Link href="/create-order/">
            <div className=" w-fit rounded-2xl bg-gray-300 px-6 py-3 text-center text-2xl hover:bg-gray-500">
              Let me order !
            </div>
          </Link>
        </div>
      </div>
    </Main>
  );
};

export default LandingPage;
