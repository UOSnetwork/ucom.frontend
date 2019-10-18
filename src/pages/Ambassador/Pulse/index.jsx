import PropTypes from 'prop-types';
import React from 'react';

const Pulse = ({ begin }) => (
  <svg viewBox="0 0 392 392" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50%" cy="50%" fill="none" r="10" stroke="#D8E8E8" strokeWidth="1">
      <animate attributeName="r" from="23" to="196" dur="6s" begin={`${begin}s`} repeatCount="indefinite" />
      <animate attributeName="opacity" from="1" to="0" dur="6s" begin={`${begin}s`} repeatCount="indefinite" />
    </circle>
  </svg>
);

Pulse.propTypes = {
  begin: PropTypes.number.isRequired,
};

export default Pulse;
