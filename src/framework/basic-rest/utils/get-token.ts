import Cookies from 'js-cookie';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const getToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  return Cookies.get('auth_token');
};

export function decodeToken(token: string) {
  try {
    const decoded = jwt.decode(token) as DecodedToken;
    return decoded;
  } catch (error) {
    // Handle any error that occurs during token decoding
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

export const getUserId = (): string => {
  const userToken = getToken();
  if (userToken == null) return '';

  const decodedToken = decodeToken(userToken);
  const userId = decodedToken?.id;

  return userId as string;
};
