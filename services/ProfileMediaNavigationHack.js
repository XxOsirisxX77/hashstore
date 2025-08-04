let shouldProfileReload = false;

export const shouldReloadProfile = () => {
  return shouldProfileReload;
};

export const reloadProfile = (reload) => {
  shouldProfileReload = reload;
};
