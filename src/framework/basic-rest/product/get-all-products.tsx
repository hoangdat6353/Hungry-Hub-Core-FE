import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import shuffle from 'lodash/shuffle';
import { useInfiniteQuery } from 'react-query';
import {
  LOCAL_BASE_URL,
  LOCAL_PRODUCTS_CONTROLLER,
} from 'src/common/constants/api-constant';
import { BasePaginationResponse } from 'src/common/models/auth-models';
type PaginatedProduct = {
  data: Product[];
  paginatorInfo: any;
};

type IQuery = {
  limit: number;
  category?: string;
  q?: string;
};
const fetchProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;

  const parsedQuery = _params as IQuery;
  let query = '';
  if (parsedQuery.q != null && parsedQuery.q != undefined) {
    query = parsedQuery.q as string;
  } else if (
    parsedQuery.category != null &&
    parsedQuery.category != undefined
  ) {
    query = parsedQuery.category;
  }

  const searchProductsURL =
    LOCAL_BASE_URL +
    LOCAL_PRODUCTS_CONTROLLER +
    '/search?query=' +
    query +
    '&page=1&limit=20';

  const response = await fetch(searchProductsURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Handle error responses
    throw new Error('Update failed');
  }

  const products: BasePaginationResponse<Product[]> = await response.json();

  return {
    data: products.data,
    paginatorInfo: {
      nextPageUrl: products.paginationInfo.nextPageUrl,
    },
  };
};

const useProductsQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>(
    [API_ENDPOINTS.PRODUCTS, options],
    fetchProducts,
    {
      getNextPageParam: ({ paginatorInfo }) => paginatorInfo.nextPageUrl,
    }
  );
};

export { useProductsQuery, fetchProducts };
