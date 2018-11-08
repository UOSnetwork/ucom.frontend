import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import React, { PureComponent } from 'react';
import PostRating from '../Rating/PostRating';
import RepostRating from '../Rating/RepostRating';
import UserCard from '../UserCard';
import IconComment from '../Icons/Comment';
import IconShare from '../Icons/Share';
import IconRepost from '../Icons/Repost';
import Comments from '../Comments/Comments';
import ShareBlock from './ShareBlock';
import LastUserComments from '../Comments/LastUserComments';
import FeedForm from './FeedForm';
import { getPostUrl, getPostTypeById, getPinnedPostUrl } from '../../utils/posts';
import { getFileUrl } from '../../utils/upload';
import { getUserName, getUserUrl } from '../../utils/user';
import { escapeQuotes } from '../../utils/text';
import { getPostById } from '../../store/posts';
import { getUserById } from '../../store/users';
import { selectUser } from '../../store/selectors/user';
import { createComment } from '../../actions/comments';
import { updatePost } from '../../actions/posts';
import { scrollTo } from '../../utils/scroll';

const POST_TOP_OFFSET = 20;

class Repost extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formIsVisible: false,
      commentsIsVisible: false,
      sharePopup: false,
      timestamp: (new Date()).getTime(),
    };
  }

  componentDidMount() {
    if (this.props.pinned) {
      this.showOnFeed();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.pinned && nextProps.pinned) {
      this.showOnFeed();
    }
  }

  showOnFeed() {
    scrollTo(this.el, POST_TOP_OFFSET);
    this.toggleComments();
  }

  toggleComments = () => {
    this.setState({
      timestamp: (new Date()).getTime(),
      commentsIsVisible: !this.state.commentsIsVisible,
    });
  };

  toggleShare = () => {
    this.setState({ sharePopup: !this.state.sharePopup });
  }

  showForm = () => {
    this.setState({ formIsVisible: true });
  }

  hideForm = () => {
    this.setState({ formIsVisible: false });
  }

  render() {
    const post = getPostById(this.props.posts, this.props.id);

    if (!post) {
      return null;
    }

    const user = getUserById(this.props.users, post.userId);

    return (
      <div className="repost">
        <div className="post__info-block">
          <IconRepost />
          <div className="post__type post__type--icon"><strong>{getPostTypeById(post.postTypeId)}</strong></div>
          <div className="toolbar__main">{moment(post.updatedAt).fromNow()}</div>
          <div className="toolbar__side">
            <RepostRating postId={post.id} />
          </div>
        </div>

        {user && (
          <div className="post__user">
            <UserCard
              sign="@"
              userName={getUserName(user)}
              accountName={user.accountName}
              profileLink={getUserUrl(user.id)}
              avatarUrl={getFileUrl(user.avatarFilename)}
            />
          </div>
        )}
        <div className="post post--grey" id={`post-${post.post.id}`} ref={(el) => { this.el = el; }}>
          <div className="post__info-block">
            <div className="post__type"><strong>{getPostTypeById(post.post.postTypeId)}</strong></div>
            <div className="toolbar__main">{moment(post.post.updatedAt).fromNow()}</div>
            <div className="toolbar__side">
              <PostRating postId={post.post.id} />
            </div>
          </div>

          <div className="post__user">
            <UserCard
              sign="@"
              userName={getUserName(post.post.user)}
              accountName={post.post.user.accountName}
              profileLink={getUserUrl(post.post.user.id)}
              avatarUrl={getFileUrl(post.post.user.avatarFilename)}
            />
          </div>

          <div className="post__content">
            {this.state.formIsVisible ? (
              <div className="post__form">
                <FeedForm
                  message={post.description}
                  onCancel={this.hideForm}
                  onSubmit={(description) => {
                    this.hideForm();
                    this.props.updatePost({
                      postId: post.id,
                      data: { description },
                    });
                  }}
                />
              </div>
            ) : (
              <h1 className="post__title">
                {post.post.postTypeId === 10 ? (
                  <div className="toolbar toolbar_fluid toolbar_small">
                    <div className="toolbar__main">
                      <Link to={getPinnedPostUrl(post.post)}>{escapeQuotes(post.post.description)}</Link>
                    </div>
                  </div>
                  ) : (
                    <Link to={getPostUrl(post.post.id)}>{escapeQuotes(post.post.title)}</Link>
                  )
                }
              </h1>
            )}

            {post.post.mainImageFilename && (
              <div className="post__cover">
                <Link to={getPostUrl(post.post.id)}>
                  <img src={getFileUrl(post.post.mainImageFilename)} alt="cover" />
                </Link>
              </div>
            )}

            {post.post.leadingText && (
              <h2 className="post__title post__title_leading post__title_leading--no-margin">{escapeQuotes(post.post.leadingText)}</h2>
            )}
          </div>
        </div>
        <div className="post__footer">
          <span
            role="presentation"
            className={classNames(
              'post__comment-count',
              { 'post__comment-count_active': this.state.commentsIsVisible },
            )}
            onClick={this.toggleComments}
          >
            <span className="inline inline_small">
              <span className="inline__item">
                <IconComment />
              </span>
              <span className="inline__item">{post.commentsCount}</span>
            </span>
          </span>
          <span
            role="presentation"
            className={classNames(
              'post__share',
              { 'post__share_active': this.state.sharePopup },
            )}
            onClick={this.toggleShare}
          >
            <span className="inline inline_small">
              <span className="inline__item">
                <IconShare />
              </span>
              <span className="inline__item">Share</span>
            </span>
          </span>
        </div>
        {this.state.sharePopup ? (
          <div className="post__share-popup">
            <ShareBlock
              link={getPinnedPostUrl(post)}
              postId={post.id}
              onClickClose={() => { this.setState({ sharePopup: false }); }}
            />
          </div>
        ) : null }
        <div className="post__comments">
          {this.state.commentsIsVisible ? (
            <Comments postId={post.id} />
          ) : (
            <LastUserComments postId={post.id} timestamp={this.state.timestamp} />
          )}
        </div>
      </div>
    );
  }
}

Repost.propTypes = {
  id: PropTypes.number,
  pinned: PropTypes.bool,
  updatePost: PropTypes.func,
  posts: PropTypes.objectOf(PropTypes.object).isRequired,
  users: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default connect(
  state => ({
    posts: state.posts,
    users: state.users,
    comments: state.comments,
    user: selectUser(state),
  }),
  dispatch => bindActionCreators({
    createComment,
    updatePost,
  }, dispatch),
)(Repost);