import React from 'react';

const NoSignInOrderPage = ({ query }: { query: any }) => {
  // const _fetchOrder = () => {
  //   const docRef = doc(db, 'orders', query?.slug);
  //   onSnapshot(docRef, (document) => {
  //     const newOrder: Order = {
  //       id: document.id,
  //       shipFee: document.data()?.shipFee,
  //       discount: document.data()?.discount,
  //       selectedMenuName: document.data()?.selectedMenuName,
  //       selectedMenuLink: document.data()?.selectedMenuLink,
  //       uid: document.data()?.uid,
  //       timestamp: document.data()?.timestamp,
  //       isClosed: document.data()?.isClosed,
  //       heart: document.data()?.heart,
  //     };
  //     dispatch(OrderActions.setOrder(newOrder));
  //   });
  // };

  return (
    <div>
      <div>Work in progress</div>
      <div>{query.slug}</div>
    </div>
  );
};

export default NoSignInOrderPage;

NoSignInOrderPage.getInitialProps = async (context: any) => {
  const { query } = context;
  return { query };
};
