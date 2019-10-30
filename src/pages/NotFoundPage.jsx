import { useTranslation, Trans } from 'react-i18next';
import React from 'react';
import { NavLink } from 'react-router-dom';
import GoBackIcon from '../components/Icons/GoBack';
import LayoutBase from '../components/Layout/LayoutBase';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <LayoutBase>
      <div className="not-found-page">
        <div className="not-found-page__title-wrapper">
          <div className="not-found-page__title">{t('Page not found')}</div>
          <div className="not-found-page__title-back">404</div>
        </div>
        <div className="not-found-page__info">
          <Trans i18nKey="We cant find the page">
            We can&rsquo;t find the page that&nbsp;you&rsquo;re&nbsp;looking&nbsp;for&nbsp;:(<br />Please try repeat this request later.
          </Trans>
        </div>
        <NavLink to="/">
          <div className="not-found-page__link">
            <GoBackIcon />
            <div>{t('Go back home')}</div>
          </div>
        </NavLink>
      </div>
    </LayoutBase>
  );
};

export default NotFoundPage;
