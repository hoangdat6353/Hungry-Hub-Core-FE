import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { decodeToken, getToken, getUserId } from '@framework/utils/get-token';
import {
  LOCAL_BASE_URL,
  LOCAL_USERS_CONTROLLER,
} from 'src/common/constants/api-constant';
import {
  BaseResponse,
  GetAddressResponse,
  GetContactResponse,
} from 'src/common/models/auth-models';
const userToken = getToken();

const fetchContact = async () => {
  const userId = getUserId();

  const getContactURL =
    LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/' + userId + '/' + 'contact';

  const response = await fetch(getContactURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Handle error responses
    throw new Error('Get address failed');
  }

  const data: BaseResponse<GetContactResponse[]> = await response.json();

  return data.data;
};

const useContactQuery = () => {
  const queryKey = 'contactData'; // Use a stable key
  return useQuery(queryKey, fetchContact);
};

export { useContactQuery, fetchContact };
