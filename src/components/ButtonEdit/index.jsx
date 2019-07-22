import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { memo } from 'react';
import IconEdit from '../Icons/Edit';
import styles from './styles.css';

const ButtonEdit = props => (
  <Link
    className={classNames({
      [styles.buttonEdit]: true,
      [styles.strech]: props.strech,
    })}
    to={props.url}
  >
    <IconEdit />
  </Link>
);

ButtonEdit.propTypes = {
  url: PropTypes.string.isRequired,
  strech: PropTypes.bool,
};

ButtonEdit.defaultProps = {
  strech: false,
};

export default memo(ButtonEdit);
