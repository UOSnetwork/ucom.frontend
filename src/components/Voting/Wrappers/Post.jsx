import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import React, { memo, useState } from 'react';
import Votin from '../index';
import { selectOwner, selectPostById, selectUsersByIds } from '../../../store/selectors';
import { authShowPopup } from '../../../actions/auth';
import { vote } from '../../../actions/posts';
import { addErrorNotificationFromResponse } from '../../../actions/notifications';
import { formatRate } from '../../../utils/rate';
import withLoader from '../../../utils/withLoader';
import { TAB_ID_ALL } from '../UsersPopup/Tabs';

const PostVotingWrapper = ({ postId }) => {
  const dispatch = useDispatch();
  const [upCount, setUpCount] = useState(0);
  const [downCount, setDownCount] = useState(0);
  const [upUserPicks, setUpUserPicks] = useState([]);
  const [downUserPicks, setDownUserPicks] = useState([]);
  const [popupActiveTabId, setPopupActiveTabId] = useState(TAB_ID_ALL);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupUsersIds, setPopupUsersIds] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const post = useSelector(selectPostById(postId), isEqual);
  const owner = useSelector(selectOwner, isEqual);
  const users = useSelector(selectUsersByIds(popupUsersIds), isEqual);

  return (
    <Votin
      rate={formatRate(post.currentRate, true)}
      count={post.currentVote}
      selfVote={post.myselfData && post.myselfData.myselfVote}
      onClickUp={async () => {
        if (!owner.id) {
          dispatch(authShowPopup());
          return;
        }
        try {
          await withLoader(dispatch(vote(true, postId)));
        } catch (err) {
          dispatch(addErrorNotificationFromResponse(err));
        }
      }}
      onClickDown={async () => {
        if (!owner.id) {
          dispatch(authShowPopup());
          return;
        }
        try {
          await withLoader(dispatch(vote(false, postId)));
        } catch (err) {
          dispatch(addErrorNotificationFromResponse(err));
        }
      }}
      onShow={() => {
        console.log('on show');
      }}
      details={{
        upCount,
        downCount,
        upUserPicks: {
          userPicks: upUserPicks, // TODO: Map props
          onClickMore: () => {
            setPopupVisible(true);
          },
        },
        downUserPicks: {
          userPicks: upUserPicks, // TODO: Map props
          onClickMore: () => {
            setPopupVisible(true);
          },
        },
        loading: detailsLoading,
      }}
      usersPopup={{
        users, // TODO: Map props
        visible: popupVisible,
        onClickClose: () => {
          setPopupVisible(false);
        },
        onLoadMore: () => {
          console.log('on laod more');
        },
        tabs: {
          count: post.currentVote,
          upCount,
          downCount,
          activeTabId: popupActiveTabId,
          onClickTab: (tabId) => {
            setPopupActiveTabId(tabId);
          },
        },
      }}
    />
  );
};

PostVotingWrapper.propTypes = {
  postId: PropTypes.number.isRequired,
};

export default memo(PostVotingWrapper);
