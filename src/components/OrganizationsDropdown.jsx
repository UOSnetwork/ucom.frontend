import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { Tooltip } from 'react-tippy';
import { selectUser } from '../store/selectors';
import { getUserName } from '../utils/user';
import { fetchMyself } from '../actions/users';
import urls from '../utils/urls';
import EntryCard from './EntryCard';

class OrganizationsDropdown extends PureComponent {
  state = {
    tooltipIsVisible: false,
  }

  hideTooltip = () => {
    this.setState({ tooltipIsVisible: false });
  }

  showTooltip = () => {
    this.props.fetchMyself();
    this.setState({ tooltipIsVisible: true });
  }

  triggerTooltip = () => (
    this.state.tooltipIsVisible ? this.hideTooltip() : this.showTooltip()
  );

  select(organizationId) {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(organizationId);
    }

    this.hideTooltip();
  }

  render() {
    const organizationsContent = (
      <div className="organizations-dropdown__content">
        <div className="organizations-dropdown__list">
          <div
            role="presentation"
            onClick={() => this.select(null)}
            className="organizations-dropdown__item"
          >
            <EntryCard
              disableRate
              disabledLink
              avatarSrc={urls.getFileUrl(this.props.user.avatarFilename)}
              title={getUserName(this.props.user)}
              nickname={this.props.user.accountName}
            />
          </div>
          {(this.props.user.organizations || []).map(item => (
            <div
              key={item.id}
              role="presentation"
              onClick={() => this.select(item.id)}
              className="organizations-dropdown__item"
            >
              <EntryCard
                disableRate
                disabledLink
                organization
                avatarSrc={urls.getFileUrl(item.avatarFilename)}
                title={item.title}
                nickname={item.nickname}
              />
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="organizations-dropdown">
        <Tooltip
          arrow
          useContext
          open={this.state.tooltipIsVisible}
          onRequestClose={this.hideTooltip}
          interactive
          position="bottom"
          trigger="click"
          theme="dropdown"
          html={organizationsContent}
        >
          <div onClick={this.triggerTooltip} className="organizations-dropdown__toggler" role="presentation" />
        </Tooltip>
      </div>
    );
  }
}

OrganizationsDropdown.propTypes = {
  onSelect: PropTypes.func,
  fetchMyself: PropTypes.func,
};

export default connect(
  state => ({
    user: selectUser(state),
  }),
  dispatch => bindActionCreators({
    fetchMyself,
  }, dispatch),
)(OrganizationsDropdown);
