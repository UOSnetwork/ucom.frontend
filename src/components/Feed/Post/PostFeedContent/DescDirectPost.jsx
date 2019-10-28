import { withTranslation } from 'react-i18next';
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { sanitizeCommentText, checkHashTag } from '../../../../utils/text';
import styles from './styles.css';
import { POSTS_DESCRIPTION_PREVIEW_LIMIT } from '../../../../utils/posts';

class DescDirectPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      textBtn: props.t('more'),
    };
  }

  toggleHidden = () => {
    this.setState({
      isHidden: !this.state.isHidden,
      textBtn: this.state.isHidden ? null : this.props.t('more'),
    });
  }

  resctrictText = (text) => {
    const count = text.substring(0, POSTS_DESCRIPTION_PREVIEW_LIMIT).lastIndexOf(' ');
    text = text.substring(0, count);
    return checkHashTag(`${text} `);
  }

  render() {
    let text = this.props.desc;
    text = checkHashTag(text);

    return (
      <Fragment>
        {this.props.desc.length >= POSTS_DESCRIPTION_PREVIEW_LIMIT ? (
          <div>
            {this.state.isHidden ? (
              <span dangerouslySetInnerHTML={{ __html: sanitizeCommentText(this.resctrictText(this.props.desc)) }} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: sanitizeCommentText(text) }} />
            )}
            <span
              role="presentation"
              onClick={this.toggleHidden}
              className={styles.showMore}
            >
              {this.state.textBtn}
            </span>
          </div>
        ) : (
          <span dangerouslySetInnerHTML={{ __html: sanitizeCommentText(text) }} />
        )}
      </Fragment>
    );
  }
}

DescDirectPost.propTypes = {
  desc: PropTypes.string,
  t: PropTypes.func.isRequired,
};

DescDirectPost.defaultProps = {
  desc: '',
};

export default withTranslation()(DescDirectPost);
