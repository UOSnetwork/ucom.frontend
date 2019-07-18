import classNames from 'classnames';
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup from '../Popup';
import Header from './Header';
import Result from './Result';
import Footer from './Footer';

import * as searchPopupActions from '../../actions/searchPopup';
import styles from './styles.css';

const SearchPopup = () => {
  const wrapperEl = useRef(null);
  const state = useSelector(state => state.searchPopup);
  const dispatch = useDispatch();

  if (!state.visible) {
    return null;
  }

  return (
    <Popup
      alignTop
      transparent
      onClickClose={() => dispatch(searchPopupActions.hide())}
    >
      <div
        ref={wrapperEl}
        role="presentation"
        className={styles.searchPopup}
        onClick={(e) => {
          if (e.target === wrapperEl.current) {
            dispatch(searchPopupActions.hide());
          }
        }}
      >
        <Header />
        <div
          className={classNames({
            [styles.content]: true,
            [styles.active]: state.query,
          })}
        >
          <Result />
          <Footer />
        </div>
      </div>
    </Popup>
  );
};

export default SearchPopup;
