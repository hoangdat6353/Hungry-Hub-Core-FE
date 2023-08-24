import { Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { LOCAL_BASE_URL, LOCAL_PRODUCTS_CONTROLLER } from 'src/common/constants/api-constant';
import { BaseResponse } from 'src/common/models/auth-models';

export const fetchProduct = async (_slug: string) => {
  const getProductDetailsURL = LOCAL_BASE_URL + LOCAL_PRODUCTS_CONTROLLER + '/' + _slug + '/details';

    const response = await fetch(getProductDetailsURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle error responses
      throw new Error('Get Product Failed');
    }

    const data: BaseResponse<Product> = await response.json();

    if (!data)
    {
      throw new Error('DATA NOT FOUND!');
    }

    return data.data as Product;
};
export const useProductQuery = (slug: string) => {
  return useQuery<Product, Error>([API_ENDPOINTS.PRODUCT, slug], () =>
    fetchProduct(slug)
  );
};
