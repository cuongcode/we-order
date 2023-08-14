import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CalculateTotal,
  MenusDropdown,
  SharedLink,
  ShopOwner,
  Table,
  TranferInfo,
} from '@/components/pages/order';
import { db, getOrders } from '@/firebase';
import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { OrderActions, RowsActions, selector } from '@/redux';
import { Main } from '@/templates/Main';
import type { Order } from '@/types';

const OrderPage = ({ query }: { query: any }) => {
  const { order } = useSelector(selector.order);
  const dispatch = useDispatch();

  useEffect(() => {
    _fetchOrder();
    _fetchRows();
  }, []);

  const _fetchOrder = () => {
    const docRef = doc(db, 'orders', query?.slug);
    onSnapshot(docRef, (document) => {
      const newOrder: Order = {
        id: document.id,
        shipFee: document.data()?.shipFee,
        discount: document.data()?.discount,
        shopOwnerName: document.data()?.shopOwnerName,
        shopOwnerMomo: document.data()?.shopOwnerMomo,
        selectedMenuName: document.data()?.selectedMenuName,
        selectedMenuLink: document.data()?.selectedMenuLink,
        uid: document.data()?.uid,
        timestamp: document.data()?.timestamp,
        bank1Name: document.data()?.bank1Name,
        bank1Number: document.data()?.bank1Number,
        bank2Name: document.data()?.bank2Name,
        bank2Number: document.data()?.bank2Number,
        shopOwnerAvatar: document.data()?.shopOwnerAvatar,
      };
      dispatch(OrderActions.setOrder(newOrder));
    });
  };

  const _fetchRows = () => {
    const rowsRef = collection(db, 'orders', query?.slug, 'rows');
    const q = firestoreQuery(rowsRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
      const updatedRows = snapshot.docs.map((document: any) => {
        return { ...document.data(), id: document.id };
      });
      dispatch(RowsActions.setRows(updatedRows));
    });
  };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="mt-12 flex h-fit w-full flex-col lg:flex lg:flex-row lg:gap-5">
        <div className="flex flex-col lg:w-1/2">
          <div className="mb-10 w-full">
            <img
              className="m-auto w-1/2"
              src={LogoImages.title_logo.src}
              alt="title-logo"
            />
          </div>

          <div className="mb-10 flex w-full gap-4 text-sm">
            <ShopOwner />
            <TranferInfo />
            {/* <div className="m-auto h-40 w-96 bg-green-200">
              <SimpleSlider />

              <WantedBoard />
            </div> */}
          </div>
          <div className="mb-10">
            <SharedLink />
          </div>
          <div className="mb-5">
            <Table />
          </div>
          <div className="mb-10">
            <CalculateTotal />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-1/2">
          <MenusDropdown />
          <iframe
            title="menu-frame"
            src={order.selectedMenuLink}
            className="h-screen w-full rounded-xl border-2 p-5"
          />
        </div>
      </div>
    </Main>
  );
};

export default OrderPage;

// const SimpleSlider = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: false,
//     // autoplaySpeed: 8000,
//     pauseOnHover: true,
//   };
//   return (
//     <Slider {...settings}>
//       <div className="flex gap-2 bg-green-200">
//         <img
//           className="h-24 w-24 rounded-lg bg-gray-200 object-cover"
//           src={Icons.user_icon.src}
//           alt="user-icon"
//         />
//         <div className="h-24 w-28 leading-4 tracking-tight">
//           <div>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//             Pellentesque
//           </div>
//         </div>
//       </div>
//       <div>
//         <h3>2</h3>
//       </div>
//       <div>
//         <h3>3</h3>
//       </div>
//       <div>
//         <h3>4</h3>
//       </div>
//       <div>
//         <h3>5</h3>
//       </div>
//       <div>
//         <h3>6</h3>
//       </div>
//     </Slider>
//   );
// };

// const WantedBoard = () => {
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: false,
//     autoplaySpeed: 8000,
//     pauseOnHover: true,
//   };
//   return (
//     <div className="m-auto flex h-96 w-96 flex-col items-center rounded-3xl border-2 bg-white p-3 drop-shadow-md">
//       <div className="font-bold">WANTED</div>
//       <Slider {...settings}>
//         <div className="mt-1 flex w-full gap-2">
//           <img
//             className="h-24 w-24 rounded-lg bg-gray-200 object-cover"
//             src={Icons.user_icon.src}
//             alt="user-icon"
//           />
//           <div className="h-24 w-28 leading-4 tracking-tight">
//             <div>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               Pellentesque
//             </div>
//           </div>
//         </div>
//       </Slider>
//     </div>
//   );
// };

// OrderPage.getInitialProps = async (context: any) => {
//   const { query } = context;
//   return { query };
// };

export const getStaticPaths = async () => {
  // const paths: any = [];

  // const querySnapshot = await getDocs(collection(db, 'orders'));
  // querySnapshot.forEach((_doc: any) =>
  //   paths.push({
  //     params: { slug: _doc.id },
  //   }),
  // );
  const paths = await getOrders();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params: { slug },
}: {
  params: any;
  slug: any;
}) => {
  const query = { slug };
  return { props: { query } };
};
