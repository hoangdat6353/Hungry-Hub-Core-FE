import { QueryOptionsType, Order } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { getUserId } from '@framework/utils/get-token';
import {
  LOCAL_BASE_URL,
  LOCAL_PRODUCTS_CONTROLLER,
} from 'src/common/constants/api-constant';
import { BaseResponse } from 'src/common/models/auth-models';

const fetchOrders = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const userId = getUserId();
  const getAllOrderByUserIdURL =
    LOCAL_BASE_URL + LOCAL_PRODUCTS_CONTROLLER + '/' + userId + '/' + 'orders';
  const response = await fetch(getAllOrderByUserIdURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Handle error responses
    throw new Error('Get all orders error');
  }

  const orders: BaseResponse<any[]> = await response.json();

  return {
    data: orders.data,
  };
};

const useOrdersQuery = (options: QueryOptionsType) => {
  return useQuery([API_ENDPOINTS.ORDERS, options], fetchOrders);
};

export { useOrdersQuery, fetchOrders };
