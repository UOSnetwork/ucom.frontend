import { connect } from 'react-redux';
import React from 'react';
import Avatar from './Avatar';
import OrganizationsDropdown from './OrganizationsDropdown';
import { getUserName } from '../utils/user';
import urls from '../utils/urls';
import { selectUser } from '../store/selectors';
import { setPostData } from '../actions';

const CreateBy = (props) => {
  if (props.post.data.id) {
    return null;
  }

  const organization = (props.user.organizations || [])
    .find(i => +i.id === +props.post.data.organizationId);

  return (
    <div className="inline inline_small">
      <div className="inline__item">
        <span className="title title_xxsmall title_medium">By</span>
      </div>
      <div className="inline__item">
        <Avatar size="xsmall" src={urls.getFileUrl(organization ? organization.avatarFilename : props.user.avatarFilename)} />
      </div>
      <div className="inline__item">
        <div className="title title_xxsmall title_medium">{organization ? organization.title : getUserName(props.user)}</div>
      </div>
      <div className="inline__item">
        <OrganizationsDropdown
          onSelect={(organizationId) => {
            props.setPostData({ organizationId });
          }}
        />
      </div>
    </div>
  );
};

export default connect(
  state => ({
    user: selectUser(state),
    post: state.post,
  }),
  dispatch => ({
    setPostData: data => dispatch(setPostData(data)),
  }),
)(CreateBy);
