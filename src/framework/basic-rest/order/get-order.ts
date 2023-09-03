import { Order, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { State } from '@contexts/cart/cart.reducer';
import { useLocalStorage } from 'react-use';
import { useRetrievedData } from '@utils/use-retrieved-data';
import { Item } from '@contexts/cart/cart.utils';
import {
  Address,
  BaseResponse,
  GetAddressResponse,
} from 'src/common/models/auth-models';
import {
  LOCAL_BASE_URL,
  LOCAL_PRODUCTS_CONTROLLER,
} from 'src/common/constants/api-constant';

export interface Contact {
  id: string;
  default: boolean;
  number: string;
  title: string;
}

export interface IGetOrderRequestModel {
  tracking_number: string;
  total: number;
  discount: number;
  customerId: string;
  shipping_fee: number;
  shipping_address: GetAddressResponse;
  payment_gateway: string;
  products: Item[];
  contact: Contact;
  deliveryDate: string;
  deliveryTime: string;
  deliveryTips: number;
  deliveryNotes?: string;
}

export interface IGetOrderResponseModel extends IGetOrderRequestModel {
  isSuccess: boolean;
}

export const fetchOrder = async (_id: string, retrievedData: State) => {
  const orderTrackingNumber = generateOrderNumber();

  if (retrievedData) {
    try {
      const deliveryAddressJSON = localStorage.getItem('deliveryAddress');
      const deliveryContactJSON = localStorage.getItem('deliveryContact');
      const deliveryDate = localStorage.getItem('deliveryDateSchedule');
      const deliveryTime = localStorage.getItem('deliveryTimeSchedule');
      const deliveryTipsString = localStorage.getItem('deliveryTips');
      const deliveryNotes = localStorage.getItem('deliveryNotes');

      const deliveryContact = JSON.parse(deliveryContactJSON!) as Contact;
      const deliveryAddress = JSON.parse(
        deliveryAddressJSON!
      ) as GetAddressResponse;
      const deliveryTips = parseInt(deliveryTipsString!, 10);

      const paymentMethod = 'Cash on delivery';

      const requestModel: IGetOrderRequestModel = {
        tracking_number: orderTrackingNumber,
        total: retrievedData.total,
        discount: 0,
        customerId: _id,
        shipping_fee: 30000,
        shipping_address: deliveryAddress,
        products: retrievedData.items,
        contact: deliveryContact,
        payment_gateway: paymentMethod,
        deliveryDate: deliveryDate as string,
        deliveryTime: deliveryTime as string,
        deliveryTips: deliveryTips,
        deliveryNotes: deliveryNotes as string,
      };

      const createOrderURL =
        LOCAL_BASE_URL + LOCAL_PRODUCTS_CONTROLLER + '/order';

      const response = await fetch(createOrderURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestModel),
      });

      if (!response.ok) {
        // Handle error responses
        throw new Error('Create order failed');
      }

      const data: BaseResponse<Order> = await response.json();

      if (data.data != null) {
        return data.data;
      } else {
        throw new Error('NO DATA RETURNS ERROR');
      }
    } catch (error) {
      console.log('ERROR:', error);
      throw error; // Throw the error instead of returning null
    }
  } else {
    console.log('No data found in localStorage');
    throw new Error('No data found in localStorage'); // Throw an error when retrievedData is falsy
  }
};

export const useOrderQuery = (id: string, retrievedData: State) => {
  return useQuery<Order, Error>([API_ENDPOINTS.ORDER, id, retrievedData], () =>
    fetchOrder(id, retrievedData)
  );
};

function generateOrderNumber() {
  const randomDigits = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `HGH${randomDigits}`;
}
