import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import profileStyles from './styles.css';
import VerticalMenu from '../VerticalMenu';
import Button from '../Button/index';

const Menu = ({
  sections, create, submitDisabled, submitVisible,
}) => {
  const { t } = useTranslation();

  return (
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
      <div
        className={classNames({
          [profileStyles.submit]: true,
          [profileStyles.active]: submitVisible,
        })}
      >
        <Button
          strech
          red={create}
          type="submit"
          disabled={submitDisabled}
        >
          {create ? t('Create') : t('Save Changes')}
        </Button>
      </div>
    </div>
  );
};

Menu.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  create: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  submitVisible: PropTypes.bool,
};

Menu.defaultProps = {
  create: false,
  submitDisabled: false,
  submitVisible: false,
};

export default Menu;
