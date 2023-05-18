import jwtDecode from 'jwt-decode';

export const decodeIdFromToken = (token: string): string => {
  const decodedData = jwtDecode(token);
  return decodedData['id'];
};
