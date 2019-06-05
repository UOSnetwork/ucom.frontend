import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import styles from './styles.css';
import Button from '../Button/index';
import urls from '../../utils/urls';
import { authShowPopup } from '../../actions/auth';

const CommunityBanner = ({ authorized, authShowPopup }) => (
  <div className={styles.communityBanner}>
    <div className={styles.logo}>
      <svg width="128" height="121" viewBox="0 0 128 121" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M87.0751 81.7202C87.1232 82.0652 87.1818 82.4434 87.2524 82.8412C87.4562 83.9882 87.7196 85.054 88.0163 85.9086C88.154 85.9728 88.2998 86.0406 88.4534 86.1115C89.8019 86.7342 91.751 87.604 94.1414 88.5864C98.9383 90.5578 105.436 92.9506 112.379 94.7204C120.031 96.6686 123.968 102.211 125.793 107.645C126.609 110.073 127.041 112.559 127.246 114.865L127.26 114.862L127.263 115.052C127.383 116.483 127.37 117.905 127.357 119.33V119.33C127.352 119.886 127.347 120.442 127.35 121H0.736328C0.746714 116.437 0.763819 112.059 2.25158 107.636C4.07846 102.205 8.01593 96.6678 15.6636 94.7189C22.6815 92.9308 29.135 90.664 33.8483 88.8353C36.1989 87.9234 38.1023 87.126 39.4098 86.5605C39.5668 86.4926 39.7151 86.4281 39.8545 86.3671C40.1679 85.5788 40.4818 84.4737 40.7315 83.1555C40.8103 82.7397 40.8761 82.3401 40.9306 81.9714C37.6171 77.7502 35.7027 73.0506 34.6034 68.7618C32.9643 67.8315 31.8226 66.3456 31.0849 65.1198C29.8196 63.0173 28.7133 60.0382 27.6774 56.0513C26.3826 51.0671 25.9842 46.9182 27.0508 43.7141C27.5752 42.1385 28.4854 40.7067 29.8352 39.6505C29.4676 37.2133 29.174 34.0143 29.3489 30.493C29.725 22.9243 32.3569 13.0791 41.9448 6.84988C42.1177 6.65866 42.2879 6.46252 42.4585 6.26586C42.9139 5.74095 43.3725 5.21234 43.8963 4.76364C44.4335 4.30342 45.6357 3.40994 47.5934 2.60207C52.3866 0.624149 58.0324 0.437663 63.435 0.259212C65.3182 0.197009 67.1718 0.135782 68.9495 0C73.5584 0.11813 77.8541 1.94694 81.1403 4.4404C83.3391 6.10881 85.3547 8.28489 86.7035 10.7983C89.1974 11.4108 92.4274 12.8577 95.0435 16.2367C98.7706 21.0509 100.271 28.5284 98.3169 39.7354C99.5965 40.7744 100.47 42.1594 100.982 43.6829C102.061 46.8933 101.662 51.0538 100.364 56.0493C99.32 60.0675 98.2039 63.0656 96.9231 65.1739C96.15 66.4465 94.9306 68.0002 93.1714 68.9046C92.088 73.0715 90.2327 77.612 87.0751 81.7202Z" fill="white" />
      </svg>
    </div>

    <div className={styles.title}>Join<br />Community</div>

    <div className={styles.button}>
      <Button
        strech
        red
        big
        cap
        url={authorized ? urls.getOrganizationCrerateUrl() : undefined}
        onClick={authorized ? undefined : () => authShowPopup(urls.getOrganizationCrerateUrl())}
      >
        Get started
      </Button>
    </div>
  </div>
);

CommunityBanner.propTypes = {
  authorized: PropTypes.bool.isRequired,
  authShowPopup: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    authorized: Boolean(state.user.data.id),
  }),
  {
    authShowPopup,
  },
)(CommunityBanner);
