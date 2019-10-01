import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { formatRate } from '../utils/rate';

const Rate = ({ disableRateFormat, ...props }) => {
  if (props.value === undefined) {
    return null;
  }

  return (
    <div className={classNames('rate', props.className)}>
      <div className="rate__value">
        {disableRateFormat ? (
          <Fragment>{props.value}</Fragment>
        ) : (
          <Fragment>
            {formatRate(+props.value)}
            <span className="rate__degree">{props.dimension}</span>
          </Fragment>
        )}
      </div>
      <div className="rate__label">{props.label}</div>
    </div>
  );
};

Rate.propTypes = {
  dimension: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.number,
  disableRateFormat: PropTypes.bool,
};

Rate.defaultProps = {
  dimension: '°',
  label: 'Rate',
  disableRateFormat: false,
  className: undefined,
  value: 0,
};

export default Rate;
