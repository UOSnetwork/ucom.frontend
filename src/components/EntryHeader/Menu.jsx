import React, { memo } from 'react';
import { copyToClipboard } from '../../utils/text';
import styles from './styles.css';
import DropdownMenu from '../DropdownMenu';

const Menu = () => (
  <div className={styles.menu}>
    <DropdownMenu
      items={[{
        title: 'Copy Link',
        onClick: () => copyToClipboard(window.location.href), // TODO: Add success notification
      }]}
    />
  </div>
);

export default memo(Menu);
