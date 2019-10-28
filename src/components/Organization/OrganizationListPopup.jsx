import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import React from 'react';
import { getOrganizationById } from '../../store/organizations';
import { getOrganizationUrl } from '../../utils/organization';
import OrganizationCard from './OrganizationCard';
import Popup from '../Popup';
import ModalContent from '../ModalContent';
import Rate from '../Rate';
import urls from '../../utils/urls';

const OrganizationListPopup = (props) => {
  const { t } = useTranslation();

  if (!props.organizationsIds || !props.organizationsIds.length) {
    return null;
  }

  const organizations = props.organizationsIds
    .map(id => getOrganizationById(props.organizations, id))
    .filter(e => e);
  return (
    <Popup onClickClose={props.onClickClose}>
      <ModalContent onClickClose={props.onClickClose}>
        <div className="entry-list entry-list_simple">
          <div className="entry-list__title">{t('Organizations')}</div>

          <div className="entry-list__list">
            {organizations.map((item, index) => (
              <div className="entry-list__item" key={index}>
                <div className="entry-list__card">
                  <OrganizationCard
                    avatarSrc={urls.getFileUrl(item.avatarFilename)}
                    title={item.title}
                    nickname={item.nickname}
                    url={getOrganizationUrl(item.id)}
                  />
                </div>
                <div className="entry-list__rate">
                  <Rate value={+item.currentRate} className="rate_small" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalContent>
    </Popup>
  );
};

export default connect(state => ({
  organizations: state.organizations,
}))(OrganizationListPopup);
