import { Link } from 'react-router-dom';
import React from 'react';
import Button from '../Button/index';
import Share from '../Share';
import urls from '../../utils/urls';
import { getReferralPostId } from '../../utils/config';
import styles from './styles.css';

const ReferralBanner = () => {
  const referralPostLink = urls.getPostUrl({
    id: getReferralPostId(),
  });

  return (
    <div className={styles.referralBanner}>
      <div className={styles.inner}>
        <h3 className={styles.title}>Get a reward for each person you invite</h3>
        <div className={styles.text}>Provide a referral link to your friend and gain importance from your referrals, registered on the platform. You get 10% the importance they acquire.</div>
        <div className={styles.actions}>
          <Share
            link={referralPostLink}
            socialEnable
          >
            <Button red>Share Refferal Link</Button>
          </Share>
          <Link className="link red" to={referralPostLink}>Learn More</Link>
        </div>
      </div>
    </div>
  );
};

export default ReferralBanner;
