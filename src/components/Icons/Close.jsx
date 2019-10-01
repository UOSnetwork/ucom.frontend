import React from 'react';
import PropTypes from 'prop-types';

const IconClose = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M1.72149 0.295366C1.32767 -0.0984557 0.689175 -0.0984554 0.295361 0.295367C-0.0984536 0.689189 -0.0984536 1.3277 0.295361 1.72152L4.5739 6.00014L0.295647 10.2785C-0.0981674 10.6723 -0.098167 11.3108 0.295647 11.7046C0.689462 12.0985 1.32796 12.0985 1.72178 11.7046L6.00003 7.4263L10.2783 11.7046C10.6721 12.0984 11.3106 12.0984 11.7044 11.7046C12.0982 11.3108 12.0982 10.6723 11.7044 10.2785L7.42615 6.00014L11.7047 1.72154C12.0985 1.32771 12.0985 0.689201 11.7047 0.295379C11.3109 -0.0984429 10.6724 -0.0984429 10.2785 0.295379L6.00003 4.57399L1.72149 0.295366Z" fill="black" />
  </svg>
);

IconClose.propTypes = {
  size: PropTypes.number,
};

IconClose.defaultProps = {
  size: 14,
};

export default IconClose;
