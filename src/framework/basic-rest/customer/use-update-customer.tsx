import { decodeToken, getToken } from '@framework/utils/get-token';
import { useMutation } from 'react-query';
import {
  LOCAL_BASE_URL,
  LOCAL_USERS_CONTROLLER,
} from 'src/common/constants/api-constant';
import {
  BaseResponse,
  BaseStatusResponse,
  LoginResponse,
} from 'src/common/models/auth-models';

export interface UpdateUserType {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
}
async function updateUser(input: UpdateUserType) {
  const userToken = getToken();

  if (userToken != null) {
    const decodedToken = decodeToken(userToken);
    const userId = decodedToken?.id;

    const loginURL = LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/' + userId;

    const response = await fetch(loginURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      // Handle error responses
      throw new Error('Update failed');
    }

    const data: BaseResponse<BaseStatusResponse> = await response.json();

    const isSuccess = data.data.isSuccess;

    return isSuccess;
  }

  throw new Error('Update failed');
}

export const useUpdateUserMutation = () => {
  return useMutation((input: UpdateUserType) => updateUser(input), {
    onSuccess: (data) => {
      console.log(data, 'UpdateUser success response');
    },
    onError: (data) => {
      console.log(data, 'UpdateUser error response');
    },
  });
};
