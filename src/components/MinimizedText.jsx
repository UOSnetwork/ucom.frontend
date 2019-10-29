import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import { sanitizeCommentText, checkMentionTag, checkHashTag } from '../utils/text';

// TODO: To css modules
// TODO: Add wrapper like panelwrapper
const MinimizedText = (props) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames({
        'text': true,
        'text_gray': props.gray,
      })}
    >
      <div
        className={classNames(
          'text__content',
          { 'text__content_minimized': props.enabled && props.minimized },
        )}
      >
        <p
          dangerouslySetInnerHTML={{
            __html: sanitizeCommentText(checkMentionTag(checkHashTag(props.text))),
          }}
        />
      </div>

      {props.enabled ? (
        <Fragment>
          {props.disabledHide && !props.minimized ? null : (
            <div className="text__show-more">
              <button
                className="link red-hover"
                onClick={() => {
                  if (props.onClickShowMore) {
                    props.onClickShowMore();
                  }
                }}
              >
                {props.minimized ? t('Show More') : t('Hide More')}
              </button>
            </div>
          )}
        </Fragment>
      ) : null}
    </div>
  );
};


MinimizedText.propTypes = {
  enabled: PropTypes.bool,
  minimized: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onClickShowMore: PropTypes.func,
  disabledHide: PropTypes.bool,
  gray: PropTypes.bool,
};

MinimizedText.defaultProps = {
  enabled: true,
  minimized: true,
  onClickShowMore: null,
  disabledHide: false,
  gray: false,
};

export default MinimizedText;
