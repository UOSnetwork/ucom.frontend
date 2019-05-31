import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import FeedForm from './FeedForm';
import { selectUser } from '../../store/selectors/user';
import { getUserById } from '../../store/users';
import urls from '../../utils/urls';
import UserPick from '../UserPick/UserPick';

class FeedInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };
  }

  showForm = () => {
    this.setState({ active: true });
  }

  hideForm = () => {
    this.setState({ active: false });
  }

  createPost = (message, fileImg) => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(message, fileImg);
    }

    this.hideForm();
  }

  render() {
    const user = getUserById(this.props.users, this.props.user.id);

    if (!user) {
      return null;
    }

    return (
      <div className="feed-input">
        <div className="feed-input__invite" role="presentation" onClick={this.showForm}>
          <span className="inline inline_medium">
            <span className="inline__item">Hey</span>
            <span className="inline__item">
              <UserPick src={urls.getFileUrl(user.avatarFilename)} />
            </span>
            <span className="inline__item">what’s new?</span>
          </span>
        </div>

        {this.state.active && (
          <div className="feed-input__container">
            <div
              role="presentation"
              className="feed-input__overlay"
              onClick={this.hideForm}
            />
            <FeedForm
              onSubmit={this.createPost}
              onCancel={this.hideForm}
              initialText={this.props.initialText}
            />
          </div>
        )}
      </div>
    );
  }
}

FeedInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  users: PropTypes.objectOf(PropTypes.object).isRequired,
  initialText: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
};

FeedInput.defaultProps = {
  initialText: '',
  user: {},
};

export default connect(state => ({
  users: state.users,
  posts: state.posts,
  user: selectUser(state),
}))(FeedInput);
