import Link from 'next/link'

const LandingPage = () => {

  return (
    <div>
      <div>We Order</div>
      <Link href='/create-order/' >Order</Link>
    </div>
  );
};

export default LandingPage;
