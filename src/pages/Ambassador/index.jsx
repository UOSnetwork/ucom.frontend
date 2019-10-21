import { Link } from 'react-router-dom';
import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, memo } from 'react';
import IconLogo from '../../components/Icons/Logo';
import { LayoutClean, Content } from '../../components/Layout';
import UserPick from '../../components/UserPick';
import Button from '../../components/Button/index';
import Pulse from './Pulse';
import formatNumber from '../../utils/formatNumber';
import withLoader from '../../utils/withLoader';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import { selectUserById } from '../../store/';
import AmbassadorPageActions from '../../actions/pages/ambassador';
import user1Img from './img/user-1.png';
import user2Img from './img/user-2.png';
import user3Img from './img/user-3.png';
import user4Img from './img/user-4.png';
import user5Img from './img/user-5.png';
import user6Img from './img/user-6.png';
import styles from './styles.css';
import * as WalletIcons from '../../components/Icons/WalletIcons';
import * as FeedIcons from '../../components/Icons/FeedIcons';
import { getReferralPostId } from '../../utils/config';

const Ambassador = ({ match, location }) => {
  const { userIdentity } = match.params;
  const dispatch = useDispatch();
  const state = useSelector(state => state.pages.ambassador, isEqual);
  const user = useSelector(selectUserById(userIdentity), isEqual);
  const userName = getUserName(user);
  const referralPostLink = urls.getPostUrl({ id: getReferralPostId() });
  const registrationUrl = {
    pathname: urls.getRegistrationUrl(),
    state: { prevPath: location.pathname },
  };

  useEffect(() => {
    withLoader(dispatch(AmbassadorPageActions.fetchPageData(userIdentity)));
  }, [userIdentity]);

  return (
    <LayoutClean>
      {user &&
        <div className={styles.wrapper}>
          <Content isSmall>
            <div className={styles.header}>
              <div className={styles.logo}>
                <IconLogo showLabel={false} />
                <span className={styles.label}>Ambassadorial program</span>
              </div>
            </div>

            <div className={styles.user}>
              {user && <UserPick size={120} src={urls.getFileUrl(user.avatarFilename)} />}
              <div className={styles.main}>
                <h1 className={styles.title}>{userName} invites you to U°Community<br /> and gives you 100UOS</h1>
              </div>
              <div className={styles.side}>
                <p className={styles.label}>Invite your friends like {userName} do and<br /> become ambassador — <Link to={referralPostLink} className="link red">learn more</Link></p>
                <p className={styles.action}>
                  <Button red cap medium strech rounted url={registrationUrl}>Join</Button>
                </p>
              </div>
            </div>

            {state.joined && state.users.length > 0 &&
              <div className={styles.users}>
                <div className={styles.counter}>
                  <div className={styles.count}>{formatNumber(state.joined)}</div>
                  <div className={styles.label}>People  Joined</div>
                </div>
                <div className={styles.list}>
                  {state.users.map((user, index) => (
                    <UserPick key={index} src={urls.getFileUrl(user.avatarFilename)} url={urls.getUserUrl(user.id)} />
                  ))}
                </div>
              </div>
            }
          </Content>
        </div>
      }
      <div className={`${styles.wrapper} ${styles.gray}`}>
        <Content isSmall>
          <div className={styles.tizer}>
            <div className={styles.logo}>
              <div className={styles.icon}>
                <div className={styles.logo1}>
                  <IconLogo showLabel={false} />
                </div>
                <div className={styles.logo2}>
                  <IconLogo showLabel={false} />
                </div>
              </div>

              <div className={styles.pulse}>
                {[0, 1, 1, 2, 3, 5].map((i, index) => <Pulse key={index} begin={i} />)}
              </div>

              <div className={`${styles.pulse} ${styles.two}`}>
                {[0, 1, 1, 2, 3, 5].map((i, index) => <Pulse key={index} begin={i} />)}
              </div>

              <div className={`${styles.userPick} ${styles.n1}`}>
                <div className={styles.imgWrapper}>
                  <img src={user1Img} alt="" />
                </div>
              </div>

              <div className={`${styles.userPick} ${styles.n2}`}>
                <WalletIcons.Message />
                <div className={styles.imgWrapper}>
                  <img src={user2Img} alt="" />
                </div>
              </div>
              <div className={`${styles.userPick} ${styles.n3}`}>
                <WalletIcons.Message />
                <div className={styles.imgWrapper}>
                  <img src={user3Img} alt="" />
                </div>
              </div>
              <div className={`${styles.userPick} ${styles.n4}`}>
                <div className={styles.imgWrapper}>
                  <img src={user4Img} alt="" />
                </div>
              </div>
              <div className={`${styles.userPick} ${styles.n5}`}>
                <FeedIcons.DownvoteIcon />
                <div className={styles.imgWrapper}>
                  <img src={user5Img} alt="" />
                </div>
              </div>
              <div className={`${styles.userPick} ${styles.n6}`}>
                <div className={styles.imgWrapper}>
                  <img src={user6Img} alt="" />
                </div>
              </div>
            </div>
            <p className={styles.text}>Place to Interact <span role="img" aria-label="love">❤️</span> with others worldwide <span role="img" aria-label="worldwide">🌎</span>️, share your thoughts<span role="img" aria-label="thoughts"> 💭</span> and ideas<span role="img" aria-label="ideas">💡</span>, shape communities of interest <span role="img" aria-label="interest">🎉</span> and contribute to their growing <span role="img" aria-label="growing">🌱</span></p>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h2 className={styles.title}>Spread your thoughts and ideas</h2>
              <p className={styles.text}>Enrich the platform with valuable knowledge. Content breathes life in communities: brings new ideas, invites debates. Any piece of content (including comments) has a measurable value that is determined by other people and impacts your importance°.</p>
            </div>
            <div className={styles.feature}>
              <h2 className={styles.title}>Build your community</h2>
              <p className={styles.text}>People are the most important and valuable part of any social application. People shape the image and nature of any community. As long as the network grows — all its participants get rewarded with tokens</p>
            </div>
            <div className={styles.feature}>
              <h2 className={styles.title}>Be rewarded for you importance</h2>
              <p className={styles.text}>U°OS is a blockchain protocol with a unique consensus algorithm called DPoI. Importance° consists of your stake, economic and social activities. The more importance° you have — the bigger share of the whole network’s wealth you get.</p>
            </div>
          </div>
          <div className={styles.submit}>
            <Button red cap medium strech rounted url={registrationUrl}>Join</Button>
          </div>
        </Content>
      </div>
    </LayoutClean>
  );
};

export const getAmbassadorPageData = async (store, params) => {
  const [user] = await store.dispatch(AmbassadorPageActions.fetchPageData(params.userIdentity));

  return {
    contentMetaTags: {
      title: `${getUserName(user)} invites you to U°Community and gives you 100UOS`,
      image: urls.getFileUrl(user.avatarFilename),
      isSmallCardImage: true,
    },
  };
};

export default memo(Ambassador);
