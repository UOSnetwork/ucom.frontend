import { useTranslation } from 'react-i18next';
import { throttle, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useRef, useCallback } from 'react';
import EntryCard from '../../EntryCard';
import { DownvoteIcon, UpvoteIcon } from '../../Icons/FeedIcons';
import { UserFollowButton } from '../../FollowButton';
import Popup, { Content } from '../../Popup';
import Tabs from './Tabs';
import styles from './styles.css';

const UsersPopup = ({
  users, tabs, visible, onLoadMore, onClickClose,
}) => {
  const { t } = useTranslation();
  const listRef = useRef();

  const onScroll = useCallback(throttle(() => {
    if (!listRef.current || !onLoadMore) {
      return;
    }

    if (listRef.current.scrollHeight - listRef.current.scrollTop < listRef.current.clientHeight + 300) {
      onLoadMore();
    }
  }, 100), [listRef, onLoadMore]);

  if (!visible) {
    return null;
  }

  return (
    <Popup onClickClose={onClickClose}>
      <Content
        fixWidth={false}
        onClickClose={onClickClose}
      >
        <div className={styles.users}>
          <h2 className={styles.title}>{t('Votes')}</h2>

          <Tabs {...tabs} />

          <div
            ref={listRef}
            className={styles.list}
            onScroll={onScroll}
          >
            {users.map(item => (
              <div className={styles.item} key={item.id}>
                <EntryCard
                  {...item}
                  userPickWithIcon={{
                    icon: item.contentVote === 2 ? <UpvoteIcon /> : <DownvoteIcon />,
                    userPick: {
                      src: item.avatarSrc,
                      shadow: true,
                    },
                  }}
                />
                <div className={styles.follow}>
                  <UserFollowButton userId={item.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>
    </Popup>
  );
};

UsersPopup.propTypes = {
  visible: PropTypes.bool,
  users: PropTypes.arrayOf(PropTypes.shape({
    ...EntryCard.propTypes,
    id: PropTypes.number.isRequired,
  })),
  tabs: PropTypes.shape(Tabs.propTypes),
  onLoadMore: PropTypes.func,
  onClickClose: PropTypes.func,
};

UsersPopup.defaultProps = {
  visible: false,
  users: [],
  tabs: Tabs.defaultProps,
  onLoadMore: undefined,
  onClickClose: undefined,
};

export default memo(UsersPopup, isEqual);
