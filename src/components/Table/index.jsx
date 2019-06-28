import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

const Table = ({ cols, data, template }) => (
  <table className={styles.table}>
    <thead className={styles.header}>
      <tr className={styles.row}>
        {cols.map((col, index) => (
          <td
            key={index}
            className={classNames({
              [styles.cell]: true,
              [styles.hideOnSmall]: cols[index].hideOnSmall,
              [styles.right]: cols[index].right,
            })}
            style={{ width: template[index] }}
          >
            {col.title}
          </td>
        ))}
      </tr>
    </thead>
    {data.length > 0 &&
      <tbody className={styles.body}>
        {data.map((row, index) => (
          <tr
            key={index}
            className={styles.row}
          >
            {row.map((cell, index) => (
              <td
                key={index}
                className={classNames({
                  [styles.cell]: true,
                  [styles.hideOnSmall]: cols[index].hideOnSmall,
                  [styles.right]: cols[index].right,
                })}
                style={{ width: template[index] }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    }
  </table>
);

Table.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
  template: PropTypes.arrayOf(PropTypes.string),
};

Table.defaultProps = {
  data: [],
  template: [],
};

export default Table;
