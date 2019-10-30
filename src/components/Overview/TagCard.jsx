import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import urls from '../../utils/urls';
import { addTags } from '../../actions/tags';

const TagCard = (props) => {
  const { t } = useTranslation();
  const { tag } = props;
  const tagLink = urls.getTagUrl(tag.title);

  return (
    <div className="community-item">
      <div className="community-item__header">
        <div className="community-item__content">
          <div className="community-item__toobar">
            <div className="community-item__main">
              <Link target="_blank" to={tagLink} href={tagLink} className="community-item__title">#{tag.title}</Link>
            </div>
            <div className="community-item__rate">
              {tag.currentRate}°
            </div>
          </div>
        </div>
      </div>

      <div className="community-item__footer">
        <div className="community-item__posts">{tag.currentPostsAmount}
          <div className="community-item__caption">
            {t('Posts')}
          </div>
        </div>
      </div>
    </div>
  );
};


export default connect(
  state => ({
    tags: state.tags,
  }),
  dispatch => bindActionCreators({
    addTags,
  }, dispatch),
)(TagCard);
