import { Trans } from 'react-i18next';
import classNames from 'classnames';
import Tippy from '@tippy.js/react';
import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { memo, useRef } from 'react';
import UserPick from '../../../components/UserPick';
import IconMenuTrigger from '../../../components/Icons/MenuTrigger';
import { UserCard, OrgCard } from '../../../components/EntryCard';
import { selectOwner, selectOrgById } from '../../../store/selectors';
import { getUserName } from '../../../utils/user';
import urls from '../../../utils/urls';
import * as editPostActions from '../../../actions/pages/editPost';
import styles from './styles.css';

const CreateBy = () => {
  const tippyInstance = useRef();
  const dispatch = useDispatch();
  const owner = useSelector(selectOwner, isEqual);
  const state = useSelector(state => state.pages.editPost, (prev, next) => (
    prev.data.organizationId === next.data.organizationId &&
    prev.data.id === next.data.id
  ));
  const org = useSelector(selectOrgById(state.data.organizationId), isEqual);
  const enabled = !state.data.id;

  const selectOrg = (organizationId) => {
    if (tippyInstance.current) {
      tippyInstance.current.hide();
    }
    dispatch(editPostActions.changeData({ organizationId }));
  };

  if (!owner.id) {
    return null;
  }

  return (
    <Tippy
      arrow
      interactive
      isEnabled={enabled}
      trigger="click"
      animation="fade"
      theme="dropdown"
      onCreate={(instance) => {
        tippyInstance.current = instance;
      }}
      content={(
        <div className={styles.list}>
          <div
            role="presentation"
            className={classNames({
              [styles.item]: true,
              [styles.active]: !state.data.organizationId,
            })}
            onClick={() => {
              selectOrg(null);
            }}
          >
            <UserCard userId={owner.id} disabledLink disableRate />
          </div>
          {owner.organizations.map(id => (
            <div
              role="presentation"
              key={id}
              className={classNames({
                [styles.item]: true,
                [styles.active]: state.data.organizationId === id,
              })}
              onClick={() => {
                selectOrg(id);
              }}
            >
              <OrgCard orgId={id} disabledLink disableRate />
            </div>
          ))}
        </div>
      )}
    >
      <span className={styles.createBy}>
        <span
          className={classNames({
            [styles.inner]: true,
            [styles.enabled]: enabled,
          })}
        >
          <Trans i18nKey="By" title={org ? org.title : getUserName(owner)}>
            By
            <UserPick
              organization={!!state.data.organizationId}
              size={24}
              src={urls.getFileUrl((org || owner).avatarFilename)}
            />
            <span className={styles.name}>
              {{ title: org ? org.title : getUserName(owner) }}
            </span>
          </Trans>

          {enabled &&
            <span className={styles.trigger}>
              <IconMenuTrigger />
            </span>
          }
        </span>
      </span>
    </Tippy>
  );
};

export default memo(CreateBy);
