import { CategoriesQueryOptionsType, Category } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { BaseResponse } from 'src/common/models/auth-models';
import {
  LOCAL_BASE_URL,
  LOCAL_CATEGORIES_CONTROLLER,
} from 'src/common/constants/api-constant';

export const fetchCategories = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const getAllCategoriesURL =
    LOCAL_BASE_URL + LOCAL_CATEGORIES_CONTROLLER + '/';

  const {
    data: { data },
  } = await http.get(getAllCategoriesURL);

  return { categories: { data: data as Category[] } };
};
export const useCategoriesQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: { data: Category[] } }, Error>(
    [API_ENDPOINTS.CATEGORIES, options],
    fetchCategories
  );
};
