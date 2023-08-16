import { QueryOptionsType, Product } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { BaseResponse } from 'src/common/models/auth-models';
import {
  LOCAL_BASE_URL,
  LOCAL_PRODUCTS_CONTROLLER,
} from 'src/common/constants/api-constant';

export const fetchRelatedProducts = async (
  queryKey: any, // Change the destructuring to receive the full array
  productId: string
) => {
  const [_, options] = queryKey; // Destructure the array to get the options

  const relatedProductsURL =
    LOCAL_BASE_URL +
    LOCAL_PRODUCTS_CONTROLLER +
    '/' +
    productId +
    '/' +
    'related-products';
  const response = await fetch(relatedProductsURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Handle error responses
    throw new Error('Get all related products');
  }

  const relatedProducts: BaseResponse<Product[]> = await response.json();

  return relatedProducts.data as Product[];
};

export const useRelatedProductsQuery = (
  productId: string,
  options: QueryOptionsType
) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.RELATED_PRODUCTS, options], // Pass the array containing the endpoint and options
    () =>
      fetchRelatedProducts([API_ENDPOINTS.RELATED_PRODUCTS, options], productId) // Pass the array and productId
  );
};
