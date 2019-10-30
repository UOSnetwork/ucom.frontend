import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import LayoutBase from '../components/Layout/LayoutBase';
import FeedUser from '../components/Feed/FeedUser';
import { FEED_TYPE_ID_TAG } from '../utils';
import api from '../api';
import { addTags } from '../actions/tags';
import { existHashTag } from '../utils/text';
import { getPostById } from '../store/posts';
import headerStyles from '../components/EntryHeader/styles.css';
import { formatRate } from '../utils/rate';
import Stats from '../components/Followers/Stats';
import urls from '../utils/urls';
import { getUserName } from '../utils/user';
import { getUsersByIds } from '../store/users';
import { getOrganizationByIds } from '../store/organizations';
import EntryListSection from '../components/EntryListSection';
import EntryCreatedAt from '../components/EntryCreatedAt';
import Footer from '../components/Footer';
import { addUsers } from '../actions/users';
import loader from '../utils/loader';

const ENTRY_SECTION_LIMIT = 3;

const Tag = (props) => {
  const { t } = useTranslation();
  const tagTitle = props.match.params.title;
  const [loading, setLoading] = useState(true);
  const [usersPopupIds, setUsersPopupIds] = useState([]);
  const [usersPopupMetadata, setUsersPopupMetadata] = useState({});

  const getTag = async () => {
    setLoading(true);

    try {
      const tag = await api.getTag(props.match.params.title);
      props.dispatch(addTags([tag]));
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  const getTagUsers = async (page = 1) => {
    loader.start();
    try {
      const data = await api.getTagUsers({
        tagTitle,
        page,
        lastId: usersPopupIds[usersPopupIds.length - 1],
      });
      props.dispatch(addUsers(data.data));
      setUsersPopupIds(data.data.map(i => i.id));
      setUsersPopupMetadata(data.metadata);
    } catch (e) {
      console.error(e);
    }
    loader.done();
  };

  useEffect(() => {
    if (tagTitle) {
      getTag(tagTitle);
    }
  }, [tagTitle]);

  const tag = props.tags.data[tagTitle];

  if (loading) {
    return null;
  }

  return (
    <LayoutBase gray>
      <div className="layout layout_profile">
        <div className="layout__header">
          <div className={`${headerStyles.entryHead} ${headerStyles.tag}`}>
            <div className={`${headerStyles.main} ${headerStyles.noAvatar}`}>
              <div className={headerStyles.info}>
                <div className={`${headerStyles.userName} ${headerStyles.big}`}>#{tagTitle}</div>
              </div>
              <div className={headerStyles.rate}>{formatRate(tag ? tag.currentRate : 0)}°</div>
            </div>
            <div className={headerStyles.side}>
              <div className={headerStyles.usersLists}>
                <div>
                  <Stats title={t('Posts')} amount={tag ? tag.posts.metadata.totalAmount : 0} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {tag &&
          <div className="layout__sidebar">
            {tag.users &&
              <EntryListSection
                title="Top uses by"
                limit={ENTRY_SECTION_LIMIT}
                data={getUsersByIds(props.users, tag.users.data).map(item => ({
                  id: item.id,
                  avatarSrc: urls.getFileUrl(item.avatarFilename),
                  url: urls.getUserUrl(item.id),
                  title: getUserName(item),
                  nickname: item.accountName,
                  scaledImportance: item.scaledImportance,
                  follow: true,
                }))}
                popupData={getUsersByIds(props.users, usersPopupIds).map(item => ({
                  id: item.id,
                  avatarSrc: urls.getFileUrl(item.avatarFilename),
                  url: urls.getUserUrl(item.id),
                  title: getUserName(item),
                  nickname: item.accountName,
                  scaledImportance: item.scaledImportance,
                  follow: true,
                }))}
                popupMetadata={usersPopupMetadata}
                onClickViewAll={getTagUsers}
                onChangePage={getTagUsers}
                showViewMore={tag.users.metadata.totalAmount > ENTRY_SECTION_LIMIT}
              />
            }

            {tag.orgs &&
              // TODO: Refactoring like tag users
              <EntryListSection
                title="Communities"
                data={getOrganizationByIds(props.organizations, tag.orgs.data).map(item => ({
                  id: item.id,
                  organization: true,
                  avatarSrc: urls.getFileUrl(item.avatarFilename),
                  url: urls.getOrganizationUrl(item.id),
                  title: item.title,
                  nickname: item.nickname,
                  currentRate: item.currentRate,
                }))}
              />
            }

            <EntryCreatedAt date={tag.createdAt} />
          </div>
        }
        <div className="layout__main">
          {tagTitle &&
            <FeedUser
              feedTypeId={FEED_TYPE_ID_TAG}
              userId={props.user.data.id}
              tagIdentity={tagTitle}
              feedInputInitialText={tagTitle}
              filter={(postId) => {
                const post = getPostById(props.posts, postId);
                return post && post.description && existHashTag(post.description, tagTitle);
              }}
              callbackOnSubmit={() => setTimeout(() => getTag(tagTitle), 600)}
            />
          }
        </div>
        <div className="layout__footer">
          <Footer />
        </div>
      </div>
    </LayoutBase>
  );
};

Tag.propTypes = {
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  organizations: PropTypes.objectOf(PropTypes.any).isRequired,
  posts: PropTypes.shape({
    data: PropTypes.shape({
      description: PropTypes.string,
    }),
  }).isRequired,
  user: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.number,
    }),
  }).isRequired,
  tags: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(state => ({
  posts: state.posts,
  tags: state.tags,
  user: state.user,
  users: state.users,
  organizations: state.organizations,
}))(Tag);
