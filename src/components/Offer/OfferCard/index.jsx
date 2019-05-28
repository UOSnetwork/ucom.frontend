import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Fragment, useState, useEffect } from 'react';
import { formatRate } from '../../../utils/rate';
import styles from './styles.css';
import Avatar from '../../Avatar';
import { sanitizeText } from '../../../utils/text';
import Countdown from '../../Countdown';
import Followers from '../../Followers';
import Popup, { Content } from '../../Popup';
import UserListAirdrop from '../../User/UsersListAirdrop';
import { mapUserDataToFollowersProps } from '../../../utils/user';
import { authShowPopup } from '../../../actions/auth';

const { AirdropStatuses } = require('ucom.libs.common').Airdrop.Dictionary;

const OfferCard = (props) => {
  // const [btnFixed, setBtnFixed] = useState(false);
  // const [btnFixedActive, setBtnFixedActive] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const LinkTag = props.userUrl ? Link : 'div';
  const { conditions } = props;
  const month = new Date(props.startedAt).toLocaleString('en-us', { month: 'long' });
  const day = new Date(props.startedAt).getDate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const callAuthShowPopup = () => {
    props.authShowPopup();
  };

  // TODO: sticky button on mobile
  // const checkSizeWindow = () => {
  //   if (window.scrollY > 485 && window.innerWidth < 414) {
  //     setBtnFixed(true);
  //     setTimeout(() => {
  //       setBtnFixedActive(true);
  //     }, 100);
  //   } else {
  //     setBtnFixed(false);
  //     setBtnFixedActive(false);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', checkSizeWindow);

  //   return () => {
  //     window.removeEventListener('scroll', checkSizeWindow);
  //   };
  // }, []);

  return (
    <Fragment>
      {popupVisible && (
        <Popup onClickClose={() => setPopupVisible(false)}>
          <Content
            mod="airdrop"
            fixWidth
            onClickClose={() => {
              setPopupVisible(false);
            }}
          >
            <UserListAirdrop users={props.users} title={props.title} metadata={props.metadata} onChangePage={props.onChangePage} />
          </Content>
        </Popup>
      )}
      <div
        className={classNames(
          `${styles.postCard}`,
          { [styles.postCardWithCover]: props.coverUrl && props.coverUrl.length > 0 },
        )}
      >
        {(props.coverUrl && props.coverUrl.length > 0) ? (
          <div className={styles.postCardCover}>
            <img className={styles.pic} src={props.coverUrl} alt="" />
          </div>
        ) : (
          <div className={styles.media} />
        )}

        {props.rate !== undefined &&
          <div className={styles.rate}>{formatRate(props.rate)}°</div>
        }

        {props.title &&
          <h1 className={styles.title}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeText(props.title) }} />
          </h1>
        }

        {props.userName &&
          <div className={styles.username}>
            <div className={styles.author}>by</div>
            <LinkTag to={props.userUrl}>
              <Avatar
                src={props.userImageUrl}
                size="xmsmall"
              />
            </LinkTag>
            <LinkTag to={props.userUrl}><span className={styles.name}>{props.userName}</span></LinkTag>
          </div>
        }

        <div className={styles.infoblockBottom}>
          {(Date.parse(new Date(props.startedAt)) - Date.parse(new Date()) > 0 &&
            <div className={styles.timer}>
              <div className={styles.startedAt}>
                <div className={styles.startedAtTitle}>Starts</div>
                <div className={styles.startedAtDate}>{`${month}, ${day}`}</div>
              </div>
            </div>
          ) || (Date.parse(new Date()) > Date.parse(new Date(props.finishedAt)) &&
            <div className={styles.timer}>
              <div className={styles.startedAt}>
                <div className={styles.startedAtTitle}>Ended</div>
              </div>
            </div>
          ) || (
            <div className={styles.timer}>
              <Countdown date={props.finishedAt} />
            </div>
          )}
          <Fragment>
            <Followers
              colorLight
              onClick={() => setPopupVisible(true)}
              users={(props.users).map(mapUserDataToFollowersProps)}
              title="Participants"
              count={+props.count}
            />
          </Fragment>

          {loaded && Date.parse(new Date(props.startedAt)) - Date.parse(new Date()) < 0 &&
            Date.parse(new Date()) < Date.parse(new Date(props.finishedAt)) && (() => {
            if (((!props.cookie && !conditions) ||
            (conditions && (conditions.conditions.authGithub === false && !props.cookie) && (conditions.conditions.authMyself === false || conditions.conditions.authMyself === true)) ||
            ((conditions && conditions.airdropStatus !== AirdropStatuses.RECEIVED && conditions.airdropStatus !== AirdropStatuses.PENDING) &&
            (conditions && conditions.airdropStatus === AirdropStatuses.NEW && conditions.conditions.authGithub === false && conditions.conditions.authMyself === false)))) {
              return (
                <a
                  id="GithubAirdropGetYourScore"
                  className={classNames(
                    `${styles.btn}`,
                    { [styles.btnVisible]: loaded === true },
                    {/* { [styles.btnFixed]: btnFixed === true },
                    { [styles.btnFixedActive]: btnFixedActive === true }, */},
                  )}
                  href={props.gitHubAuthLink}
                >
                  Get your score
                </a>
              );
            } else if (((conditions && conditions.conditions.authGithub === true && conditions.conditions.authMyself === false) || props.cookie) && !props.token) {
              return (
                <div
                  role="presentation"
                  onClick={() => callAuthShowPopup()}
                  className={classNames(
                    `${styles.btn}`,
                    { [styles.btnVisible]: loaded === true },
                    {/* { [styles.btnFixed]: btnFixed === true },
                    { [styles.btnFixedActive]: btnFixedActive === true }, */ },
                  )}
                >
                  Sign up
                </div>
              );
            } else if ((conditions && conditions.conditions.authGithub === true && conditions.conditions.authMyself === true) || (props.cookie && props.token)) {
              return (
                <div
                  role="presentation"
                  className={classNames(
                    `${styles.btn}`,
                    `${styles.result}`,
                    { [styles.btnVisible]: loaded === true },
                  )}
                  onClick={() => setPopupVisible(true)}
                >
                  See Results
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </Fragment>
  );
};

OfferCard.propTypes = {
  conditions: PropTypes.shape({
    condition: PropTypes.objectOf(PropTypes.shape({
      authGithub: PropTypes.bool,
      authMyself: PropTypes.bool,
      followingDevExchange: PropTypes.bool,
    })),
  }),
  metadata: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalAmount: PropTypes.number,
  }).isRequired,
  onChangePage: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  userUrl: PropTypes.string.isRequired,
  finishedAt: PropTypes.string,
  startedAt: PropTypes.string,
  coverUrl: PropTypes.string,
  rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string.isRequired,
  userImageUrl: PropTypes.string,
  userName: PropTypes.string.isRequired,
  count: PropTypes.number,
  authShowPopup: PropTypes.func.isRequired,
  cookie: PropTypes.string,
  token: PropTypes.string,
  gitHubAuthLink: PropTypes.string,
};

OfferCard.defaultProps = {
  count: 0,
  coverUrl: null,
  userImageUrl: null,
  rate: 0,
  cookie: '',
  token: '',
  conditions: null,
  gitHubAuthLink: '',
  finishedAt: '',
  startedAt: '',
};

export default connect(
  null,
  dispatch => ({
    authShowPopup: () => dispatch(authShowPopup()),
  }),
)(OfferCard);
