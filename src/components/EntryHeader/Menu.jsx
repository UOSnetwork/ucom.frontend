import { useDispatch } from 'react-redux';
import React, { memo } from 'react';
import utilsActions from '../../actions/utils';
import styles from './styles.css';
import DropdownMenu from '../DropdownMenu';

const Menu = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.menu}>
      <DropdownMenu
        items={[{
          title: 'Copy Link',
          onClick: () => dispatch(utilsActions.copyToClipboard(window.location.href)),
        }]}
      />
    </div>
  );
};

export default memo(Menu);
