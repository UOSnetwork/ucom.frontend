import config from '../../package.json';

export const airdropId_1 = { id: 1 };
export const airdropId_2 = { id: 4 };

export const getAirdropOfferId_1 = () => {
  let id = config.airdropOfferId_1.staging;

  if (process.env.NODE_ENV === 'production') {
    id = config.airdropOfferId_1.production;
  }

  return id;
};

export const getAirdropOfferId_2 = () => {
  let id = config.airdropOfferId_2.staging;

  if (process.env.NODE_ENV === 'production') {
    id = config.airdropOfferId_2.production;
  }

  return id;
};

export const getGitHubAuthLink = () => {
  let link = config.gitHubAuthLink.staging;

  if (process.env.NODE_ENV === 'production') {
    link = config.gitHubAuthLink.production;
  }

  return link;
};
