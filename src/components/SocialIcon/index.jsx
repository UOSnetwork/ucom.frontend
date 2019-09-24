import React from 'react';
import PropTypes from 'prop-types';
import IconLink from '../Icons/Link';
import TwitterIcon from '../Icons/Socials/Twitter';
import FacebookIcon from '../Icons/Socials/Facebook';
import RedditIcon from '../Icons/Socials/Reddit';
import MediumIcon from '../Icons/Socials/Medium';
import TelegramIcon from '../Icons/Socials/Telegram';
import GithubIcon from '../Icons/Socials/Github';

const socialIcons = [
  [/(facebook|fb)/, <FacebookIcon />],
  [/twitter/, <TwitterIcon />],
  [/reddit/, <RedditIcon />],
  [/medium/, <MediumIcon />],
  [/telegram/, <TelegramIcon />],
  [/github/, <GithubIcon />],
];

const SocialIcon = ({ url }) => {
  const foundIcon = socialIcons.find(item => item[0].test(url));

  if (foundIcon) {
    return foundIcon[1];
  }

  return <IconLink />;
};

SocialIcon.propTypes = {
  url: PropTypes.string,
};

SocialIcon.defaultProps = {
  url: undefined,
};

export default SocialIcon;
