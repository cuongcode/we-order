import apisauce from 'apisauce';
import axios from 'axios';

const axiosApiShopeeFood = axios.create({
  baseURL: 'https://gappapi.deliverynow.vn/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-foody-api-version': 1,
    'x-foody-app-type': 1004,
    'x-foody-client-id': '',
    'x-foody-client-type': 1,
    'x-foody-client-version': '3.0.0',
  },
  timeout: 50000,
});

const create = () => {
  const apiShopeeFood = apisauce.create({
    baseURL: 'https://gappapi.deliverynow.vn/api/',
    axiosInstance: axiosApiShopeeFood,
  });

  // SET AUTH TOKEN
  // const setAuthToken = (userAuth?: string) => {
  //   if (userAuth) {
  //     apiCoingecko.setHeader('Authorization', `Bearer ${userAuth}`);
  //   } else {
  //     apiCoingecko.setHeader('Authorization', '');
  //   }
  // };

  // API function

  // TEST
  const getDeliveryId = (restaurant: String) =>
    apiShopeeFood.get(`delivery/get_from_url?url=${restaurant}`);
  const getDishes = (id: String) =>
    apiShopeeFood.get(`dish/get_delivery_dishes?id_type=2&request_id=${id}`);

  return {
    // setAuthToken,
    getDeliveryId,
    getDishes,
  };
};

export const ApiInstance = create();
