import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IconRepost from '../Icons/Repost';
import IconCopyLink from '../Icons/CopyLink';
import { addRepost } from '../../actions/posts';
import { selectUser } from '../../store/selectors/user';
import styles from './styles.css';
import IconFacebook from '../Icons/Socials/Share/Facebook';
import IconTwitter from '../Icons/Socials/Share/Twitter';
import IconTelegram from '../Icons/Socials/Share/Telegram';
import { POST_TYPE_MEDIA_ID } from '../../utils/posts';
import { copyToClipboard } from '../../utils/text';
import { COPY_TO_CLIPBOARD_SUCCESS_MESSAGE } from '../../utils/constants';
import { addSuccessNotification } from '../../actions/notifications';

class ShareBlock extends PureComponent {
  constructor(props) {
    super(props);

    this.onClick = (e) => {
      if (!this.el.contains(e.target)) {
        this.props.onClickClose();
      }
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  render() {
    return (
      <div className={styles.share} ref={(el) => { this.el = el; }}>
        {this.props.repostAvailable &&
          <div
            className={styles.repostBlock}
            role="presentation"
            onClick={() => {
              this.props.addRepost(this.props.postId);
              this.props.onClickClose();
            }}
          >
            <IconRepost className={styles.repostIcon} />
            <span>Repost to my profile</span>
          </div>
        }
        {(this.props.postTypeId === POST_TYPE_MEDIA_ID ||
          this.props.postPostTypeId === POST_TYPE_MEDIA_ID) &&
          <div className={styles.social}>
            Share to
            <div className={styles.socialIcons}>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin + (this.props.linkPost || this.props.link)}`} target="_blank" rel="noopener noreferrer" className={styles.icon}><IconFacebook /></a>
              <a href={`https://twitter.com/intent/tweet?url=${window.location.origin + (this.props.linkPost || this.props.link)}`} target="_blank" rel="noopener noreferrer" className={styles.icon}><IconTwitter /></a>
              <a href={`https://telegram.me/share/url?url=${window.location.origin + (this.props.linkPost || this.props.link)}`} target="_blank" rel="noopener noreferrer" className={styles.icon}><IconTelegram /></a>
            </div>
          </div>
        }
        <div className={styles.copylink__block}>
          <span>Copy link</span>
          <div className={styles.copylink}>
            <a target="_blank" rel="noopener noreferrer" href={this.props.link} className={styles.copylinkTitle}>{window.location.origin + this.props.link}</a>
            <IconCopyLink
              onClick={() => {
                copyToClipboard(window.location.origin + this.props.link);
                this.props.addSuccessNotification(COPY_TO_CLIPBOARD_SUCCESS_MESSAGE);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

ShareBlock.propTypes = {
  link: PropTypes.string,
  linkPost: PropTypes.string,
  addRepost: PropTypes.func.isRequired,
  onClickClose: PropTypes.func.isRequired,
  repostAvailable: PropTypes.bool,
  postId: PropTypes.number,
  postTypeId: PropTypes.number,
  postPostTypeId: PropTypes.number,
  addSuccessNotification: PropTypes.func.isRequired,
};

ShareBlock.defaultProps = {
  link: undefined,
  linkPost: undefined,
  repostAvailable: false,
  postId: undefined,
  postTypeId: undefined,
  postPostTypeId: undefined,
};

export default connect(
  state => ({
    user: selectUser(state),
  }),
  dispatch => bindActionCreators({
    selectUser,
    addRepost,
    addSuccessNotification,
  }, dispatch),
)(ShareBlock);
