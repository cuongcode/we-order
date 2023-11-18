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
  const res = await fetch(
    'https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=ho-chi-minh/lasimi-tra-ngon-dam-vi-phan-van-tri',
    {
      method: 'GET',
    },
  );
  const json = await res.json();
  // const { data } = await axios.get('https://shopeefood.vn/');
  //   col-auto item-restaurant-img
  // item-restaurant-name
  // col-auto product-price
  // 	current-price
  // const $ = cheerio.load(data);
  // const items = $('.item-restaurant-name').text();
  // const prices = $('.current-price').text();
  // const p = $('p').text();
  console.log(json);
  return {
    props: {},
    // revalidate: 10, // rerun after 10 seconds
  };
}
