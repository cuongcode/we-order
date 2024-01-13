import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { Button, Text } from '@/components/base';
import { FeatureLine } from '@/components/pages/home';
import { FEATURE_LIST } from '@/components/pages/home/data';
import { Meta } from '@/layouts/Meta';
import { selector } from '@/redux';
import { Main } from '@/templates/Main';

const LandingPage = () => {
  const { currentUser } = useSelector(selector.user);

  const router = useRouter();

  return (
    <Main meta={<Meta title="We Order" description="" />}>
      <div className="m-auto flex max-w-5xl flex-col items-center">
        <Text preset="h1b" text="Order together is fun !" />
        <Text preset="p1" text="An easy way to order drink and food together" />
        <div className="m-auto mt-24 flex w-fit list-disc flex-col gap-2">
          <div>Features :</div>
          {FEATURE_LIST.map((feature) => (
            <FeatureLine key={feature.id}>{feature.content}</FeatureLine>
          ))}
        </div>
        <Button
          className="mt-24 self-stretch"
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
