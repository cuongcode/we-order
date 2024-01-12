import Link from 'next/link';
import { useSelector } from 'react-redux';

import { Button } from '@/components/base';
import { FeatureLine } from '@/components/pages/home';
import { FEATURE_LIST } from '@/components/pages/home/data';
import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { selector } from '@/redux';
import { Main } from '@/templates/Main';
import type { User } from '@/types';

const LandingPage = () => {
  const { currentUser } = useSelector(selector.user);
  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="m-auto flex max-w-5xl flex-col font-semibold">
        <img
          className="mb-3 mt-12 w-1/2 self-center"
          src={LogoImages.title_logo.src}
          alt="title-logo"
        />
        <div className="text-center text-lg">
          An easy way to order drink and food together
          <br />
          Order together is fun !
        </div>
        <div className="m-auto mt-24 flex w-fit list-disc flex-col gap-2">
          <div>Features :</div>
          {FEATURE_LIST.map((feature) => (
            <FeatureLine key={feature.id}>{feature.content}</FeatureLine>
          ))}
        </div>
        <ButtonOrder currentUser={currentUser} />
        <Button className="mt-5" text="Card" />
      </div>
    </Main>
  );
};

export default LandingPage;

const ButtonOrder = ({ currentUser }: { currentUser: User | null }) => {
  return (
    <div className="m-auto mt-20 w-fit">
      <Link href={currentUser ? '/create-order/' : '/sign-in/'}>
        <div className="w-fit rounded-2xl bg-gray-300 px-6 py-3 text-center text-2xl hover:bg-gray-500">
          Let me order !
        </div>
      </Link>
    </div>
  );
};
