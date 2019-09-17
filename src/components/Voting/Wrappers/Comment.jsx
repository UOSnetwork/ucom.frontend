// TODO: Move copy paste from Post.jsx and Comment.jsx to single component

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { memo, useState, useCallback } from 'react';
import Votin from '../index';
import { selectOwner, selectCommentById, selectUsersByIds } from '../../../store/selectors';
import { authShowPopup } from '../../../actions/auth';
import { getVotesForEntityPreview, getVotesForEntity, voteForComment } from '../../../actions/voting';
import { addErrorNotificationFromResponse } from '../../../actions/notifications';
import { formatRate } from '../../../utils/rate';
import withLoader from '../../../utils/withLoader';
import { TAB_ID_ALL, TAB_ID_UP, TAB_ID_DOWN } from '../UsersPopup/Tabs';
import urls from '../../../utils/urls';
import { getUserName } from '../../../utils/user';
import { INTERACTION_TYPE_ID_VOTING_DOWNVOTE, INTERACTION_TYPE_ID_VOTING_UPVOTE, ENTITY_NAMES_COMMENTS } from '../../../utils/constants';
import { getSocialKey } from '../../../utils/keys';
import equalByProps from '../../../utils/equalByProps';

const interactionTypesByTabId = {
  [TAB_ID_ALL]: null,
  [TAB_ID_UP]: INTERACTION_TYPE_ID_VOTING_UPVOTE,
  [TAB_ID_DOWN]: INTERACTION_TYPE_ID_VOTING_DOWNVOTE,
};

const CommentVotingWrapper = ({ postId, commentId }) => {
  const dispatch = useDispatch();
  const [upCount, setUpCount] = useState(0);
  const [downCount, setDownCount] = useState(0);
  const [detailsUpUserIds, setDetailsUpUserIds] = useState([]);
  const [detailsDownUserIds, setDetailsDownUserIds] = useState([]);
  const [popupActiveTabId, setPopupActiveTabId] = useState(TAB_ID_ALL);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupUsersIds, setPopupUsersIds] = useState([]);
  const [popupUsersMetadata, setPopupUsersMetadata] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [popupUsersLoading, setPopupUsersLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const comment = useSelector(selectCommentById(commentId), equalByProps(['blockchainId', 'currentRate', 'currentVote', 'myselfData.myselfVote']));
  const owner = useSelector(selectOwner, equalByProps(['id', 'accountName']));
  const users = useSelector(selectUsersByIds(popupUsersIds), isEqual);
  const detailsUpUsers = useSelector(selectUsersByIds(detailsUpUserIds), isEqual);
  const detailsDownUsers = useSelector(selectUsersByIds(detailsDownUserIds), isEqual);

  const getDataForPreview = useCallback(async () => {
    setDetailsLoading(true);
    try {
      const { downvotes, upvotes } = await dispatch(getVotesForEntityPreview(commentId, ENTITY_NAMES_COMMENTS));
      setUpCount(upvotes.metadata.totalAmount);
      setDownCount(downvotes.metadata.totalAmount);
      setDetailsUpUserIds(upvotes.data.map(i => i.id));
      setDetailsDownUserIds(downvotes.data.map(i => i.id));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
    setDetailsLoading(false);
  }, []);

  const getDataForPopup = useCallback(async (interactionType) => {
    setPopupUsersLoading(true);
    setPopupUsersIds([]);
    try {
      const { data, metadata } = await withLoader(dispatch(getVotesForEntity(commentId, ENTITY_NAMES_COMMENTS, interactionType)));
      setPopupUsersIds(data.map(i => i.id));
      setPopupUsersMetadata(metadata);
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
    setPopupUsersLoading(false);
  }, []);

  const getMoreDataForUpList = useCallback(async (interactionType, page) => {
    setPopupUsersLoading(true);
    try {
      const { data, metadata } = await withLoader(dispatch(getVotesForEntity(commentId, ENTITY_NAMES_COMMENTS, interactionType, page)));
      setPopupUsersIds(prev => prev.concat(data.map(i => i.id)));
      setPopupUsersMetadata(metadata);
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
    setPopupUsersLoading(false);
  }, []);

  const vote = useCallback(async (isUp) => {
    if (loading) {
      return;
    }

    const privateKey = getSocialKey();

    if (!owner.id || !privateKey) {
      dispatch(authShowPopup());
      return;
    }

    setLoading(true);

    try {
      await dispatch(voteForComment(isUp, postId, commentId, owner.accountName, privateKey, comment.blockchainId));
    } catch (err) {
      console.error(err);
      dispatch(addErrorNotificationFromResponse(err));
    }

    setLoading(false);
  }, [postId, commentId, owner, comment, loading]);

  return (
    <Votin
      loading={loading}
      rate={formatRate(comment.currentRate, true)}
      count={comment.currentVote}
      selfVote={comment.myselfData && comment.myselfData.myselfVote}
      onClickUp={comment && owner && comment.userId !== owner.id ? () => vote(true) : undefined}
      onClickDown={comment && owner && comment.userId !== owner.id ? () => vote(false) : undefined}
      onClick={upCount + downCount > 0 ? () => {
        setPopupActiveTabId(TAB_ID_ALL);
        getDataForPopup();
        setPopupVisible(true);
      } : undefined}
      onClickTouchDevice={async () => {
        getDataForPopup();
        setPopupVisible(true);
      }}
      onShow={getDataForPreview}
      details={{
        upCount,
        downCount,
        upUserPicks: {
          userPicks: detailsUpUsers.map(item => ({
            url: urls.getUserUrl(item.id),
            src: urls.getFileUrl(item.avatarFilename),
          })),
          onClickMore: upCount > 3 ? () => {
            setPopupActiveTabId(TAB_ID_UP);
            getDataForPopup(INTERACTION_TYPE_ID_VOTING_UPVOTE);
            setPopupVisible(true);
          } : undefined,
        },
        downUserPicks: {
          userPicks: detailsDownUsers.map(item => ({
            url: urls.getUserUrl(item.id),
            src: urls.getFileUrl(item.avatarFilename),
          })),
          onClickMore: downCount > 3 ? () => {
            setPopupActiveTabId(TAB_ID_DOWN);
            getDataForPopup(INTERACTION_TYPE_ID_VOTING_DOWNVOTE);
            setPopupVisible(true);
          } : undefined,
        },
        loading: detailsLoading,
      }}
      usersPopup={{
        users: users.map(item => ({
          id: item.id,
          avatarSrc: urls.getFileUrl(item.avatarFilename),
          url: urls.getUserUrl(item.id),
          title: getUserName(item),
          nickname: item.accountName,
          scaledImportance: item.scaledImportance,
          contentVote: item.relatedMetadata && item.relatedMetadata.contentVote,
        })),
        visible: popupVisible,
        onClickClose: () => {
          setPopupVisible(false);
        },
        onLoadMore: () => {
          if (!popupUsersLoading && popupUsersMetadata.hasMore) {
            getMoreDataForUpList(interactionTypesByTabId[popupActiveTabId], popupUsersMetadata.page + 1);
          }
        },
        tabs: {
          count: upCount + downCount,
          upCount,
          downCount,
          activeTabId: popupActiveTabId,
          onClickTab: (tabId) => {
            getDataForPopup(interactionTypesByTabId[tabId]);
            setPopupActiveTabId(tabId);
          },
        },
      }}
    />
  );
};

CommentVotingWrapper.propTypes = {
  postId: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
};

export default memo(CommentVotingWrapper);
