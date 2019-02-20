import React, { Fragment, useState } from 'react';
import Popup from '../Popup';
import styles from './styles.css';

const SearchPopup = () => {
  const [popup, showPopup] = useState(false);

  return (
    <Fragment>
      <div className={styles.search}>
        <input onClick={() => showPopup(!popup)} className={styles.input} placeholder="Search for people, oragnizations, communities, tags, or @accounts in U°OS blockchain…" />
      </div>
      <div className="layout__search">s
      </div>

      {popup && (
        <Popup onClick={() => showPopup(!popup)}>
          <div className={styles.popup}>
            <div className={styles.column}>
              <div className={styles.columnTitle}>Members</div>
            </div>
          </div>
        </Popup>
      )}

    </Fragment>
  );
};

export default SearchPopup;
