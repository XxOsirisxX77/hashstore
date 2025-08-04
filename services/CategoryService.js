import { obtainBearerToken, BASE_URL } from './AuthService';

export const getCategories = async () => {
  return fetch(`${BASE_URL}/api/v1/categories/all`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};
