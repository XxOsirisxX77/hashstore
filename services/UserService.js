import { obtainInstagramToken, obtainBearerToken, BASE_URL } from './AuthService';

export const getProfileFromApiAsync = async (token) => {
  if (token === undefined) {
    token = await obtainInstagramToken();
  }
  return fetch(`${BASE_URL}/api/v1/users/profile?access_token=${encodeURIComponent(token)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.json());
};

export const getProfileFromDatabaseAsync = async () => {
  return fetch(`${BASE_URL}/api/v1/users/profile_from_database`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const upgradeToBusinessAccount = async (user) => {
  return fetch(`${BASE_URL}/api/v1/users/update_business`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    },
    body: JSON.stringify(user)
  })
  .then((response) => response.json());
};
