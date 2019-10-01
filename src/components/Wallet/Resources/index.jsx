import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import Resource from './Resource';
import Panel from '../Panel';

const Resources = ({ sections }) => {
  if (!sections.length) {
    return null;
  }

  return (
    <div className={styles.resources}>
      {sections.map((section, index) => (
        <div className={styles.section} key={index}>
          <div className={styles.title}>{section.title}</div>
          <Panel actions={section.actions}>
            <div
              className={classNames({
                [styles.resource]: true,
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
    </div>
  );
};

Resources.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    actions: Panel.propTypes.actions,
    list: PropTypes.arrayOf(PropTypes.shape(Resource.propTypes)).isRequired,
  })),
};

Resources.defaultProps = {
  sections: [],
};

export default Resources;
