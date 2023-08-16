import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { decodeToken, getToken } from '@framework/utils/get-token';
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
  if (userToken != null) {
    const decodedToken = decodeToken(userToken);
    const userId = decodedToken?.id;

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

    return data;
  }

  throw new Error('Token not valid !');
};

const useContactQuery = () => {
  let userId = '';
  if (userToken != null) {
    const decodedToken = decodeToken(userToken);
    userId = decodedToken?.id as string;
  }
  const getContactURL =
    LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/' + userId + '/' + 'contact';

  return useQuery([getContactURL], fetchContact);
};

export { useContactQuery, fetchContact };
