import React, { useEffect, useState } from 'react';

import { LogoImages } from '@/images';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Test = (props: any) => {
  const [test, setTest] = useState('');
  useEffect(() => {
    // scraping();
  }, []);
  // https://shopeefood.vn/ho-chi-minh/lasimi-tra-ngon-dam-vi-phan-van-tri
  // const scraping = async () => {
  //   try {
  //     const res = axios.get('https://zingnews.vn/');
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
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
        {/* <div>{props.data}</div> */}
      </div>
    </Main>
  );
};

export default Test;

export async function getStaticProps() {
  // const { data } = await axios.get('https://zingnews.vn/');
  // const { data } = await axios.get(
  //   'https://shopeefood.vn/ho-chi-minh/lasimi-tra-ngon-dam-vi-phan-van-tri',
  // );
  // const { data } = await axios.get(
  //   'https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=ho-chi-minh/lasimi-tra-ngon-dam-vi-phan-van-tri',
  // );
  try {
    const res = await fetch(
      'https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=ho-chi-minh/lasimi-tra-ngon-dam-vi-phan-van-tri',
      {
        method: 'GET',
        headers: {
          'x-foody-access-token': '',
          'x-foody-api-version': 1,
          'x-foody-app-type': 1004,
          'x-foody-client-id': '',
          'x-foody-client-language': 'vi',
          'x-foody-client-type': 1,
          'x-foody-client-version': '3.0.0',
          'x-sap-ri': '96ec58652e93bbc0c351353edbdf8c6c45fb1c621c2cb0b7',
        },
      },
    );
    const json = await res.json();
    console.log(json);
  } catch (error) {
    console.log('asd', error);
  }
  // const { data } = await axios.get('https://shopeefood.vn/');
  //   col-auto item-restaurant-img
  // item-restaurant-name
  // col-auto product-price
  // 	current-price
  // const $ = cheerio.load(data);
  // const items = $('.item-restaurant-name').text();
  // const prices = $('.current-price').text();
  // const p = $('p').text();
  return {
    props: {},
    // revalidate: 10, // rerun after 10 seconds
  };
}
