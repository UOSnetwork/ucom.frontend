import { throttle, xor } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useRef, useCallback, Fragment } from 'react';
import EntryCard from '../../EntryCard';
import UserFollowButton from '../../User/UserFollowButton';
import Popup, { Content } from '../../Popup';
import Tabs from './Tabs';
import styles from './styles.css';

const UsersPopup = ({
  users, tabs, visible, onLoadMore, onClickClose,
}) => {
  const listRef = useRef();

  const onScroll = useCallback(throttle(() => {
    if (!listRef.current || !onLoadMore) {
      return;
    }

    if (listRef.current.scrollHeight - listRef.current.scrollTop < listRef.current.clientHeight + 300) {
      onLoadMore();
    }
  }, 100), [listRef]);

  const followers = users.filter(user => user && user.myselfData && user.myselfData.myFollower);
  const others = xor(users, followers);

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
          <h2 className={styles.title}>Votes</h2>

          <Tabs {...tabs} />

          <div
            ref={listRef}
            className={styles.list}
            onScroll={onScroll}
          >
            {followers.length > 0 &&
              <Fragment>
                <div className={styles.label}>Your Followers</div>

                {followers.map(item => (
                  <div className={styles.item} key={item.id}>
                    <EntryCard {...item} />
                    <UserFollowButton userId={item.id} />
                  </div>
                ))}
              </Fragment>
            }

            {others.length > 0 &&
              <Fragment>
                <div className={styles.label}>Other</div>

                {others.map(item => (
                  <div className={styles.item} key={item.id}>
                    <EntryCard {...item} />
                    <UserFollowButton userId={item.id} />
                  </div>
                ))}
              </Fragment>
            }
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

export default memo(UsersPopup);
