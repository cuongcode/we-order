import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { Button } from '@/components/base';
import { FeatureLine } from '@/components/pages/home';
import { FEATURE_LIST } from '@/components/pages/home/data';
import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { selector } from '@/redux';
import { Main } from '@/templates/Main';

const LandingPage = () => {
  const { currentUser } = useSelector(selector.user);

  const router = useRouter();

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
        <Button
          className="mt-5"
          onClick={() =>
            router.push(currentUser ? '/create-order' : '/sign-in')
          }
          text="Let me order !"
        />
      </div>
    </Main>
  );
};

export default LandingPage;
