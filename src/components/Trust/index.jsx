import PropTypes from 'prop-types';
import React, { memo, useState, Fragment } from 'react';
import styles from './styles.css';
import Button from '../Button/index';
import UserPick from '../UserPick/UserPick';
import DropdownMenu from '../DropdownMenu';
import Popup from '../Popup';

const Trust = (props) => {
  const [untrustPopupVisible, setUntrustPopupVisible] = useState(false);
  const [acceptCardVisible, setAcceptCardVisible] = useState(false);

  return (
    <Fragment>
      {untrustPopupVisible &&
        <Popup
          showCloseIcon
          onClickClose={() => setUntrustPopupVisible(false)}
        >
          <div className={styles.untrust}>
            <h2 className={styles.title}>You are revoking your trust</h2>
            <ol className={styles.rules}>
              <li>You are publicly revoking your trust to this person.</li>
              <li>Your public trust revoke is a transaction on the U°OS blockchain.</li>
              <li>This trust revoke transaction will be put in your profile feed and the feed of your followers.</li>
            </ol>

            <Button strech big cap red onClick={props.onClickRevokeTrust}>Revoke trust</Button>
          </div>
        </Popup>
      }

      <div className={styles.trust}>
        {props.trusted &&
          <div className={styles.trusted}>
            <DropdownMenu
              distance={15}
              trigger="mouseenter"
              items={[{
                title: 'Change my mind',
                onClick: () => setUntrustPopupVisible(true),
              }]}
            >
              <span className={styles.trigger}>
                You Trust&nbsp;
                <UserPick
                  size={24}
                  alt={props.userName}
                  src={props.userAvtarUrl}
                  shadow
                />
                &nbsp;<span title={props.userName}>{props.userName}</span>
              </span>
            </DropdownMenu>
          </div>
        }

        {!props.trusted && !acceptCardVisible &&
          <Button
            strech
            grayBorder
            onClick={() => setAcceptCardVisible(true)}
          >
            Trust&nbsp;
            <UserPick
              size={24}
              alt={props.userName}
              src={props.userAvtarUrl}
              shadow
            />
            &nbsp;<span title={props.userName}>{props.userName}</span>
          </Button>
        }

        {!props.trusted && acceptCardVisible &&
          <div className={styles.acceptCard}>
            <h3 className={styles.title}>
              I Trust&nbsp;
              <UserPick
                size={32}
                alt={props.userName}
                src={props.userAvtarUrl}
                shadow
              />
              &nbsp;<span title={props.userName}>{props.userName}</span>
            </h3>

            <ol className={styles.rules}>
              <li>You are publicly manifesting your trust to this person.</li>
              <li>Your public trust manifestation is a transaction on the U°OS blockchain.</li>
              <li>This trust transaction will be put in your profile feed and the feed of your followers.</li>
              <li>The profiles that you trust will be publicly listed in your profile.</li>
              <li>This trust transaction expands the web of trust within the network.</li>
            </ol>

            <div className={styles.action}>
              <Button strech red onClick={props.onClickTrust}>
                Trust
              </Button>
            </div>

            <div className={styles.action}>
              <Button strech transparent onClick={() => setAcceptCardVisible(false)}>
                Cancel
              </Button>
            </div>
          </div>
        }
      </div>
    </Fragment>
  );
};

Trust.propTypes = {
  userName: PropTypes.string.isRequired,
  userAvtarUrl: PropTypes.string.isRequired,
  trusted: PropTypes.bool,
  onClickTrust: PropTypes.func.isRequired,
  onClickRevokeTrust: PropTypes.func.isRequired,
};

Trust.defaultProps = {
  trusted: false,
};

export default memo(Trust);
