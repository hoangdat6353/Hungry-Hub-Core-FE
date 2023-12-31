import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import {
  LOCAL_BASE_URL,
  LOCAL_USERS_CONTROLLER,
} from 'src/common/constants/api-constant';
import { BaseResponse, LoginResponse } from 'src/common/models/auth-models';

export interface LoginInputType {
  email: string;
  password: string;
}

async function login(input: LoginInputType) {
  const loginURL = LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/login';

  const response = await fetch(loginURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    // Handle error responses
    throw new Error('Login failed');
  }

  const data: BaseResponse<LoginResponse> = await response.json();

  const token = data.data.token;

  return token;
}

export const useLoginMutation = () => {
  const { authorize, closeModal } = useUI();
  return useMutation((input: LoginInputType) => login(input), {
    onSuccess: (data) => {
      Cookies.set('auth_token', data);
      authorize();
    },
    onError: (data) => {
      console.log(data, 'login error response');
    },
  });
};
