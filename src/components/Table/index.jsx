import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import IconTableTriangle from '../Icons/TableTriangle';

const Table = ({ cols, data, onSort }) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      <thead className={styles.header}>
        <tr className={styles.row}>
          {cols.map((col, index) => (
            <td
              role="presentation"
              key={index}
              className={classNames({
                [styles.cell]: true,
                [styles.hideOnSmall]: col.hideOnSmall,
                [styles.right]: col.right,
                [styles.sortable]: col.sortable,
              })}
              style={{
                width: col.width,
                minWidth: col.minWidth,
              }}
              onClick={() => {
                if (col.sortable && onSort) {
                  onSort(col);
                }
              }}
            >
              {col.title}
              {col.sortable && col.sorted &&
                <span className={styles.sort}>
                  <span
                    className={classNames({
                      [styles.icon]: true,
                      [styles.reverse]: col.reverse,
                    })}
                  >
                    <IconTableTriangle />
                  </span>
                </span>
              }
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
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      }
    </table>
  </div>
);

Table.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    hideOnSmall: PropTypes.bool,
    right: PropTypes.bool,
    width: PropTypes.string,
    minWidth: PropTypes.string,
    reverse: PropTypes.bool,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
  onSort: PropTypes.func,
};

Table.defaultProps = {
  data: [],
  onSort: undefined,
};

export * from './wrappers';
export default Table;
