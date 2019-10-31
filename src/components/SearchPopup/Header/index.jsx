import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as searchPopupActions from '../../../actions/searchPopup';
import IconSearch from '../../Icons/Search';
import IconClose from '../../Icons/Close';
import withLoader from '../../../utils/withLoader';
import styles from './styles.css';

const Header = () => {
  const { t } = useTranslation();
  const state = useSelector(state => state.searchPopup);
  const dispatch = useDispatch();

  const search = (query) => {
    withLoader(dispatch(searchPopupActions.search(query)));
  };

  const searchDebounced = useMemo(() => debounce(search, 500), []);

  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.icon}>
          <IconSearch />
        </div>
        <div className={styles.field}>
          <input
            autoFocus
            type="text"
            placeholder={t('searchPeople')}
            spellCheck="false"
            className={styles.input}
            value={state.query}
            onChange={(e) => {
              const query = e.target.value;
              dispatch(searchPopupActions.setData({ query }));
              searchDebounced(query);
            }}
          />
        </div>
        <div
          role="presentation"
          className={`${styles.icon} ${styles.close}`}
          onClick={() => {
            dispatch(searchPopupActions.hide());
          }}
        >
          <IconClose />
        </div>
      </div>
    </div>
  );
};

export default Header;
