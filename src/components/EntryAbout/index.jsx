import PropTypes from 'prop-types';
import React, { useState } from 'react';
import MinimizedText from '../MinimizedText';
import styles from '../Section/styles.css';

const UserAbout = (props) => {
  const [minimized, setMinimized] = useState(true);

  if (!props.text) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={styles.title}>About</div>

      <div className={styles.content}>
        <MinimizedText
          gray
          disabledHide
          text={props.text}
          enabled={props.text.length > 280}
          minimized={minimized}
          onClickShowMore={() => setMinimized(!minimized)}
        />
      </div>
    </div>
  );
};

UserAbout.propTypes = {
  text: PropTypes.string,
};

UserAbout.defaultProps = {
  text: null,
};

export default UserAbout;
