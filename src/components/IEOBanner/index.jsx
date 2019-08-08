import { isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, memo } from 'react';
import Button from '../Button/index';
import IconClose from '../Icons/Close';
import * as ieobannerActions from '../../actions/ieobanner';
import styles from './styles.css';

const IEOBanner = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.ieobanner, isEqual);

  useEffect(() => {
    dispatch(ieobannerActions.init());
  }, []);

  if (!state.visible) {
    return null;
  }

  return (
    <div className={styles.ieobanner}>
      <span className={styles.bg}>
        <svg width="1275" height="73" viewBox="0 0 1275 73" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 72C73.7109 72 100.393 -0.112174 159.375 0.20852C233.103 0.609388 242.384 61.481 334.862 61.481C416.542 61.481 454.253 23 563.5 23C672.747 23 710.5 8.01776 747.5 8.01776C779.5 8.01776 823.922 42.5 881 42.5C957 42.5 1021.9 6.65856 1099.04 6.65848C1167 6.65841 1181 -0.957956 1275 -0.958008" stroke="#E72D2D" />
        </svg>
      </span>

      <div className={styles.container}>
        <span className={styles.title}>U°OS Network IEO is Live Now</span>

        <div className={styles.button}>
          <Button
            red
            strech
            external
            url="https://event.bitforex.com/en/UOS.html"
          >
            Join IEO
          </Button>
        </div>

      </div>

      <span
        role="presentation"
        className={styles.close}
        onClick={() => dispatch(ieobannerActions.close())}
      >
        <IconClose />
      </span>
    </div>
  );
};

export default memo(IEOBanner);
