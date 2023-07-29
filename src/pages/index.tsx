import Link from "next/link";
import { Main } from "@/templates/Main";
import { Meta } from "@/layouts/Meta";

const LandingPage = () => {
  return (
    <Main meta={<Meta title="Landing" description="" />}>
      <div>
        <div>We Order</div>
        <Link href="/create-order/">Order</Link>
      </div>
    </Main>
  );
};

export default LandingPage;
