import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import FeedInput from './Input';
import Post from './Post/Post';
import LoadMore from './LoadMore';
import Filters from './Filters';
import { selectOrgById } from '../../store';
import { ORGANIZATION_TYPE_ID_MULTI } from '../../utils/constants';

const FeedView = (props) => {
  const org = useSelector(selectOrgById(props.forOrgId), isEqual);
  let disabledForNonMultiOrg;

  if (props.forOrgId) {
    disabledForNonMultiOrg = org ? org.organizationTypeId !== ORGANIZATION_TYPE_ID_MULTI : true;
  } else {
    disabledForNonMultiOrg = false;
  }

  return (
    <div className={`feed ${props.isMobile ? 'feed-mobile' : ''}`}>
      {props.showForm &&
        <FeedInput
          initialText={props.feedInputInitialText}
          forUserId={props.forUserId}
          forOrgId={props.forOrgId}
          onSubmit={props.callbackOnSubmit}
          disabledForNonMultiOrg={disabledForNonMultiOrg}
        />
      }

      <Filters {...props.filters} />

      {props.postIds.length > 0 &&
        <div className="feed__list">
          {(props.filter ? props.postIds.filter(props.filter) : props.postIds).map(id => (
            <div className="feed__item" key={id}>
              <Post
                id={id}
                feedTypeId={props.feedTypeId}
                originEnabled={props.originEnabled}
                forUserId={props.forUserId}
                forOrgId={props.forOrgId}
              />
            </div>
          ))}
        </div>
      }

      {props.hasMore &&
        <div className="feed__loadmore">
          <LoadMore
            url={props.loadMoreUrl}
            disabled={props.loading}
            onClick={() => {
              if (props.loading) return;
              props.onClickLoadMore();
            }}
          />
        </div>
      }
    </div>
  );
};

FeedView.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  postIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  loading: PropTypes.bool.isRequired,
  loadMoreUrl: PropTypes.string,
  feedInputInitialText: PropTypes.string,
  showForm: PropTypes.bool,
  onClickLoadMore: PropTypes.func.isRequired,
  filter: PropTypes.func,
  isMobile: PropTypes.bool,
  originEnabled: PropTypes.bool,
  forUserId: PropTypes.number,
  forOrgId: PropTypes.number,
  callbackOnSubmit: PropTypes.func,
  filters: PropTypes.shape(Filters.propTypes),
};

FeedView.defaultProps = {
  loadMoreUrl: null,
  showForm: false,
  feedInputInitialText: null,
  filter: null,
  isMobile: false,
  originEnabled: true,
  forUserId: undefined,
  forOrgId: undefined,
  callbackOnSubmit: undefined,
  filters: Filters.defaultProps,
};

export default FeedView;
