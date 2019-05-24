/* eslint-disable global-require, new-cap */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { addErrorNotification } from '../../actions/notifications';
import TributeWrapper from '../TributeWrapper';
import './styles.css';

class Medium extends PureComponent {
  componentDidMount() {
    const MediumEditor = require('medium-editor');
    const MediumUpload = require('./Upload/index');
    const MediumPost = require('./Post/index');
    const MediumNav = require('./Nav/index');
    const FileDragging = require('./FileDragging');
    const ImageFromLink = require('./ImageFromLink');

    this.mediumEditor = new MediumEditor(this.el, {
      toolbar: {
        buttons: ['h1', 'h2', 'bold', 'italic', 'underline', 'strikethrough', 'anchor', 'quote', 'orderedlist', 'unorderedlist'],
      },
      placeholder: false,
      autoLink: true,
      extensions: {
        mediumNav: new MediumNav.default(),
        imageFromLink: new ImageFromLink.default(),
        fileDragging: new FileDragging.default({
          onError: message => this.props.addErrorNotification(message),
        }),
        mediumPost: new MediumPost.default(),
        mediumUpload: new MediumUpload.default({
          onError: message => this.props.addErrorNotification(message),
          onUploadStart: () => this.props.onUploadStart(),
          onUploadDone: () => this.props.onUploadDone(),
          onEmbed: (data) => {
            console.log(data);
          },
        }),
      },
    });

    if (this.props.value) {
      this.mediumEditor.setContent(this.props.value);
    }

    this.mediumEditor.subscribe('editableInput', () => {
      this.props.onChange(this.mediumEditor.getContent());
    });
  }

  componentDidUpdate() {
    if (this.props.value && this.props.value !== this.mediumEditor.getContent()) {
      this.mediumEditor.setContent(this.props.value);
    }
  }

  componentWillUnmount() {
    this.mediumEditor.destroy();
  }

  render() {
    return (
      <TributeWrapper onChange={e => this.props.onChange(e)}>
        <div className="post-content" ref={(el) => { this.el = el; }} />
      </TributeWrapper>
    );
  }
}

Medium.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onUploadStart: PropTypes.func,
  onUploadDone: PropTypes.func,
  addErrorNotification: PropTypes.func.isRequired,
};

Medium.defaultProps = {
  value: null,
  onChange: null,
  onUploadStart: null,
  onUploadDone: null,
};

export default connect(
  null,
  dispatch => bindActionCreators({
    addErrorNotification,
  }, dispatch),
)(Medium);
