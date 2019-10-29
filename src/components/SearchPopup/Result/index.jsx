import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { UsersEntryList, OrgsEntryList, TagsEntryList } from '../../EntryList';
import IconArrowRight from '../../Icons/ArrowRight';
import urls from '../../../utils/urls';
import { OVERVIEW_ROUTES, OVERVIEW_ROUTES_COMMUNITIES_ID, OVERVIEW_ROUTES_TAGS_ID } from '../../../utils/overview';
import styles from './styles.css';

const Result = () => {
  const { t } = useTranslation();
  const state = useSelector(state => state.searchPopup);

  return (
    <div
      className={styles.result}
    >
      <div className={styles.inner}>
        <div>
          <div className={styles.title}>{t('Members')}</div>
          {!state.loading && !state.result.users.ids.length &&
            <div className={styles.notFound}>{t('Not found')}</div>
          }
          <div className={styles.list}>
            <UsersEntryList ids={state.result.users.ids} />
          </div>
          {state.result.users.hasMore &&
            <Link
              className={styles.footer}
              to={urls.getUsersPagingUrl({
                userName: state.query,
              })}
            >
              {t('View All')} <IconArrowRight />
            </Link>
          }
        </div>
        <div>
          <div className={styles.title}>{t('Communities')}</div>
          {!state.loading && !state.result.orgs.ids.length &&
            <div className={styles.notFound}>{t('Not found')}</div>
          }
          <div className={styles.list}>
            <OrgsEntryList ids={state.result.orgs.ids} />
          </div>
          {state.result.orgs.hasMore &&
            <Link
              className={styles.footer}
              to={urls.getOverviewCategoryUrl({
                route: OVERVIEW_ROUTES.find(i => i.id === OVERVIEW_ROUTES_COMMUNITIES_ID).name,
              })}
            >
              {t('View All')} <IconArrowRight />
            </Link>
          }
        </div>

        <div>
          <div className={styles.title}>{t('Tags')}</div>
          {!state.loading && !state.result.tags.titles.length &&
            <div className={styles.notFound}>{t('Not found')}</div>
          }
          <div className={styles.list}>
            <TagsEntryList titles={state.result.tags.titles} />
          </div>
          {state.result.orgs.hasMore &&
            <Link
              className={styles.footer}
              to={urls.getOverviewCategoryUrl({
                route: OVERVIEW_ROUTES.find(i => i.id === OVERVIEW_ROUTES_TAGS_ID).name,
              })}
            >
              {t('View All')} <IconArrowRight />
            </Link>
          }
        </div>
      </div>
    </div>
  );
};

export default Result;
