import classNames from 'classnames';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup from '../Popup';
import Header from './Header';
import Content from './Content';
import * as searchPopupActions from '../../actions/searchPopup';
import styles from './styles.css';

const SearchPopup = () => {
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
        className={classNames({
          [styles.searchPopup]: true,
          [styles.active]: state.query,
        })}
      >
        <Header />
        {state.query && <Content />}
      </div>
    </Popup>
  );
};

export default SearchPopup;
