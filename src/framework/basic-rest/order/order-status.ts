import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { getUserId } from '@framework/utils/get-token';
import {
  LOCAL_BASE_URL,
  LOCAL_PRODUCTS_CONTROLLER,
} from 'src/common/constants/api-constant';
import { BaseResponse, GetOrdersResponse } from 'src/common/models/auth-models';

const fetchOrderStatus = async () => {
  const getAllStatusURL =
    LOCAL_BASE_URL + LOCAL_PRODUCTS_CONTROLLER + '/status';

  const response = await fetch(getAllStatusURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Handle error responses
    throw new Error('Get all orders error');
  }

  const status: BaseResponse<any[]> = await response.json();
  return {
    data: status.data,
  };
};

const useOrderStatusQuery = () => {
  return useQuery([API_ENDPOINTS.ORDER_STATUS], fetchOrderStatus);
};

export { useOrderStatusQuery, fetchOrderStatus };
