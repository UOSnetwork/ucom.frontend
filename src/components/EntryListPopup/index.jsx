import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React, { Fragment } from 'react';
import styles from './styles.css';
import EntryCard from '../EntryCard';
import Popup, { Content } from '../Popup';
import { UserFollowButton, OrgFollowButton } from '../FollowButton';
import Pagination from '../Pagination/index';

// TODO: Replace and remove another popups
const EntryListPopup = (props) => {
  const mediaQuery = useSelector(state => state.mediaQuery);

  return (
    <Popup onClickClose={props.onClickClose}>
      <Content onClickClose={props.onClickClose}>
        <div className={styles.container}>
          {props.title &&
            <h2 className={styles.title}>{props.title}</h2>
          }
          <div
            className={classNames({
              [styles.list]: true,
              [styles.withFollowButton]: props.followButtonEnabled,
            })}
          >
            {props.data.map(item => (
              <Fragment key={item.id}>
                <EntryCard {...{ ...item }} disableRate={mediaQuery.xsmall && props.followButtonEnabled} />

                {props.followButtonEnabled && item.organization &&
                  <OrgFollowButton orgId={+item.id} small={mediaQuery.small} iconEnabled={!mediaQuery.small} />
                }

                {props.followButtonEnabled && !item.organization &&
                  <UserFollowButton userId={+item.id} small={mediaQuery.small} iconEnabled={!mediaQuery.small} />
                }
              </Fragment>
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
};

EntryListPopup.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    ...EntryCard.propTypes,
    id: PropTypes.number.isRequired,
  })),
  metadata: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalAmount: PropTypes.number,
  }),
  onClickClose: PropTypes.func.isRequired,
  onChangePage: PropTypes.func,
  followButtonEnabled: PropTypes.bool,
};

EntryListPopup.defaultProps = {
  title: undefined,
  data: [],
  metadata: undefined,
  onChangePage: undefined,
  followButtonEnabled: true,
};

export default EntryListPopup;
