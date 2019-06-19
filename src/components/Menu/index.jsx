import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import React from 'react';
import styles from './styles.css';

const Menu = ({ items }) => (
  <div className={styles.menu}>
    {items.map((item, index) => {
      let NavTag;

      if (item.to) {
        NavTag = NavLink;
      } else if (item.href) {
        NavTag = 'a';
      } else {
        NavTag = 'span';
      }

      const props = {
        ...item,
        key: index,
        className: styles.item,
      };

      if (item.to) {
        props.activeClassName = styles.active;
      }

      return <NavTag {...props}>{item.title}</NavTag>;
    })}
  </div>
);

Menu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string,
    isActive: PropTypes.func,
    title: PropTypes.string.isRequired,
  })).isRequired,
};

export default withRouter(Menu);
