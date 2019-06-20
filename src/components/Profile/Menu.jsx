import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import profileStyles from './styles.css';
import VerticalMenu from '../VerticalMenu';
import Button from '../Button/index';

const Sidebar = ({ sections, create }) => (
  <Fragment>
    <div className={profileStyles.menu}>
      <VerticalMenu
        sections={sections}
        scrollerOptions={{
          spy: true,
          duration: 500,
          delay: 100,
          offset: -73,
          smooth: true,
          containerId: 'profile-popup',
        }}
      />
    </div>
    <Button
      strech
      red={create}
      type="submit"
    >
      {create ? 'Create' : 'Save Changes'}
    </Button>
  </Fragment>
);

Sidebar.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  create: PropTypes.bool,
};

Sidebar.defaultProps = {
  create: false,
};

export default Sidebar;
