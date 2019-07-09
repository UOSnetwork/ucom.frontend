import PropTypes from 'prop-types';
import React from 'react';
import profileStyles from './styles.css';
import VerticalMenu from '../VerticalMenu';
import Button from '../Button/index';

const Sidebar = ({ sections, create, submitDisabled }) => (
  <div className={profileStyles.menuWrapper}>
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
      disabled={submitDisabled}
    >
      {create ? 'Create' : 'Save Changes'}
    </Button>
  </div>
);

Sidebar.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  create: PropTypes.bool,
  submitDisabled: PropTypes.bool,
};

Sidebar.defaultProps = {
  create: false,
  submitDisabled: false,
};

export default Sidebar;
