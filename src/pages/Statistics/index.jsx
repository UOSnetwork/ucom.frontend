import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import LayoutBase from '../../components/Layout/LayoutBase';
import api from '../../api';
import styles from './styles.css';

const { ParamTypes } = require('ucom.libs.common').Stats.Dictionary;

const statisticRows = [
  { title: 'Members', field: 'USERS_PERSON', fields: [] },
  { title: 'Content', fields: ['ORGS_PERSON', 'TAGS_PERSON', 'POSTS_MEDIA', 'POSTS_DIRECT'] },
  { title: 'Communities', field: 'ORGS_PERSON' },
  { title: 'Tags', field: 'TAGS_PERSON' },
  { title: 'Publications', field: 'POSTS_MEDIA' },
  { title: 'Posts', field: 'POSTS_DIRECT' },
  { title: 'Feedback', fields: ['COMMENTS_PARENT', 'COMMENTS_REPLY'] },
  { title: 'Comments', field: 'COMMENTS_PARENT' },
  { title: 'Replies', field: 'COMMENTS_REPLY' },
  { title: 'Actions', fields: ['ACTIVITIES_VOTE_UPVOTE', 'ACTIVITIES_VOTE_DOWNVOTE'] },
  { title: 'Upvotes', field: 'ACTIVITIES_VOTE_UPVOTE' },
  { title: 'Downvotes', field: 'ACTIVITIES_VOTE_DOWNVOTE' },
  { title: 'Shares', fields: ['POSTS_REPOST_MEDIA', 'POSTS_REPOST_DIRECT'] },
  { title: 'Publications', field: 'POSTS_REPOST_MEDIA' },
  { title: 'Posts', field: 'POSTS_REPOST_DIRECT' },
];

const statisticColumns = ['NUMBER', 'DELTA_PT24H'];

function useForceUpdate() {
  const [value, set] = useState(true); // boolean state
  return () => set(!value); // toggle the state to force render
}

const Statistics = () => {
  const [stats, setStats] = useState([]);

  const forceUpdate = useForceUpdate();

  const fetchStats = async () => {
    const res = await api.getStats();
    setStats(res);
  };

  useEffect(() => {
    fetchStats();
    const intervalID = setInterval(forceUpdate, 1000 * 60 * 30);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <LayoutBase>
      <div className="content">
        <div className="content">
          <h1 className="title">U°Community Statistics</h1>
          <div className="content__inner">
            <div className={styles.table}>
              <table className={styles.list}>
                <thead className={styles.head}>
                  <tr>
                    {['', 'Total', '24hr'].map((item, index) => (
                      <td
                        key={index}
                        role="presentation"
                        className=""
                      >
                        <div className={styles.title}>
                          {item}
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className={styles.body}>
                  {!_.isEmpty(stats) ? statisticRows.map((item, index) => (
                    <tr className={item.fields ? styles.captionRow : styles.row} key={index}>
                      <td><div className={item.fields ? styles.title : styles.caption}>{item.title}</div></td>
                      {statisticColumns.map((period, index1) => (
                        <td key={index1}>
                          <div className={styles.usualItem}>
                            {item.fields && item.fields.length ? item.fields.reduce((prev, cur) => prev + stats[ParamTypes[`${cur}__${period}`]].value, 0) : stats[ParamTypes[`${item.field}__${period}`]].value}
                          </div>
                        </td>))}
                    </tr>
                  )) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <div className="content">
          <div className="content__inner">
            <Footer />
          </div>
        </div> */}
      </div>
    </LayoutBase>
  );
};

export default Statistics;
