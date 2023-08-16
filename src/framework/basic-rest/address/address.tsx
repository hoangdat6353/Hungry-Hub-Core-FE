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
  BaseStatusResponse,
  GetAddressResponse,
} from 'src/common/models/auth-models';

const fetchAddress = async () => {
  const userToken = getToken();

  if (userToken != null) {
    const decodedToken = decodeToken(userToken);
    const userId = decodedToken?.id;

    const getAddressURL =
      LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/' + userId + '/' + 'address';

    const response = await fetch(getAddressURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle error responses
      throw new Error('Get address failed');
    }

    const data: BaseResponse<GetAddressResponse[]> = await response.json();

    return data;
  }

  throw new Error('Token not valid !');
};

const useAddressQuery = () => {
  return useQuery([API_ENDPOINTS.ADDRESS], fetchAddress);
};

export { useAddressQuery, fetchAddress };
