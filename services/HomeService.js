import { obtainBearerToken, BASE_URL } from './AuthService';

export const getPopularCategories = async () => {
  return fetch(`${BASE_URL}/api/v1/home/popular_categories`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const getDiscoverStores = async () => {
  return fetch(`${BASE_URL}/api/v1/home/discovery_stores`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};
