import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { padStart } from 'lodash';
import styles from './styles.css';

const Countdown = (props) => {
  const { t } = useTranslation();
  const [date, setDate] = useState();

  const calculateCountdown = (endDate) => {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) { // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) { // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;

    return timeLeft;
  };

  useEffect(() => {
    const int = setInterval(() => {
      const date = calculateCountdown(props.date);
      if (date) {
        setDate(date);
      } else {
        clearInterval(int);
      }
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, [props.date]);

  if (!date) {
    return null;
  }

  return (
    <div className={styles.countdown}>
      <div className={styles.column}>
        <div>
          <div className={styles.number}>{padStart(date.days, 2, '0')}</div>
          <div className={styles.text}>{date.days === 1 ? t('Day') : t('Days')}</div>
        </div>
      </div>
      <div className={styles.column}>
        <div>
          <span className={styles.number}>{padStart(date.hours, 2, '0')}:</span>
          <span className={styles.number}>{padStart(date.min, 2, '0')}:</span>
          <span className={styles.number}>{padStart(date.sec, 2, '0')}</span>
          <div className={styles.text}>{t('Hours')}</div>
        </div>
      </div>
    </div>
  );
};

Countdown.defaultProps = {
  date: '',
};

Countdown.propTypes = {
  date: PropTypes.string,
};

export default Countdown;
