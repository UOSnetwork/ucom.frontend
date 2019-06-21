import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import Footer from '../../components/Footer';
import LayoutBase from '../../components/Layout/LayoutBase';
import { EntryListSectionUsersWrapper, EntryListSectionOrgsWrapper } from '../../components/EntryListSection';
import Feed from '../../components/Feed/FeedUser';
import { USER_NEWS_FEED_ID } from '../../utils/feed';
import { PostsGridWrapper } from '../../components/PostsGrid';
import withLoader from '../../utils/withLoader';
import * as mainPageUserActions from '../../actions/mainPageUser';
import { selectOwner } from '../../store/selectors';
import { addErrorNotification } from '../../actions/notifications';

const HomeUserPage = () => {
  const dispatch = useDispatch();
  const state = useSelector(s => s.mainPageUser);
  const owner = useSelector(selectOwner);

  const getPageData = async (userId) => {
    try {
      await withLoader(dispatch(mainPageUserActions.getPageData(userId)));
    } catch (err) {
      console.error(err);
      dispatch(addErrorNotification(err.message));
    }
  };

  useEffect(() => {
    if (owner && owner.id) {
      getPageData(owner.id);
    }
  }, [owner]);

  return (
    <LayoutBase>
      <PostsGridWrapper ids={state.topPostsIds} />

      <div className="content">
        <div className="content__inner">
          <div className="grid grid_content">
            <div className="grid__item grid__item_main">
              {owner && owner.id &&
                <Feed userId={owner.id} feedTypeId={USER_NEWS_FEED_ID} />
              }
            </div>

            <div className="grid__item grid__item_side">
              <div className="sidebar sidebar_main">
                {owner && owner.iFollow &&
                  <EntryListSectionUsersWrapper
                    title="People"
                    limit={8}
                    count={owner.iFollow.length}
                    ids={owner.iFollow}
                  />
                }

                <EntryListSectionOrgsWrapper
                  title="Communities"
                  limit={8}
                  count={state.orgs.metadata.totalAmount}
                  ids={state.orgs.ids}
                  popupIds={state.orgsPopup.ids}
                  popupMetadata={state.orgsPopup.metadata}
                  // onChangePage={page => getOrganizationsForPopup(page, state.activeTabId)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="content__inner">
          <Footer />
        </div>
      </div>
    </LayoutBase>
  );
};

export default HomeUserPage;
