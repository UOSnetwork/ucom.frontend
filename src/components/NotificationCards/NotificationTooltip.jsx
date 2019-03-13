import { throttle } from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { bindActionCreators } from 'redux';
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import IconClose from '../Icons/Close';
import NotificationCard from './NotificationCard';
import {
  siteNotificationsAddItems,
  siteNotificationsDeleteItems,
  fetchNotifications,
} from '../../actions/siteNotifications';

const isRequiredTime = (arr, isEarly = true) => Object.values(arr)
  .some(i => i.finished === isEarly);

const filterNotifs = (arr, isEarly = true) => Object.values(arr)
  .filter(i => i.finished === isEarly)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

class NotificationTooltip extends Component {
  constructor(props) {
    super(props);
    this.tooltip = createRef();
    this.notificationsContent = createRef();

    const notificationTrigger = new CustomEvent('NotificationTrigger');

    this.onScrollY = throttle((container) => {
      if (container.scrollTop + container.offsetHeight + 100 > this.notificationsContent.current.offsetHeight) {
        try {
          window.dispatchEvent(notificationTrigger);
        } catch (e) {
          console.error(e);
        }
      }
    }, 10);
  }

  componentDidMount() {
    window.addEventListener('NotificationTrigger', this.loadMore);
    document.addEventListener('click', this.hideIfOut);
    document.onwheel = this.checkScroll;
  }

  componentWillUnmount() {
    window.removeEventListener('NotificationTrigger', this.loadMore);
    document.removeEventListener('click', this.hideIfOut);
    document.onwheel = null;
  }

  loadMore = () => {
    if (this.props.loading) {
      return;
    }

    const { hasMore } = this.props.notificationsMetadata;

    if (hasMore) {
      this.props.fetchNotifications({
        page: ++this.props.notificationsMetadata.page,
        perPage: this.props.notificationsMetadata.perPage,
      });
    }
  };

  hideIfOut = (e) => {
    if (!this.tooltip.current.contains(e.target)) {
      this.props.hideTooltip();
    }
  }

  checkScroll = (e) => {
    if (!e.path.every(i => i !== this.tooltip.current)) {
      const area = e.target;
      const delta = e.deltaY || e.detail || e.wheelDelta;

      if (delta < 0 && area.scrollTop === 0) {
        e.preventDefault();
      }

      if (delta > 0 && area.scrollHeight - area.clientHeight - area.scrollTop <= 1) {
        e.preventDefault();
      }
    }
  }

  render() {
    const { list, notificationsMetadata } = this.props;
    const newNotifications = filterNotifs(list, false);
    const oldNotifications = filterNotifs(list, true);

    return (
      <div ref={this.tooltip} className="notification-tooltip">
        <div className="arrow-big" />
        <PerfectScrollbar
          className="notification-tooltip__container"
          onScrollY={this.onScrollY}
        >
          <div ref={this.notificationsContent}>
            {isRequiredTime(list, false) &&
              <div className="notification-tooltip__header">
                <h3 className="notification-tooltip__title">New notifications
                </h3>
              </div>
            }

            {!Object.values(list).length && !this.props.loading &&
              <div className="notification-tooltip__header notification-tooltip__header_center">
                <h3 className="notification-tooltip__title">No notifications</h3>
              </div>
            }

            {!Object.values(list).length && this.props.loading &&
              <div className="notification-tooltip__header notification-tooltip__header_center">
                <h3 className="notification-tooltip__title">Loading...</h3>
              </div>
            }

            {newNotifications && newNotifications.length > 0 &&
              <div className="notification-tooltip__list notification-tooltip__list_new">
                <TransitionGroup>
                  {newNotifications.map(item => (
                    <CSSTransition key={item.id} timeout={200} classNames="fade">
                      <div key={item.id} className="notification-tooltip__item notification-tooltip__item_new">
                        <NotificationCard {...item} />
                      </div>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </div>
            }

            {isRequiredTime(list, true) &&
              <div className="notification-tooltip__header">
                <h3 className="notification-tooltip__title">Early</h3>
              </div>
            }

            {oldNotifications && oldNotifications.length > 0 &&
              <div className="notification-tooltip__list">
                <TransitionGroup>
                  {oldNotifications.map(item => (
                    <CSSTransition key={item.id} timeout={200} classNames="fade">
                      <div key={item.id} className="notification-tooltip__item">
                        <NotificationCard {...item} />
                      </div>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </div>
            }

            {notificationsMetadata.hasMore &&
              <div className="notification-tooltip__loading">Loading...</div>
            }
          </div>

          <div
            className="inline__item notification-tooltip__close"
            onClick={() => this.props.hideTooltip()}
            role="presentation"
          >
            <IconClose />
          </div>
        </PerfectScrollbar>
      </div>
    );
  }
}

NotificationTooltip.propTypes = {
  fetchNotifications: PropTypes.func.isRequired,
  list: PropTypes.objectOf(PropTypes.any),
  notificationsMetadata: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.bool,
};

export default connect(
  state => ({
    tooltipVisibilty: state.siteNotifications.tooltipVisibilty,
    list: state.siteNotifications.list,
    loading: state.siteNotifications.loading,
    notificationsMetadata: state.siteNotifications.metadata,
  }),
  dispatch => bindActionCreators({
    siteNotificationsAddItems,
    siteNotificationsDeleteItems,
    fetchNotifications,
  }, dispatch),
)(NotificationTooltip);
