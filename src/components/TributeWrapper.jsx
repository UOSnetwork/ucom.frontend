import { isObject } from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { defaultTributeConfig } from '../utils/tribute';
import { getImageFromPasteEvent } from '../utils/upload';
import { IMG_URL_REGEXP } from '../utils/text';

const VISUAL_DELAY = 1000;

class TributeWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.element = React.createRef();
  }

  componentDidMount() {
    const Tribute = require('tributejs'); //eslint-disable-line

    this.tribute = new Tribute({ ...defaultTributeConfig, ...this.props.config });
    this.tribute.attach(this.element);

    if (this.props.onChange) {
      this.element.addEventListener('tribute-replaced', this.onChangeValue);
    }

    if (this.props.onImage) {
      this.element.addEventListener('paste', this.onPaste.bind(this));
    }
  }

  componentWillUnmount() {
    this.tribute.detach(this.element);

    if (this.props.onChange) {
      this.element.removeEventListener('tribute-replaced', this.onChangeValue);
    }

    if (this.props.onImage) {
      this.element.removeEventListener('paste', this.onPaste.bind(this));
    }
  }

  async onPaste(event) {
    const { onImage } = this.props;
    const blob = await getImageFromPasteEvent(event);

    if (blob !== null) {
      onImage(blob);
    }
  }

  onChangeValue = () => {
    this.props.onChange(this.element.value || this.element.innerHTML);
  }

  render() {
    return (
      React.cloneElement(this.props.children, {
        ref: (element) => {
          this.element = element;

          if (typeof this.props.children.ref === 'function') {
            this.props.children.ref(element);
          } else if (isObject(this.props.children.ref)) {
            this.props.children.ref.current = element;
          }
        },
        onChange: this.props.enabledImgUrlParse ? (e) => {
          this.props.onChange(e.target.value);

          if (e.target.value.match(IMG_URL_REGEXP)) {
            e.persist();
            setTimeout(() => {
              this.props.onChange(e.target.value.replace(IMG_URL_REGEXP, (url) => {
                this.props.onParseImgUrl(url);
                return '';
              }));
            }, VISUAL_DELAY);
          }
        } : (e) => {
          this.props.onChange(e.target.value);
        },
      })
    );
  }
}

TributeWrapper.propTypes = {
  children: PropTypes.shape({
    ref: PropTypes.any,
  }).isRequired,
  config: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
  onImage: PropTypes.func,
  onParseImgUrl: PropTypes.func,
  enabledImgUrlParse: PropTypes.bool,
};

TributeWrapper.defaultProps = {
  config: {},
  onChange: null,
  onImage: null,
  onParseImgUrl: null,
  enabledImgUrlParse: false,
};

export default TributeWrapper;
