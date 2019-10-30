import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import React, { PureComponent } from 'react';

class LoadMore extends PureComponent {
  constructor(props) {
    super(props);

    this.onScroll = throttle(() => {
      if (!this.el || this.hasBottom) {
        return;
      }

      const rect = this.el.getBoundingClientRect();

      const factor = rect.top - window.innerHeight;

      if (factor < 0 || factor > 800) {
        return;
      }

      if (this.props.onClick) {
        this.props.onClick();
      }
    }, 500);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const ButtonTag = this.props.url ? Link : 'button';

    return (
      <div ref={(el) => { this.el = el; }}>
        <ButtonTag
          to={this.props.url}
          className={classNames(
            'button',
            'button_theme_thin',
            'button_size_medium',
            'button_stretched',
            { 'button_disabled': this.props.disabled },
          )}
          disabled={this.props.disabled}
          onClick={() => {
            if (this.props.onClick) {
              this.props.onClick();
            }
          }}
        >
          {this.props.t('Load more')}
        </ButtonTag>
      </div>
    );
  }
}

LoadMore.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  url: PropTypes.string,
  t: PropTypes.func.isRequired,
};

LoadMore.defaultProps = {
  url: null,
  disabled: false,
  onClick: null,
};

export default withTranslation()(LoadMore);
