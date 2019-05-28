import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import LayoutBase from '../components/Layout/LayoutBase';
import { fetchPost, postsFetch, getOnePostOffer, getOnePostOfferWithUserAirdrop } from '../actions/posts';
import { getPostById } from '../store/posts';
import OfferCard from '../components/Offer/OfferCard';
import { getPostCover, getContentMetaTags } from '../utils/posts';
import { getUserName } from '../utils/user';
import urls from '../utils/urls';
import styles from './Offer.css';
import { COMMENTS_CONTAINER_ID_POST } from '../utils/comments';
import loader from '../utils/loader';
import { commentsResetContainerDataByEntryId } from '../actions/comments';
import OfferSidebar from '../components/Offer/OfferSidebar';
import OfferContent from '../components/Offer/OfferContent';
import { getToken, getCookie } from '../utils/token';
import { getManyUsers, fetchMyself } from '../actions/users';
import api from '../api';
import EntrySubHeader from '../components/EntrySubHeader';
import stylesSubHeader from '../components/EntrySubHeader/styles.css';
import { getOrganization } from '../actions/organizations';
import { airdropId_2, getAirdropOfferId_2, getGitHubAuthLink } from '../utils/airdrop';
import { selectUser } from '../store/selectors/user';
import { addErrorNotification } from '../actions/notifications';

const { CommonHeaders } = require('ucom.libs.common').Common.Dictionary;

const Offer = (props) => {
  const postId = getAirdropOfferId_2();
  const gitHubAuthLink = getGitHubAuthLink();
  const [token, setToken] = useState(null);
  const [cookie, setCookie] = useState();
  const [users, setUsers] = useState([]);
  const [conditions, setConditions] = useState(null);
  const [metadata, setMetadata] = useState({ page: 1, perPage: 20 });
  const post = getPostById(props.posts, postId);

  useEffect(() => {
    setToken(getToken());
    setCookie(getCookie(CommonHeaders.TOKEN_USERS_EXTERNAL_GITHUB));
  }, []);

  const pairAccounts = async () => {
    if (cookie && token && conditions && (conditions.conditions.authGithub === false || conditions.conditions.authMyself === false)) {
      const options = {
        headers: {},
      };
      if (cookie) {
        options.headers[CommonHeaders.TOKEN_USERS_EXTERNAL_GITHUB] = cookie;
      }
      try {
        await api.syncAccountGithub(options);
      } catch (e) {
        console.error(e);
        props.addErrorNotification('Current user or this GitHub identity is already paired with a different user');
      }
    }
  };

  const getParticipants = (page = 1) => {
    props.getManyUsers({
      airdropFilter: { airdrops: { id: airdropId_2.id } },
      orderBy: '-score',
      page,
      perPage: 20,
    }).then((data) => {
      setUsers(data.data);
      setMetadata(data.metadata);
    });
  };

  const onChangePage = (page) => {
    getParticipants(page);
    window.scrollTo(0, 'top');
  };

  useEffect(() => {
    loader.start();
    props.commentsResetContainerDataByEntryId({
      entryId: postId,
      containerId: COMMENTS_CONTAINER_ID_POST,
    });
    const options = {
      headers: {},
    };
    if (cookie) {
      options.headers[CommonHeaders.TOKEN_USERS_EXTERNAL_GITHUB] = cookie;
    }

    props.getOnePostOfferWithUserAirdrop({
      postId,
      airdropFilter: { airdrop_id: airdropId_2.id },
      usersTeamQuery: {
        page: 1,
        per_page: 20,
        order_by: '-score',
        filters: {
          airdrops: {
            id: airdropId_2.id,
          },
        },
      },
    }, options).then((data) => {
      props.getOrganization(data.onePostOffer.organization.id);
      setConditions(data.oneUserAirdrop);
    });

    getParticipants();

    loader.done();
  }, [postId, props.user, cookie]);

  if (!post) {
    return null;
  }

  useEffect(() => {
    pairAccounts();
  }, [cookie, token, conditions]);

  return (
    <LayoutBase gray>
      <div className={styles.container}>
        <div className={stylesSubHeader.wrapperOffer}>
          <EntrySubHeader
            organization
            showFollow
            userUrl={urls.getOrganizationUrl(post.organization.id)}
            userName={post.organization.title}
            userAvatarUrl={urls.getFileUrl(post.organization.avatarFilename)}
            userId={+post.organization.id}
            userRate={+post.organization.currentRate}
          />
          <OfferCard
            postId={postId}
            coverUrl={getPostCover(post)}
            rate={+post.currentRate}
            title={post.title}
            url={urls.getPostUrl(post)}
            userUrl={urls.getUserUrl(post.user.id)}
            userImageUrl={urls.getFileUrl(post.user.avatarFilename)}
            userName={getUserName(post.user)}
            accountName={post.user.accountName}
            finishedAt={post.finishedAt}
            startedAt={post.startedAt}
            users={users}
            count={metadata.totalAmount}
            conditions={conditions}
            cookie={cookie}
            token={token}
            metadata={metadata}
            onChangePage={onChangePage}
            gitHubAuthLink={gitHubAuthLink}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <OfferContent
              postId={postId}
              score={conditions && conditions.score}
              tokens={post.offerData && post.offerData.tokens}
              commentsCount={post.commentsCount}
              conditions={conditions}
            />
          </div>
          <div className={styles.sidebar}>
            <OfferSidebar
              rate={+post.currentRate}
              postId={postId}
              createdAt={moment(post.createdAt).format('D MMM YYYY')}
              link={urls.getPostUrl(post)}
              repostAvailable={post.myselfData && post.myselfData.repostAvailable}
              conditions={conditions}
              cookie={cookie}
              token={token}
              postTypeId={post.postTypeId}
              startedAt={post.startedAt}
              finishedAt={post.finishedAt}
              gitHubAuthLink={gitHubAuthLink}
              organizationId={post.organizationId}
            />
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

Offer.propTypes = {
  posts: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  commentsResetContainerDataByEntryId: PropTypes.func.isRequired,
  getOnePostOfferWithUserAirdrop: PropTypes.func.isRequired,
  getManyUsers: PropTypes.func.isRequired,
  getOrganization: PropTypes.func.isRequired,
  addErrorNotification: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    posts: state.posts,
    users: state.users,
    user: selectUser(state),
  }),
  dispatch => bindActionCreators({
    fetchPost,
    postsFetch,
    commentsResetContainerDataByEntryId,
    getOnePostOffer,
    getOnePostOfferWithUserAirdrop,
    getManyUsers,
    getOrganization,
    fetchMyself,
    addErrorNotification,
  }, dispatch),
)(Offer);

export const getPostOfferData_2 = async (store) => {
  try {
    const postId = getAirdropOfferId_2();
    const data = await store.dispatch(getOnePostOfferWithUserAirdrop({
      postId,
      airdropFilter: { airdrop_id: airdropId_2.id },
      usersTeamQuery: {
        page: 1,
        per_page: 20,
        order_by: '-score',
        filters: {
          airdrops: {
            id: airdropId_2.id,
          },
        },
      },
    }));
    return ({
      contentMetaTags: getContentMetaTags(data.onePostOffer),
    });
  } catch (e) {
    throw e;
  }
};

