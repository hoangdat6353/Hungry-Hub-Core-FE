import { Role } from '../enums/enums';

export interface TokensResponse {
  token: string;
}

export interface LoginResponse extends TokensResponse {
  email: string;
  role: Role;
}

export interface BaseResponse<T> {
  data: T;
  statusCode?: number;
  message?: string;
}

export interface BasePaginationResponse<T> {
  data: T;
  statusCode?: number;
  paginationInfo: Pagination;
  total: number;
  totalPages: number;
  message?: string;
}

export interface Pagination {
  nextPageUrl: string;
}

export interface BaseStatusResponse {
  isSuccess: string;
}

export interface GetAddressResponse {
  id: string;
  title: string;
  default: boolean;
  address: Address;
}

export interface Address {
  formatted_address: string;
}

export interface GetContactResponse {
  id: string;
  title: string;
  default: string;
  number: string;
}

export interface GetOrdersResponse {
  id: string;
  tracking_number: string;
  amount: number;
  total: number;
  delivery_fee: number;
  discount: number;
  status: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    serial: number;
    color: string;
  };
  delivery_time: string;
  created_at: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: {
      id: number;
      thumbnail: string;
      original: string;
    };
  }>;
  shipping_address: {
    shipping_address: string;
  };
}
