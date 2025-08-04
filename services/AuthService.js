import { SecureStore } from 'expo';

const INSTAGRAM_USER_KEY = "instagram_token";

const BEARER_TOKEN = "bearer_token";

// export const BASE_URL = "http://192.168.1.28:8080";
export const BASE_URL = "http://3.219.118.248:8080";

export const onInstagramSignIn = async (token) => await SecureStore.setItemAsync(INSTAGRAM_USER_KEY, token);

export const onInstagramSignOut = async () => await SecureStore.deleteItemAsync(INSTAGRAM_USER_KEY);

export const obtainInstagramToken = async () => {
  return await SecureStore.getItemAsync(INSTAGRAM_USER_KEY);
};

export const obtainBearerToken = async () => {
  return await SecureStore.getItemAsync(BEARER_TOKEN);
};

export const authorizeUser =  async (credentials) => {
  return fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  })
  .then((response) => {
      let bearerToken = response.headers.get('authorization');
      SecureStore.setItemAsync(BEARER_TOKEN, bearerToken);
    });
};
