import { isString } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import styles from './styles.css';
import { filterURL } from '../../utils/url';

const Button = (props) => {
  let Tag;

  if (!props.url) {
    Tag = 'button';
  } else if (isString(props.url) && (props.url.indexOf('#') === 0 || props.external)) {
    Tag = 'a';
  } else {
    Tag = Link;
  }

  return (
    <span
      className={classNames({
        [styles.wrapper]: true,
        [styles.strech]: props.strech,
      })}
    >
      <Tag
        type={!props.url ? props.type : undefined}
        to={props.url}
        href={isString(props.url) ? filterURL(props.url) : undefined}
        target={props.external ? '_blank' : undefined}
        onClick={props.onClick}
        disabled={props.disabled}
        className={classNames({
          [styles.button]: true,
          [styles.grayBorder]: props.grayBorder,
          [styles.red]: props.red,
          [styles.redBorder]: props.redBorder,
          [styles.transparent]: props.transparent,
          [styles.large]: props.large,
          [styles.big]: props.big,
          [styles.small]: props.small,
          [styles.medium]: props.medium,
          [styles.cap]: props.cap,
          [styles.disabled]: props.disabled,
          [styles.rounted]: props.rounted,
        })}
        style={{
          minWidth: props.width ? `${props.width}px` : undefined,
        }}
      >
        <span className={styles.inner}>
          {props.children}
        </span>
      </Tag>
    </span>
  );
};

Button.propTypes = {
  url: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string,
      state: PropTypes.shape({
        prevPath: PropTypes.string,
      }),
    }),
  ]),
  external: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  strech: PropTypes.bool,
  grayBorder: PropTypes.bool,
  red: PropTypes.bool,
  transparent: PropTypes.bool,
  big: PropTypes.bool,
  small: PropTypes.bool,
  cap: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  large: PropTypes.bool,
  redBorder: PropTypes.bool,
  width: PropTypes.number,
  medium: PropTypes.bool,
  rounted: PropTypes.bool,
};

Button.defaultProps = {
  url: undefined,
  external: false,
  onClick: null,
  strech: false,
  grayBorder: false,
  red: false,
  transparent: false,
  big: false,
  small: false,
  cap: false,
  disabled: false,
  type: 'button',
  redBorder: false,
  large: false,
  width: undefined,
  medium: false,
  rounted: false,
};

export default Button;
