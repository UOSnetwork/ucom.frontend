import PropTypes from 'prop-types';
import React from 'react';
import IconLogo from '../../components/Icons/Logo';
import { LayoutClean, Content } from '../../components/Layout';
import UserPick from '../../components/UserPick';
import Button from '../../components/Button/index';
import Pulse from './Pulse';
import formatNumber from '../../utils/formatNumber';
import styles from './styles.css';

const AmbassadorialProgram = () => (
  <LayoutClean>
    <div className={styles.wrapper}>
      <Content isSmall>
        <div className={styles.header}>
          <div className={styles.logo}>
            <IconLogo showLabel={false} />
            <span className={styles.label}>Ambassadorial program</span>
          </div>
        </div>

        <div className={styles.user}>
          <UserPick size={120} src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
          <div className={styles.main}>
            <h1 className={styles.title}>Danila invites you to U°Community<br />and gives you 100UOS</h1>
          </div>
          <div className={styles.side}>
            <p className={styles.label}>Invite your friends like Danila do and become ambassador — <a href="" className="link red">learn more</a></p>
            <p className={styles.action}>
              <Button red cap medium strech rounted>Join</Button>
            </p>
          </div>
        </div>

        <div className={styles.users}>
          <div className={styles.counter}>
            <div className={styles.count}>{formatNumber(5000)}</div>
            <div className={styles.label}>People  Joined</div>
          </div>
          <div className={styles.list}>
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            <UserPick src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
          </div>
        </div>
      </Content>
    </div>
    <div className={`${styles.wrapper} ${styles.gray}`}>
      <Content isSmall>
        <div className={styles.tizer}>
          <div className={styles.logo}>
            <div className={styles.icon}>
              <IconLogo showLabel={false} />
            </div>
            <div className={styles.pulse}>
              {[0, 1, 1, 2, 3, 5].map(i => <Pulse begin={i} />)}
            </div>
            <div className={`${styles.pulse} ${styles.two}`}>
              {[0, 1, 1, 2, 3, 5].map(i => <Pulse begin={i} />)}
            </div>
            <div className={`${styles.userPick} ${styles.one}`}>
              <UserPick size={40} src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            </div>
            <div className={`${styles.userPick} ${styles.tow}`}>
              <UserPick size={64} src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            </div>
            <div className={`${styles.userPick} ${styles.three}`}>
              <UserPick size={56} src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            </div>
            <div className={`${styles.userPick} ${styles.four}`}>
              <UserPick size={40} src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            </div>
            <div className={`${styles.userPick} ${styles.five}`}>
              <UserPick size={48} src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
            </div>
            <div className={`${styles.userPick} ${styles.six}`}>
              <UserPick size={32} src="https://backend.u.community/upload/avatar_filename-1542127407946.png" />
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
          <Button red cap medium strech rounted>Join</Button>
        </div>
      </Content>
    </div>
  </LayoutClean>
);

AmbassadorialProgram.propTypes = {
};

AmbassadorialProgram.defaultProps = {
};

export default AmbassadorialProgram;
