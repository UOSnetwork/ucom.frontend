import config from '../../package.json';

export const getBackendConfig = () => {
  let conf = config.backend.staging;

  if (process.env.NODE_ENV === 'production') {
    conf = config.backend.production;
  }

  return conf;
};

export const getUosGroupId = () => {
  let id = config.uosGroupId.staging;

  if (process.env.NODE_ENV === 'production') {
    id = config.uosGroupId.production;
  }

  return id;
};

export const getGrecaptchaSitekey = () => config.grecaptchaSitekey;

export const getEosPostId = () => {
  let id = config.eosPostId.staging;

  if (process.env.NODE_ENV === 'production') {
    id = config.eosPostId.production;
  }

  return id;
};
