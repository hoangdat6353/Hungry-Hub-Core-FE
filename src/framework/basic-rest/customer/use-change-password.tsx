import { decodeToken, getToken } from '@framework/utils/get-token';
import { useMutation } from 'react-query';
import {
  LOCAL_BASE_URL,
  LOCAL_USERS_CONTROLLER,
} from 'src/common/constants/api-constant';
import {
  BaseResponse,
  BaseStatusResponse,
} from 'src/common/models/auth-models';

export interface ChangePasswordInputType {
  newPassword: string;
  oldPassword: string;
  confirmPassword: string;
}
async function changePassword(input: ChangePasswordInputType) {
  const userToken = getToken();

  if (userToken != null) {
    const decodedToken = decodeToken(userToken);
    const userId = decodedToken?.id;

    const loginURL =
      LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/change-password/' + userId;

    const response = await fetch(loginURL, {
      method: 'POST',
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

  throw new Error('Token not valid !');
}
export const useChangePasswordMutation = () => {
  return useMutation(
    (input: ChangePasswordInputType) => changePassword(input),
    {
      onSuccess: (data) => {
        console.log(data, 'ChangePassword success response');
      },
      onError: (data) => {
        console.log(data, 'ChangePassword error response');
      },
    }
  );
};
