import { EVENT_ID_USER_TRUSTS_YOU, EVENT_ID_USER_UNTRUSTS_YOU } from './index';

export const getAutoupdateEventId = post => (post && post.jsonData && post.jsonData.metaData && post.jsonData.metaData.eventId) || null;

export const getAutoupdateTargetEntity = post => (post && post.jsonData && post.jsonData.targetEntity) || null;

export const getAutoupdateData = post => (post && post.jsonData && post.jsonData.data) || null;

export const getAutoupdateLabelByEventId = (eventId) => {
  switch (eventId) {
    case EVENT_ID_USER_TRUSTS_YOU:
      return 'Trust';
    case EVENT_ID_USER_UNTRUSTS_YOU:
      return 'Untrust';
    default:
      return null;
  }
};
