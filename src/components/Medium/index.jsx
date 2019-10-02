/* eslint-disable global-require, new-cap */

// TODO: Replace medium editor to draft.js

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { addErrorNotification } from '../../actions/notifications';
import TributeWrapper from '../TributeWrapper';
import EmbedService from '../../utils/embedService';
import './styles.css';

// TODO: Refactoring all medium components
class Medium extends PureComponent {
  componentDidMount() {
    const MediumEditor = require('medium-editor');
    const MediumUpload = require('./Upload/index');
    const MediumPost = require('./Post/index');
    const MediumNav = require('./Nav/index');
    const FileDragging = require('./FileDragging');
    const ImageFromLink = require('./ImageFromLink');
    const CodePaste = require('./CodePaste');

    this.mediumEditor = new MediumEditor(this.el, {
      toolbar: {
        buttons: ['h1', 'h2', 'bold', 'italic', 'underline', 'strikethrough', 'anchor', 'quote', 'pre', 'orderedlist', 'unorderedlist'],
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
            this.props.onEmbed(data);
          },
        }),
        codePaste: new CodePaste.default(),
      },
    });

    if (this.props.value) {
      this.mediumEditor.setContent(this.props.value);
    }

    this.mediumEditor.subscribe('editableInput', () => {
      const html = this.mediumEditor.getContent();
      if (this.props.value !== html) {
        this.onChange(html);
      }
    });

    EmbedService.renderEmbeds(this.el, this.props.entityImages);
  }

  componentDidUpdate() {
    if (this.props.value && this.props.value !== this.content) {
      this.mediumEditor.setContent(this.props.value);
    }
    EmbedService.renderEmbeds(this.el, this.props.entityImages);
  }

  componentWillUnmount() {
    this.mediumEditor.destroy();
  }

  onChange(html) {
    const data = this.parseContent(html);
    this.content = data.html;
    this.props.onChange(data);
  }

  parseContent(html) {
    let result = html;
    const urls = [];
    const embeds = html.match(/<div data-embed="(.*?)">(.*?)<\/div>/g);

    if (embeds) {
      embeds.forEach((embed) => {
        try {
          const url = embed.match(/data-embed="(.*?)"/)[0].match(/"(.*?)"/)[1];
          result = result.replace(embed, EmbedService.renderEmbedLink(url));
          urls.push(url);
        } catch (err) {
          console.error(err);
        }
      });
    }

    return {
      urls,
      html: result,
    };
  }

  render() {
    return (
      <TributeWrapper onChange={e => this.onChange(e)}>
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
  onEmbed: PropTypes.func.isRequired,
  addErrorNotification: PropTypes.func.isRequired,
};

Medium.defaultProps = {
  value: undefined,
  onChange: undefined,
  onUploadStart: undefined,
  onUploadDone: undefined,
};

export default connect(
  null,
  dispatch => bindActionCreators({
    addErrorNotification,
  }, dispatch),
)(Medium);
