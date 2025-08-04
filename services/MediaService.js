import { obtainBearerToken, BASE_URL } from './AuthService';

export const getStoreItemsFromDatabase = async () => {
  return fetch(`${BASE_URL}/api/v1/media/user_store`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const getLikedMedia = async () => {
  return fetch(`${BASE_URL}/api/v1/media/media_liked`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const getStoreItemsFromInstagram = async () => {
  return fetch(`${BASE_URL}/api/v1/media/recents`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const publishMediaToStore = async (media) => {
  return fetch(`${BASE_URL}/api/v1/media/publish_to_store`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    },
    body: JSON.stringify(media)
  })
  .then((response) => response.json());
};

export const obtainMedia = async (id) => {
  return fetch(`${BASE_URL}/api/v1/media/obtain_media?id=${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const deleteMedia = async (media) => {
  return fetch(`${BASE_URL}/api/v1/media/delete_media`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    },
    body: JSON.stringify(media)
  })
  .then((response) => response.json());
};

export const updateMedia = async (media) => {
  return fetch(`${BASE_URL}/api/v1/media/update_media`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    },
    body: JSON.stringify(media)
  })
  .then((response) => response.json());
};

export const searchMedia = async (searchCriteria, categoryId, filterOptions) => {
  let options = '';
  if (filterOptions !== null) {
    if (filterOptions.price > 0) {
      options += `&priceId=${filterOptions.price}`;
    }
    if (filterOptions.location > 0) {
      options += `&locationId=${filterOptions.location}`;
    }
    if (filterOptions.condition > 0) {
      options += `&conditionId=${filterOptions.condition}`;
    }
  }
  return fetch(`${BASE_URL}/api/v1/media/search?searchCriteria=${searchCriteria}&categoryId=${categoryId}${options}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const searchPopularCategory = async (categoryId) => {
  return fetch(`${BASE_URL}/api/v1/media/media_popular_category?categoryId=${categoryId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const likeMedia = async (id) => {
  return fetch(`${BASE_URL}/api/v1/media/like_media`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    },
    body: JSON.stringify(id)
  })
  .then((response) => response.json());
};

export const likedMedia = async (id) => {
  return fetch(`${BASE_URL}/api/v1/media/liked_media?id=${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const getCountries = async () => {
  return fetch(`${BASE_URL}/api/v1/media/countries`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};

export const getCurrencies = async () => {
  return fetch(`${BASE_URL}/api/v1/media/currencies`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': await obtainBearerToken(),
    }
  })
  .then((response) => response.json());
};
