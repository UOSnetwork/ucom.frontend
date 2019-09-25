import React from 'react';
import PropTypes from 'prop-types';

const IconShareCircle = ({ className }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white" stroke="#E8ECEC" />
    <path fillRule="evenodd" clipRule="evenodd" d="M24.975 15.1167C24.4454 15.3361 24.1009 15.8518 24.1009 16.4237V19.1363C18.3978 19.8367 14 24.712 14 30.565C14 31.1324 14.3392 31.6448 14.8614 31.8666C15.3836 32.0887 15.9881 31.9763 16.3962 31.5823C18.4919 29.5587 21.1852 28.3162 24.1009 28.012V30.565C24.1009 31.1368 24.4454 31.6526 24.9737 31.8715C25.147 31.943 25.3304 31.9791 25.5148 31.9791C25.8879 31.9791 26.2476 31.8318 26.5144 31.5656L33.5857 24.4943C34.1382 23.9424 34.1382 23.0465 33.5853 22.4942L26.515 15.4237C26.1109 15.0196 25.5037 14.8986 24.975 15.1167ZM25.0514 20.8738L25.9178 20.833V17.3938L32.013 23.4892L25.9178 29.5844V26.0921L24.9773 26.1245C21.5894 26.2415 18.4022 27.4642 15.8633 29.6085C16.3276 24.8717 20.2215 21.1011 25.0514 20.8738Z" fill="black" />
  </svg>
);

IconShareCircle.propTypes = {
  className: PropTypes.string,
};

IconShareCircle.defaultProps = {
  className: undefined,
};

export default IconShareCircle;
