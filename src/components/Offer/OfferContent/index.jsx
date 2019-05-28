import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../../ProgressBar';
import { getPercent } from '../../../utils/text';
import Comments from '../../Comments/wrapper';
import { COMMENTS_CONTAINER_ID_POST } from '../../../utils/comments';
import styles from './styles.css';
import formatNumber from '../../../utils/formatNumber';

const OfferContent = props => (
  <Fragment>
    <Fragment>
      {props.score !== null && props.conditions && props.conditions.conditions.authGithub === true ? (
        <Fragment>
          {props.score !== 0 ?
            <div className={styles.score}>Your GitHub score <span>{formatNumber(props.score.toFixed(2))}</span></div>
          :
            <div className={styles.score}>
              Your have zero GitHub score
              <p className={styles.bannerTitle}>Build Your Reputation</p>
              <div className={styles.bannerText}>
                <p>Your GitHub account contributions have scored zero for the network.</p>
                <p>This is a good moment to start from scratch with your network reputation. To give you a headstart, 100 UOS will be deposited to your U°OS account at the end of this airdrop round.</p>
                <p>Please note that your GitHub account must have been registered before March 1, 2019 to be eligible for 100 UOS.</p>
                <p>You can start by joining <a className={styles.link} href="/communities/101">DevExchange</a> or <a className={styles.link} href="/overview/communities/filter/fresh"> any other community</a> and talking to people.</p>
              </div>
            </div>
          }
        </Fragment>
      ) : (
        null
      )}
    </Fragment>
    <div className={styles.section}>
      <div className={styles.title}>GitHub Score</div>
      <div className={styles.text}>GitHub is a huge network tallying at over 28 million users. A lot of the work you do on GitHub — from committing your code to opening issues — is of value. Most of your actions are of value. We did a rough calculation of your account&apos;s value, or your Importance in the GitHub network as we call it, that you can get by signing in with your GitHub account.</div>
    </div>
    <div className={styles.section}>
      <div className={styles.title}>Tokens</div>
      <div className={styles.text}>You can register your GitHub account&apos;s Importance on the U°OS network and you — and only you — will forever keep the key to it. The Importance is registered through tokens that are issued to your account on the U°OS network.
        <p>There are two types of tokens — UOS and UOS.Futures. UOS to register your Importance and UOS.Futures to exchange to the mainnet UOS tokens. An additional pool of mainnet UOS tokens will also be distributed to all accounts per their Importance.</p>
      </div>
      {props.tokens &&
        <Fragment>
          <div className={styles.progress}>
            <div className={styles.tokenLeft}>UOS Left {formatNumber(Math.round(props.tokens[0].amountLeft))}</div>
            <div className={styles.tokenTotal}>from {formatNumber(props.tokens[0].amountClaim)}</div>
          </div>
          <ProgressBar
            className={styles.filler}
            percentage={Number(getPercent(props.tokens[0].amountLeft, props.tokens[0].amountClaim))}
          />

          <div className={styles.progress}>
            <div className={styles.tokenLeft}>UOS.Futures Left {formatNumber(Math.round(props.tokens[1].amountLeft))}</div>
            <div className={styles.tokenTotal}>from {formatNumber(props.tokens[1].amountClaim)}</div>
          </div>
          <ProgressBar
            className={styles.filler}
            percentage={Number(getPercent(props.tokens[1].amountLeft, props.tokens[1].amountClaim))}
          />
        </Fragment>
      }
    </div>
    <div className={styles.section}>
      <div className={styles.title}>Formula</div>
      <div className={styles.text}>We calculated the account Importance in the GitHub network based on the events associated with each account, such as commits, comments, opened issues, wiki editing and so on, and the repositories associated with each account.
        <p>You can read the rationale and detailed description in the <a href="https://github.com/UOSnetwork/uos.docs/blob/master/GitHubUserRepoScoring.pdf" className="link red" target="_blank" rel="noopener noreferrer">U°OS Network GitHub repository</a>.</p>
      </div>
    </div>
    <div className={styles.section}>
      <div className={styles.title}>DevExchange Community</div>
      <div className={styles.text}>This community is a mix of Stack Exchange and Stack Overflow and showcases how you can use your Importance that always belongs to you on other networks. Imagine if your GitHub had account reputation and you could use it on Stack Exchange. Or anywhere else for that matter — this is Universal Portable Reputation.
        <p>This is what the DevExchange community showcases. And you can start your own communities too.</p>
      </div>
    </div>

    <div className={styles.section}>
      <a href="/tags/uos" className="tag_link" target="_blank">#uos</a>
      <a href="/tags/airdrop" className="tag_link" target="_blank"> #airdrop</a>
    </div>

    <div className={styles.commentsCount}>Comments {props.commentsCount !== 0 ? props.commentsCount : ''}</div>
    <div className="post-body__comments">
      <Comments postId={props.postId} containerId={COMMENTS_CONTAINER_ID_POST} />
    </div>
  </Fragment>
);

OfferContent.defaultProps = {
  commentsCount: 0,
  score: 0,
};

OfferContent.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.any),
  conditions: PropTypes.objectOf(PropTypes.any),
  score: PropTypes.number,
  postId: PropTypes.number.isRequired,
  commentsCount: PropTypes.number,
};

export default OfferContent;
