import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styles from './styles.css';
import Resource from './Resource';
import Placeholder from './Placeholder';
import Panel from '../Panel';

const Resources = ({ sections, showPlaceholder }) => {
  if (!sections.length && !showPlaceholder) {
    return null;
  }

  return showPlaceholder ? (
    <Placeholder />
  ) : (
    <Fragment>
      {sections.map((section, index) => (
        <div className={styles.section} key={index}>
          <div className={styles.title}>{section.title}</div>
          <Panel actions={section.actions}>
            <div
              className={classNames({
                [styles.container]: true,
                [styles.flat]: section.list.length > 1,
              })}
            >
              {section.list.map((item, index) => (
                <Resource {...item} key={index} />
              ))}
            </div>
          </Panel>
        </div>
      ))}
    </Fragment>
  );
};

Resources.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    actions: Panel.propTypes.actions,
    list: PropTypes.arrayOf(PropTypes.shape(Resource.propTypes)).isRequired,
  })),
  showPlaceholder: PropTypes.bool,
};

Resources.defaultProps = {
  sections: [],
  showPlaceholder: false,
};

export default Resources;
