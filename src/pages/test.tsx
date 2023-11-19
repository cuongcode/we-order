import React from 'react';

import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { ApiInstance } from '@/services/api';
import { handleError } from '@/services/apiHelper';
import { Main } from '@/templates/Main';

const Test = ({
  dish_type_names,
  dishes,
}: {
  dish_type_names: any;
  dishes: any;
}) => {
  // useEffect(() => {
  //   // scraping();
  // }, []);
  // https://shopeefood.vn/ho-chi-minh/lasimi-tra-ngon-dam-vi-phan-van-tri
  // const scraping = async () => {
  //   try {
  //     const res = await fetch(
  //       'https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=ho-chi-minh/lasimi-tra-ngon-dam-vi-phan-van-tri',
  //       {
  //         method: 'GET',
  //         headers: {
  //           // 'x-foody-access-token': '',
  //           'x-foody-api-version': 1,
  //           'x-foody-app-type': 1004,
  //           'x-foody-client-id': '',
  //           // 'x-foody-client-language': 'vi',
  //           'x-foody-client-type': 1,
  //           'x-foody-client-version': '3.0.0',
  //         },
  //       },
  //     );
  //     const json = await res.json();
  //     console.log('json', json);
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  return (
    <Main meta={<Meta title="WeOrder" description="" />}>
      <div className="m-auto max-w-5xl font-semibold">
        <div className="mb-20 mt-12 w-full">
          <img
            className="m-auto w-1/2"
            src={LogoImages.title_logo.src}
            alt="title-logo"
          />
        </div>

        <div>Work in progress</div>
        {dish_type_names.map((type: any) => (
          <div key={type}>{type}</div>
        ))}
        {dishes.map((type: any) =>
          type.map((dish: any) => (
            <div key={dish.dish_name}>
              <div>{dish.dish_name}</div>
              <div>{dish.dish_price}</div>
            </div>
          )),
        )}
      </div>
    </Main>
  );
};

export default Test;

export async function getStaticProps() {
  const res1 = await ApiInstance.getDeliveryId(
    'ho-chi-minh/lasimi-tra-ngon-dam-vi-phan-van-tri',
  );

  const { result, error } = handleError(res1);
  if (error) {
    console.log(error.message);
  }
  const deliveryId = result.reply.delivery_id;

  const res = await ApiInstance.getDishes(deliveryId);
  // @ts-ignore
  const dish_types = res.data.reply.menu_infos;
  const dish_type_names = dish_types.map((type: any) => type.dish_type_name);
  const dishes = dish_types.map((type: any) =>
    type.dishes.map((dish: any) => {
      return { dish_name: dish.name, dish_price: dish.price.value };
    }),
  );
  return {
    props: { dish_type_names, dishes },
    // revalidate: 10, // rerun after 10 seconds
  };
}
