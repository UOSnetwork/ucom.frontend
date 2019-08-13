import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import EntryCard from '../EntryCard';
import Popup, { Content } from '../Popup';
import { UserFollowButton, OrgFollowButton } from '../FollowButton';
import Pagination from '../Pagination/index';

// TODO: Replace and remove another popups
const EntryListPopup = props => (
  <Popup onClickClose={props.onClickClose}>
    <Content onClickClose={props.onClickClose}>
      <div className={styles.container}>
        {props.title &&
          <h2 className={styles.title}>{props.title}</h2>
        }
        <div className={styles.list}>
          {props.data.map(item => (
            <div
              key={item.id}
              className={classNames({
                [styles.item]: true,
                [styles.follow]: item.follow,
              })}
            >
              <div className={styles.card}>
                <EntryCard {...{ ...item }} />
              </div>

              {item.follow && item.organization &&
                <div className={styles.action}>
                  <OrgFollowButton orgId={+item.id} />
                </div>
              }

              {item.follow && !item.organization &&
                <div className={styles.action}>
                  <UserFollowButton userId={+item.id} />
                </div>
              }
            </div>
          ))}
        </div>

        {props.metadata &&
          <Pagination
            {...props.metadata}
            onChange={props.onChangePage}
          />
        }
      </div>
    </Content>
  </Popup>
);

EntryListPopup.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    ...EntryCard.propTypes,
    id: PropTypes.number.isRequired,
    follow: PropTypes.bool,
  })),
  metadata: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalAmount: PropTypes.number,
  }),
  onClickClose: PropTypes.func.isRequired,
  onChangePage: PropTypes.func,
};

EntryListPopup.defaultProps = {
  title: undefined,
  data: [],
  metadata: undefined,
  onChangePage: undefined,
};

export default EntryListPopup;
